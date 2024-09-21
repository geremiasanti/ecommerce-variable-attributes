<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    private const NAMES = [
        'Attrezzi da lavoro',
        'Biciclette',
        'Chitarre',
        'Computers',
        'Giocattoli',
        'Jeans',
        'Lampadari',
        'Macchinari industriali',
        'Macchine fotografiche',
        'Magliette',
        'Occhiali',
        'Orologi',
        'Palloni',
        'Raccoglitori',
        'Scarpe',
        'Tazze',
        'TVs',
        'Videogiochi'
    ];

    public function run(): void
    {
        foreach(self::NAMES as $name) {
            Category::create([
                'name' => $name
            ]);
        }
    }
}
