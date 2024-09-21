<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EntryPointTest extends TestCase
{
    use RefreshDatabase;

    public function test_root_redirects_to_categories(): void
    {
        $response = $this->get('/');

        $response->assertRedirectToRoute('categories.index');
    }

    public function test_categories_redirects_to_login_if_not_authenticated(): void
    {
        $response = $this->get(route('categories.index'));

        $response->assertRedirectToRoute('login');
    }

    public function test_categories_is_displayed_if_authenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('categories.index'));
        $response->assertOk();
    }

}
