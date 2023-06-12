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
        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->nullable();
            $table->bigInteger('shopify_product_id')->nullable();
            $table->bigInteger('shopify_id')->nullable();
            $table->longText('name')->nullable();
            $table->bigInteger('position')->nullable();
            $table->longText('values')->nullable();
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
        Schema::dropIfExists('options');
    }
};
