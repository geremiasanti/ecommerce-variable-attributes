<?php

namespace App\Http\Resources;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image_path' => self::handleImagesAndPlaceholders($this->image_path)
        ];
    }

    private static function handleImagesAndPlaceholders($image_path) {
        if(!$image_path) {
            return Storage::url('placeholder.png');
        }

        if(str_contains($image_path, 'https://via.placeholder.com/')) {
            return $image_path;
        } else {
            return Storage::url($image_path);
        }
    }
}
