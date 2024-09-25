<?php

namespace App\Http\Controllers;

use App\Models\ProductAttribute;
use Illuminate\Http\Request;

class ProductAttributeController extends Controller
{
    public function update(Request $request, $id)
    {
        $productAttribute = ProductAttribute::find($id);
        $value = $request->input('value');

        if($productAttribute->categoryAttribute->type->name == "Integer") {
            $value = intval($value);
        }

        $productAttribute->value = $value;
        $productAttribute->save();
        return back();
    }
}
