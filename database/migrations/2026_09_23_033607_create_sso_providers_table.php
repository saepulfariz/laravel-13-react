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
        Schema::create('sso_providers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // contoh: 'google', 'github'
            $table->string('name');
            $table->string('icon')->nullable(); // class icon (cth: 'fab fa-google') atau URL gambar
            $table->boolean('is_active')->default(true);
            $table->boolean('can_register')->default(true);
            $table->unsignedBigInteger('cid')->nullable();
            $table->unsignedBigInteger('uid')->nullable();
            $table->unsignedBigInteger('did')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sso_providers');
    }
};
