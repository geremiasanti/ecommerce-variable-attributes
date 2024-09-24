<?php

namespace Database\Seeders;

use App\Models\CategoryAttributeType;
use Illuminate\Database\Seeder;

class CategoryAttributeTypeSeeder extends Seeder
{
    private const NAMES = [
        'Integer',
        'Decimal',
        'Options',
        'String',
    ];

    public function run(): void
    {
        foreach(self::NAMES as $name) {
            CategoryAttributeType::create([
                'name' => $name,
            ]);
        }
    }
}
