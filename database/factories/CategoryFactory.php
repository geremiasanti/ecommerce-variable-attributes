<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        return [
            'name' => $name,
            'image_path' => str_replace(
                'CCCCCC',
                Category::IMAGE_BG_PALETTE[array_rand(Category::IMAGE_BG_PALETTE)],
                fake()->imageUrl(100, 100, null, false, $name, true)
            )

        ];
    }
}
