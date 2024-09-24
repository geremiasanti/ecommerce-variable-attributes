<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryAttributeType extends Model
{
    use HasFactory;

    public static function getArray() {
        $array = [];

        foreach(self::all() as $type) {
            $array[$type->name] = $type->id;
        }

        return $array;
    }
}
