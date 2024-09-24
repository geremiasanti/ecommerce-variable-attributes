<?php

namespace App\Models;

use App\Models\CategoryAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'image_path'];

    public const IMAGE_BG_PALETTE = [
        "03071e",
        "370617",
        "6a040f",
        "9d0208",
        "d00000",
        "dc2f02",
        "e85d04",
        "f48c06",
        "faa307",
        "ffba08"
    ];

    public function attributes(): HasMany
    {
        return $this->hasMany(CategoryAttribute::class);
    }
}
