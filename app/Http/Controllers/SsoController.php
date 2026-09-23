<?php


namespace App\Http\Controllers;

use App\Models\User;
use App\Models\SsoProvider;
use App\Models\UserSsoAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SsoController extends Controller
{
    // 1. Redirect ke Provider
    public function redirectToProvider($providerCode)
    {
        $provider = SsoProvider::where('code', $providerCode)->where('is_active', true)->firstOrFail();
        return Socialite::driver($provider->code)->redirect();
    }

    // 2. Handle Callback dari Provider
    public function handleProviderCallback($providerCode)
    {
        $provider = SsoProvider::where('code', $providerCode)->where('is_active', true)->firstOrFail();

        try {
            $socialUser = Socialite::driver($provider->code)->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('sso_error', 'Gagal autentikasi dengan ' . $provider->code);
        }

        $ssoAccount = UserSsoAccount::where('sso_provider_id', $provider->id)
            ->where('provider_account_id', $socialUser->getId())
            ->first();

        // Skenario A: User sudah login, mereka ingin MENGHUBUNGKAN (Assign) akun
        if (Auth::check()) {
            if ($ssoAccount && $ssoAccount->user_id !== Auth::id()) {
                return redirect()->back()->withErrors(['error' => 'Akun SSO ini sudah terhubung dengan akun lain!']);
            }

            if (!$ssoAccount) {
                UserSsoAccount::create([
                    'user_id' => Auth::id(),
                    'sso_provider_id' => $provider->id,
                    'provider_account_id' => $socialUser->getId(),
                    'provider_account_email' => $socialUser->getEmail(),
                ]);
            }
            return redirect()->route('profile.edit')->with('success', 'Akun ' . $provider->code . ' berhasil ditautkan.');
        }

        // Skenario B: User belum login, mereka ingin LOGIN via SSO
        if ($ssoAccount) {
            // Akun SSO sudah ada di database, langsung login
            Auth::login($ssoAccount->user);
            return redirect()->route('dashboard');
        } else {
            // Jika akun SSO belum pernah terdaftar
            if (!$provider->can_register) {
                // Tolak jika provider tidak mengizinkan registrasi otomatis
                return redirect()->route('login')->with('sso_info', 'SSO Belum terdaftar. Silahkan hubungi Admin untuk mendaftarkan SSO Anda.');
            }


            // SSO belum terdaftar. Kita bisa buatkan user baru, atau menolak.
            // Contoh: Buat user otomatis berdasarkan email SSO

            $raw = $socialUser->getRaw();

            $user = User::firstOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'code' => $socialUser->getCode() ?? $socialUser->getNickcode(),
                    'username' => $socialUser->getNickcode() ?? $raw['username'],
                    'password' => bcrypt(Str::random(16)) // Password acak karena login via SSO
                ]
            );

            // Tautkan SSO ke user baru ini
            UserSsoAccount::create([
                'user_id' => $user->id,
                'sso_provider_id' => $provider->id,
                'provider_account_id' => $socialUser->getId(),
                'provider_account_email' => $socialUser->getEmail(),
            ]);

            Auth::login($user);
            return redirect()->route('dashboard');
        }
    }

    // 3. Lepas (Unlink) Akun SSO
    public function unlinkProvider($providerCode)
    {
        $provider = SsoProvider::where('code', $providerCode)->firstOrFail();

        // Hapus tautan SSO dari user yang sedang login
        UserSsoAccount::where('user_id', Auth::id())
            ->where('sso_provider_id', $provider->id)
            ->delete();

        return redirect()->back()->with('success', 'Akun ' . $provider->code . ' berhasil dilepas.');
    }
}
