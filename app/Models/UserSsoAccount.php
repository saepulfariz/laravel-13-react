<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSsoAccount extends Model
{
    protected $fillable = [
        'user_id',
        'sso_provider_id',
        'provider_account_email',
        'provider_account_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function provider()
    {
        return $this->belongsTo(SsoProvider::class, 'sso_provider_id', 'id');
    }
}
