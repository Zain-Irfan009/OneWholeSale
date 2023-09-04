<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('commission_logs', function (Blueprint $table) {
            $table->double('unit_payout')->nullable();
            $table->double('sub_total_payout')->nullable();
            $table->double('sub_total_payout_tax')->nullable();
            $table->double('total_payout')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('commission_logs', function (Blueprint $table) {
            //
        });
    }
};
