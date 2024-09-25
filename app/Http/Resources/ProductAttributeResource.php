<?php

namespace App\Http\Resources;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductAttributeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'name' => $this->categoryAttribute->name,
            'type' => $this->categoryAttribute->type,
            'unit' => $this->categoryAttribute->unit
        ];
    }
}
