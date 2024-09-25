<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryAttributeRequest;
use App\Models\CategoryAttribute;
use App\Models\CategoryAttributeType;

class CategoryAttributeController extends Controller
{
    public function store(StoreCategoryAttributeRequest $request)
    {
        $validated = $request->validated();
        CategoryAttribute::create($validated);

        return back()->with('attributeStored', true);
    }

    public function destroy($id)
    {
        CategoryAttribute::find($id)->delete();
        return back();
    }
}
