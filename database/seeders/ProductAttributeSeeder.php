<?php

namespace Database\Seeders;

use App\Models\CategoryAttribute;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductAttribute;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductAttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = Category::where('name', 'Computers')->first();
        foreach($category->products as $categoryProduct) {
            foreach($category->attributes as $categoryAttribute) {
                ProductAttribute::create([
                    'product_id' => $categoryProduct->id,
                    'category_attribute_id' => $categoryAttribute->id,
                    'value' => self::getFakeValueForAttribute($categoryAttribute)
                ]);
            }
        }
    }

    private static function getFakeValueForAttribute($categoryAttribute) {
        if($categoryAttribute->type->name == "Integer") {
            return rand(0, 500);
        }
        if($categoryAttribute->type->name == "Decimal") {
            return fake()->randomFloat();
        }
        if($categoryAttribute->type->name == "String") {
            return fake()->text(rand(5, 20));
        }
    }
}
