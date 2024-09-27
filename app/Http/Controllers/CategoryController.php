<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryAttributeTypeResource;
use App\Http\Resources\CategoryAttributeResource;
use App\Http\Resources\CategoryResource;
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

        $productsQuery = Product::query()
            ->with('attributes')
            ->where('category_id', $category->id)
            ->orderBy('products.name');

        $nameFilter = request('filter');
        if($nameFilter) {
            $productsQuery->where('name', 'like', "%$nameFilter%");
        }

        $filters = [];
        foreach(request()->query() as $key => $val) {
            if(str_contains($key, '_in')) {
                $values = is_null($val) ? [] :explode(',', $val);
                list($categoryAttributeId, $_) = explode("_", $key, 2);
                $filters[$categoryAttributeId]['in'] = $values;
            }
            if(str_contains($key, '_min') || str_contains($key, '_max')) {
                $val = intval($val);
                list($categoryAttributeId, $minOrMax) = explode("_", $key, 2);
                $filters[$categoryAttributeId][$minOrMax] = $val;
            }
        }
        \Log::debug(print_r($filters, true));

        $products = $productsQuery->get();
        foreach($products as $product) {
            foreach($product->attributes as $attribute) {
                $attribute = $attribute->categoryAttribute;
            }
        }
        $products = $products->toArray();

        $filterProducts = function($product) use ($filters) {
            return self::filterProducts($product, $filters);
        };
        $productsFiltered = array_values(array_filter($products, $filterProducts));

        $attributes = self::generateCategoryAttributes($category->attributes, $filters);
        return inertia('Category/Show', [
            'placeHolderUri' => Storage::url('placeholder.png'),
            'category' => new CategoryResource($category),
            'products' => $productsFiltered,
            'queryParams' => request()->query() ?: null,
            'attributes' => $attributes
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

    private static function generateCategoryAttributes($categoryAttributes, $filters)
    {
        $attributes = [];
        foreach($categoryAttributes as $categoryAttribute) {
            if($categoryAttribute->type->name == "String") {
                $values = ProductAttribute::query()
                    ->where('category_attribute_id', $categoryAttribute->id)
                    ->groupBy('value')
                    ->pluck('value')
                    ->toArray();

                    //if(self::allZeros($values)) continue;

                $in = [];
                if(array_key_exists($categoryAttribute->id, $filters)) {
                    $in = $filters[$categoryAttribute->id]['in'];
                }

                $attributes[] = [
                    'categoryAttribute' => new CategoryAttributeResource($categoryAttribute),
                    'options' => $values,
                    'in' => $in
                ];
            }

            if($categoryAttribute->type->name == "Integer") {
                if(array_key_exists($categoryAttribute->id, $filters)) {
                    $attributes[] = [
                        'categoryAttribute' => new CategoryAttributeResource($categoryAttribute),
                        'min' => $filters[$categoryAttribute->id]['min'],
                        'max' => $filters[$categoryAttribute->id]['max'],
                    ];
                } else {
                    $values = array_map(
                        'intval',
                        ProductAttribute::query()
                            ->where('category_attribute_id', $categoryAttribute->id)
                            ->pluck('value')
                            ->toArray()
                    );

                    if(self::allZeros($values)) continue;

                    $attributes[] = [
                        'categoryAttribute' => new CategoryAttributeResource($categoryAttribute),
                        'min' => is_null(min($values)) ? 0 : min($values),
                        'max' => max($values),
                    ];
                }
            }

            if($categoryAttribute->type->name == "Decimal") {
                if(array_key_exists($categoryAttribute->id, $filters)) {
                    $attributes[] = [
                        'categoryAttribute' => new CategoryAttributeResource($categoryAttribute),
                        'min' => $filters[$categoryAttribute->id]['min'],
                        'max' => $filters[$categoryAttribute->id]['max'],
                    ];
                } else {
                    $values = array_map(
                        'floatval',
                        ProductAttribute::query()
                            ->where('category_attribute_id', $categoryAttribute->id)
                            ->pluck('value')
                            ->toArray()
                    );

                    if(self::allZeros($values)) continue;

                    $attributes[] = [
                        'categoryAttribute' => new CategoryAttributeResource($categoryAttribute),
                        'min' => min($values) ?? 0,
                        'max' => max($values),
                    ];
                }
            }
        }
        return $attributes;
    }

    private static function filterProducts($product, $filters)
    {
        foreach($product['attributes'] as $att) {
            if(!array_key_exists($att['category_attribute_id'], $filters))
                continue;

            if(array_key_exists('in', $filters[$att['category_attribute_id']])) {
                if(
                    count($filters[$att['category_attribute_id']]['in']) > 0 &&
                    !in_array($att['value'], $filters[$att['category_attribute_id']]['in'])
                ) return false;
            } else {
                if(
                    $att['value'] > $filters[$att['category_attribute_id']]['max'] ||
                    $att['value'] < $filters[$att['category_attribute_id']]['min']
                ) return false;
            }
        }
        return true;
    }

    private static function allZeros($array) {
        foreach($array as $el) {
            if($el != 0) return false;
        }
        return true;
    }
}
