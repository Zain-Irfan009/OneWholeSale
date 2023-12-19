<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $courierCompanies = [
            ['courier' => 'UPS'],
            ['courier' => 'Fedex'],
            ['courier' => 'Canada Post'],
            ['courier' => 'DHL'],
            ['courier' => 'USPS'],

            // Add more courier as needed
        ];

        // Insert data into the 'courier_companies' table
        DB::table('couriers')->insert($courierCompanies);
    }
}
