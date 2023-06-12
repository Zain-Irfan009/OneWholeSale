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
        Schema::create('global_commissions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->nullable();
            $table->longText('commission_type')->nullable();
            $table->longText('fixed_commission_type')->nullable();
            $table->double('global_commission')->nullable();
            $table->double('second_global_commission')->nullable();
            $table->boolean('enable_maximum_commission')->nullable();
            $table->double('maximum_commission')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('global_commissions');
    }
};
