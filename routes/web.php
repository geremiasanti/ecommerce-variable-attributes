<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryAttributeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    // categories
    Route::resource('/categories', CategoryController::class);

    // category attributes
    Route::resource('/categoryattributes', CategoryAttributeController::class)->only([
        'store', 'destroy'
    ]);
});

Route::redirect('/', route('categories.index'));

require __DIR__.'/auth.php';
