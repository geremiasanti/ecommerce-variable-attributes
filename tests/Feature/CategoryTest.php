<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_index_renders_category(): void
    {
        Category::factory()->create();

        $user = User::factory()->create();
        $response = $this->actingAs($user)
            ->get(route('categories.index'));

        $response->assertOk()
            ->assertInertia(fn(AssertableInertia $page) =>
                $page->component("Category/Index")
                    ->has('categoriesPaginated.data', 1)
            );
    }
}
