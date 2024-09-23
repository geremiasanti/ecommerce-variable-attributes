<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categoriesQuery = Category::query();

        $search = request('search');
        if($search) {
            self::addSearchClauses($categoriesQuery, $search);
        }

        $categoriesPaginated = $categoriesQuery->paginate(5);

        return Inertia::render('Category/Index', [
            'categoriesPaginated' => CategoryResource::collection($categoriesPaginated),
            'queryParams' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }

    private static function addSearchClauses($query, $searchString) {
        $words = explode(' ', $searchString);

        $isFirstWhere = true;
        foreach($words as $word) {
            if($isFirstWhere) {
                $query->where('name', 'like', "%$word%");
                $isFirstWhere = false;
            } else {
                $query->orWhere('name', 'like', "%$word%");
            }
        }
    }
}
