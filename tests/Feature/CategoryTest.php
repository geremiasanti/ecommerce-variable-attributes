<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_categories_index_filter_returns_query_params(): void
    {
        $filterString = 'Lorem ipsum dolor sit amet.';
        $user = User::factory()->create();
        $response = $this->actingAs($user)
            ->get(route('categories.index', [
                'filter' => $filterString
            ]));

        $response->assertOk()
            ->assertInertia(fn(AssertableInertia $page) =>
                $page->component("Category/Index")
                    ->has('queryParams', fn(AssertableInertia $queryParams) =>
                        $queryParams->where('filter', $filterString)
                    )
            );
    }

    public function test_categories_index_filter_returns_correct_amount_of_results(): void
    {
        $filterString = 'Ipsum';
        Category::create([ 'name' => 'Lorem IPSUM dolor sit amet.' ]);
        Category::create([ 'name' => 'ipsum amet' ]);
        Category::create([ 'name' => 'something else' ]);

        $user = User::factory()->create();
        $response = $this->actingAs($user)
            ->get(route('categories.index', [
                'filter' => $filterString
            ]));

        $response->assertOk()
            ->assertInertia(fn(AssertableInertia $page) =>
                $page->component("Category/Index")
                    ->has('categoriesPaginated.data', 2)
            );
    }

    public function test_storing_category_without_image_stores_it_and_has_no_error_and_redirects() {
        $fakeName = "Fake category name";

        $user = User::factory()->create();
        $response = $this->actingAs($user)
            ->post(route('categories.store', [
                'name' => $fakeName
            ]));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('categories.index'));

        $this->assertSame(Category::count(), 1);

        $createdCategory = Category::query()->first();
        $this->assertSame($fakeName, $createdCategory->name);
        $this->assertNull($createdCategory->image_path);
    }

    /* todo: fix fake file generation (doesn't validate as image)
    public function test_storing_category_with_image_stores_it_and_has_no_error_and_redirects() {
        $fakeName = "Fake category name";
        Storage::fake('testing_categories');
        $fakeImage = UploadedFile::fake()->image('image.jpg');

        $user = User::factory()->create();
        $response = $this->actingAs($user)
            ->post(route('categories.store', [
                'name' => $fakeName,
                'image' => $fakeImage
            ]));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('categories.index'));

        $this->assertSame(Category::count(), 1);

        $createdCategory = Category::query()->first();
        $this->assertSame($fakeName, $createdCategory->name);
        Storage::disk('testing_categories')->assertExists($fakeImage->hashName());
    }
    */


    public function test_storing_category_without_name_dont_stores_it_and_returns_error_and_redirects_back() {
        $user = User::factory()->create();
        $response = $this->actingAs($user)
            ->from(route('categories.create'))
            ->post(route('categories.store', [
                'name' => ''
            ]));

        $response
            ->assertSessionHasErrors('name')
            ->assertRedirect(route('categories.create'));

        $this->assertSame(Category::count(), 0);
    }
}
