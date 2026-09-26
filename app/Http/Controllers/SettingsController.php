<?php

namespace App\Http\Controllers;

use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller implements HasMiddleware
{
    /**
     * Define the middleware for this controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('can:settings.view', only: ['edit']),
            new Middleware('can:settings.edit', only: ['update']),
        ];
    }

    /**
     * Show the settings form.
     */
    public function edit(GeneralSettings $settings)
    {
        return \Inertia\Inertia::render('settings/app', [
            'settings' => $settings->toArray()
        ]);
    }

    /**
     * Update the settings.
     */
    public function update(Request $request, GeneralSettings $settings)
    {
        $request->validate([
            'app_title' => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:255'],
            'company_year' => ['required', 'string', 'max:4'],
            'app_description' => ['required', 'string'],
            'allow_registration' => 'nullable|boolean',

            'favicon' => ['nullable', 'file', 'image', 'mimes:ico,png', 'max:1024'], // Max 1MB
            'app_logo' => ['nullable', 'file', 'image', 'mimes:png,jpg,jpeg,gif', 'max:2048'], // Max 2MB
            'seo_keywords' => ['required', 'string'],
            'seo_author' => ['required', 'string', 'max:255'],
            'seo_canonical' => ['required', 'url'],
            'seo_og_image' => ['nullable', 'file', 'image', 'mimes:png,jpg,jpeg,gif', 'max:2048'], // Max 2MB
        ]);

        // Process Favicon Upload
        if ($request->hasFile('favicon')) {
            if ($settings->favicon) {
                Storage::disk('public')->delete($settings->favicon);
            }
            $settings->favicon = $request->file('favicon')->store('settings', 'public');
        }

        // Process App Logo Upload
        if ($request->hasFile('app_logo')) {
            if ($settings->app_logo) {
                Storage::disk('public')->delete($settings->app_logo);
            }
            $settings->app_logo = $request->file('app_logo')->store('settings', 'public');
        }

        // Process SEO OG Image Upload
        if ($request->hasFile('seo_og_image')) {
            if ($settings->seo_og_image) {
                Storage::disk('public')->delete($settings->seo_og_image);
            }
            $settings->seo_og_image = $request->file('seo_og_image')->store('settings', 'public');
        }

        // Update other parameters
        $settings->allow_registration = $request->boolean('allow_registration');
        $settings->app_title = trim($request->app_title);
        $settings->company_name = trim($request->company_name);
        $settings->company_year = trim($request->company_year);
        $settings->app_description = trim($request->app_description);
        $settings->seo_keywords = trim($request->seo_keywords);
        $settings->seo_author = trim($request->seo_author);
        $settings->seo_canonical = trim($request->seo_canonical);

        $settings->save();
        return redirect()->route('settings.edit')->with('success', 'Application settings updated successfully.');
    }
}
