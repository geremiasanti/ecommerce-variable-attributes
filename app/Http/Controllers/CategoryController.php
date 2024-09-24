<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CategoryAttributeResource;
use App\Models\CategoryAttributeType;
use Illuminate\Support\Facades\Storage;
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

        $filter = request('filter');
        if($filter) {
            $categoriesQuery->where('name', 'like', "%$filter%");
        }

        $categoriesQuery->orderBy('name');
        $categoriesPaginated = $categoriesQuery->paginate(7)->withQueryString();

        return inertia('Category/Index', [
            'placeHolderUri' => Storage::url('placeholder.png'),
            'categoriesPaginated' => CategoryResource::collection($categoriesPaginated),
            'queryParams' => request()->query() ?: null,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Category/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $categoryCreated = Category::create($data);

        $image = empty($data['image']) ? null : $data['image'];
        if($image) {
            $imagePath = $image->store('categories', 'public');
            $categoryCreated->image_path = $imagePath;
            $categoryCreated->save();
        };

        return to_route('categories.index')
            ->with('success', "New category \"$categoryCreated->name\" created"); }

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
        return inertia('Category/Edit', [
            'category' => new CategoryResource($category),
            'attributes' => CategoryAttributeResource::collection(
                $category->attributes
            ),
            'attributeTypeOptions' => CategoryAttributeType::getArray()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $previousImagePath = $category->image_path;

        $data = $request->validated();
        $category->update($data);

        $image = empty($data['image']) ? null : $data['image'];
        if($image) {
            if(!empty($previousImagePath) && Storage::disk('public')->exists($previousImagePath)) {
                Storage::disk('public')->delete($previousImagePath);
            }

            $imagePath = $image->store('categories', 'public');
            $category->image_path = $imagePath;
            $category->save();
        };

        return to_route('categories.index')
            ->with('success', "Category \"$category->name\" updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $categoryName = $category->name;
        $categoryImagePath = $category->image_path;
        $category->delete();

        if(!empty($categoryImagePath) && Storage::disk('public')->exists($categoryImagePath)) {
            Storage::disk('public')->delete($categoryImagePath);
        }

        return to_route('categories.index')
            ->with('success', "Category \"$categoryName\" deleted");
    }
}
