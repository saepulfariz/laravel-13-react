<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $app_title;
    public string $company_name;
    public string $company_year;
    public string $app_description;
    public ?string $favicon;
    public ?string $app_logo;
    public bool $allow_registration;

    // SEO
    public string $seo_keywords;
    public string $seo_author;
    public string $seo_canonical;
    public ?string $seo_og_image;

    public static function group(): string
    {
        return 'general';
    }
}
