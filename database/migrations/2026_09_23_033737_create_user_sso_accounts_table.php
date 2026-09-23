<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_sso_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('sso_provider_id')->constrained('sso_providers')->onDelete('cascade');
            $table->string('provider_account_id'); // ID unik dari Google/Github
            $table->string('provider_account_email')->nullable(); // Opsional, untuk record
            $table->unsignedBigInteger('cid')->nullable(); // created by
            $table->unsignedBigInteger('uid')->nullable(); // updated by
            $table->unsignedBigInteger('did')->nullable(); // deleted by
            $table->timestamps();
            $table->softDeletes();

            // Mencegah duplikasi: 1 akun SSO hanya boleh dipakai 1 kali di provider yang sama
            $table->unique(['sso_provider_id', 'provider_account_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_sso_accounts');
    }
};
