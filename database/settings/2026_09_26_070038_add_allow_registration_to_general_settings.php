<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.app_title', 'RILT Stack');
        $this->migrator->add('general.company_name', 'Antigravity Coding');
        $this->migrator->add('general.company_year', '2026');
        $this->migrator->add('general.app_description', 'Laravel React InertiaJS Theme Stack');
        $this->migrator->add('general.favicon', null);
        $this->migrator->add('general.app_logo', null);
        $this->migrator->add('general.seo_keywords', 'laravel, vite,inertia, settings, application');
        $this->migrator->add('general.seo_author', 'Antigravity');
        $this->migrator->add('general.seo_canonical', 'http://localhost');
        $this->migrator->add('general.seo_og_image', null);
        $this->migrator->add('general.allow_registration', true);
    }
};
