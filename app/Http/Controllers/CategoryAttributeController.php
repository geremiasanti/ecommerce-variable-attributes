<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryAttributeRequest;
use App\Models\CategoryAttribute;
use App\Models\ProductAttribute;

class CategoryAttributeController extends Controller
{
    public function store(StoreCategoryAttributeRequest $request)
    {
        $validated = $request->validated();
        if($validated['type_id'] == 3) {
            unset($validated['unit']);
        }

        $createdAttribute = CategoryAttribute::create($validated);

        foreach($createdAttribute->category->products as $product) {
            ProductAttribute::create([
                'product_id' => $product->id,
                'category_attribute_id' => $createdAttribute->id
            ]);
        }

        return back();
    }

    public function destroy($id)
    {
        CategoryAttribute::find($id)->delete();
        return back();
    }
}
