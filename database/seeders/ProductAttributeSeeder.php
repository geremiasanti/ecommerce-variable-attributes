<?php

namespace Database\Seeders;

use App\Models\CategoryAttribute;
use App\Models\Product;
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
        $product = Product::where('name', 'Thinkpad')->first();
        $categoryAttributes = $product->category->attributes;
        foreach($categoryAttributes as $categoryAttribute) {
            ProductAttribute::create([
                'product_id' => $product->id,
                'category_attribute_id' => $categoryAttribute->id
            ]);
        }
    }
}
