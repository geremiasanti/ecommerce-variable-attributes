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

    public function test_categories_index_search_is_working(): void
    {
        $searchString = 'Lorem ipsum dolor sit amet.';
        Category::create([ 'name' => 'ipsum' ]);
        Category::create([ 'name' => 'ipsum amet' ]);
        Category::create([ 'name' => 'something else' ]);

        $user = User::factory()->create();
        $response = $this->actingAs($user)
            ->get(route('categories.index', [
                'search' => $searchString
            ]));

        $response->assertOk()
            ->assertInertia(fn(AssertableInertia $page) =>
                $page->component("Category/Index")
                    ->has('categoriesPaginated.data', 2)
                    ->has('queryParams', fn(AssertableInertia $queryParams) =>
                        $queryParams->where('search', $searchString)
                    )
            );
    }
}
