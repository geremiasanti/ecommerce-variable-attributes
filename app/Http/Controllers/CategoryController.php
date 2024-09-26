<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryAttributeTypeResource;
use App\Http\Resources\CategoryAttributeResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\CategoryAttributeType;
use App\Models\Product;
use App\Models\ProductAttribute;
use Illuminate\Support\Facades\Storage;

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

        return to_route('categories.edit', $categoryCreated->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $attributes = self::generateCategoryAttributes($category->attributes);

        $productsQuery = Product::query()
            ->select('products.*')
            ->join('product_attributes', 'products.id', 'product_attributes.product_id')
            ->where('category_id', $category->id)
            ->groupBy('products.id');

        $nameFilter = request('filter');
        if($nameFilter) {
            $productsQuery->where('name', 'like', "%$nameFilter%");
        }

        foreach(request()->query() as $key => $val) {
            if(str_contains($key, '_min') || str_contains($key, '_max')) {
                list($categoryAttributeId, $minOrMax) = explode("_", $key, 2);

                $productsQuery->where(function($query) use ($val, $categoryAttributeId, $minOrMax) {
                    $query->where('product_attributes.category_attribute_id', $categoryAttributeId);
                    if($minOrMax == 'min')
                        $query->whereRaw('CONVERT(product_attributes.value, SIGNED) >= ?', [$val]);
                    else
                        $query->whereRaw('CONVERT(product_attributes.value, SIGNED) <= ?', [$val]);
                });
            }
        }

        $productsQuery->orderBy('name');
        $productsPaginated = $productsQuery->paginate(7)->withQueryString();

        return inertia('Category/Show', [
            'placeHolderUri' => Storage::url('placeholder.png'),
            'category' => new CategoryResource($category),
            'productsPaginated' => ProductResource::collection($productsPaginated),
            'queryParams' => request()->query() ?: null,
            'attributes' => [$attributes[0]]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // load attributes
        $category->attributes;

        return inertia('Category/Edit', [
            'category' => new CategoryResource($category),
            'attributeTypeOptions' => CategoryAttributeTypeResource::collection(
                CategoryAttributeType::all()
            ),
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

        foreach($category->products as $product) {
            $product->delete();
        }
        $category->delete();

        if(!empty($categoryImagePath) && Storage::disk('public')->exists($categoryImagePath)) {
            Storage::disk('public')->delete($categoryImagePath);
        }

        return to_route('categories.index')
            ->with('success', "Category \"$categoryName\" deleted");
    }

    public function explore() {
        $categoriesQuery = Category::query();

        $filter = request('filter');
        if($filter) {
            $categoriesQuery->where('name', 'like', "%$filter%");
        }

        $categoriesQuery->orderBy('name');
        $categoriesPaginated = $categoriesQuery->paginate(7)->withQueryString();

        return inertia('Category/Explore', [
            'placeHolderUri' => Storage::url('placeholder.png'),
            'categoriesPaginated' => CategoryResource::collection($categoriesPaginated),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    private static function generateCategoryAttributes($categoryAttributes)
    {
        $attributes = [];
        foreach($categoryAttributes as $categoryAttribute) {
            if($categoryAttribute->type->name == "Integer") {
                $values = array_map(
                    'intval',
                    ProductAttribute::query()
                        ->where('category_attribute_id', $categoryAttribute->id)
                        ->pluck('value')
                        ->toArray()
                );
                $attributes[] = [
                    'categoryAttribute' => new CategoryAttributeResource($categoryAttribute),
                    'min' => min($values),
                    'max' => max($values),
                ];
            }
        }

        return $attributes;
    }
}
