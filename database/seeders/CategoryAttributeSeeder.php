<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryAttribute;
use App\Models\CategoryAttributeType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryAttributeSeeder extends Seeder
{
    public function run(): void
    {
        $computersCategoryId = Category::where('name', 'Computers')->first()->id;
        $types = CategoryAttributeType::getArray();

        $computersCategoryAttributes = [
            [
                'name' => 'Hard Drive',
                'category_id' => $computersCategoryId,
                'type_id' => $types['Integer'],
                'unit' => "GB"
            ],
            [
                'name' => 'RAM',
                'category_id' => $computersCategoryId,
                'type_id' => $types['Integer'],
                'unit' => "GB"
            ],
            [
                'name' => 'Velocità processore',
                'category_id' => $computersCategoryId,
                'type_id' => $types['Integer'],
                'unit' => "GHz"
            ],
            [
                'name' => 'Grandezza schermo',
                'category_id' => $computersCategoryId,
                'type_id' => $types['Decimal'],
                'unit' => "Pollici"
            ],
            [
                'name' => 'Tipologia',
                'category_id' => $computersCategoryId,
                'type_id' => $types['String']
            ],
            [
                'name' => 'Processore',
                'category_id' => $computersCategoryId,
                'type_id' => $types['String']
            ],
        ];

        foreach($computersCategoryAttributes as $categoryAttribute) {
            CategoryAttribute::create($categoryAttribute);
        }
    }
}
