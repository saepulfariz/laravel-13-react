<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SsoProvider extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'icon',
        'is_active',
        'can_register',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'can_register' => 'boolean',
    ];
}
