<?php

namespace Database\Seeders;

use App\Models\CategoryAttributeType;
use Illuminate\Database\Seeder;

class CategoryAttributeTypeSeeder extends Seeder
{
    private const TYPES= [
        [
            'name' => 'Integer',
            'can_have_unit' => true
        ],
        [
            'name' => 'Decimal',
            'can_have_unit' => true
        ],
        /*
        [
            'name' => 'Options',
            'can_have_unit' => false
        ],
        */
        [
            'name' => 'String',
            'can_have_unit' => false
        ],
    ];

    public function run(): void
    {
        foreach(self::TYPES as $type) {
            CategoryAttributeType::create($type);
        }
    }
}
