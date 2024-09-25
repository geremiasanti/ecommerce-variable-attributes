<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $productsQuery = Product::query();

        $filter = request('filter');
        if($filter) {
            $productsQuery->where('name', 'like', "%$filter%");
        }

        $productsQuery->orderBy('name');
        $productsPaginated = $productsQuery->paginate(7)->withQueryString();

        return inertia('Product/Index', [
            'placeHolderUri' => Storage::url('placeholder.png'),
            'productsPaginated' => ProductResource::collection($productsPaginated),
            'queryParams' => request()->query() ?: null,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Product/Create', [
            'categories' => CategoryResource::collection(Category::all())
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $productCreated = Product::create($data);

        $image = empty($data['image']) ? null : $data['image'];
        if($image) {
            $imagePath = $image->store('products', 'public');
            $productCreated->image_path = $imagePath;
            $productCreated->save();
        };

        return to_route('products.index')
            ->with('success', "New Product \"$productCreated->name\" created");
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
