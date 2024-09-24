<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoryAttribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'type_id',
        'name',
        'unit',
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(CategoryAttributeType::class);
    }
}
