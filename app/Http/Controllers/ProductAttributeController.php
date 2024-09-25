<?php

namespace App\Http\Controllers;

use App\Models\ProductAttribute;
use Illuminate\Http\Request;

class ProductAttributeController extends Controller
{
    public function update(Request $request, $id)
    {
        $productAttribute = ProductAttribute::find($id);
        $productAttribute->value = $request->input('value');
        $productAttribute->save();
        return back();
    }
}
