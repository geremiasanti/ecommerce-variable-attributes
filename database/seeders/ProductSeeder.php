<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $computersCategoryId = Category::where('name', 'Computers')->first()->id;
        $computers = [
            [
                'category_id' => $computersCategoryId,
                'name' => 'Thinkpad',
                'price' => 299.0,
            ],
            [
                'category_id' => $computersCategoryId,
                'name' => 'Macbook',
                'price' => 589.50,
            ],
            [
                'category_id' => $computersCategoryId,
                'name' => 'MSI Desktop',
                'price' => 780.49,
            ],
            [
                'category_id' => $computersCategoryId,
                'name' => 'HP Desktop',
                'price' => 600,
            ],
        ];

        foreach($computers as $computer) {
            $product = Product::create($computer);
            $product->image_path = str_replace(
                'CCCCCC',
                Category::IMAGE_BG_PALETTE[array_rand(Category::IMAGE_BG_PALETTE)],
                fake()->imageUrl(100, 100, null, false, $product->name, true)
            );
            $product->save();
        }
    }
}
