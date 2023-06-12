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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->nullable();
            $table->bigInteger('shopify_id')->nullable();
            $table->bigInteger('user_id')->nullable();
            $table->longText('product_name')->nullable();
            $table->longText('description')->nullable();
            $table->longText('search_engine_title')->nullable();
            $table->longText('search_engine_meta_description')->nullable();
            $table->longText('seller_email')->nullable();
            $table->longText('collections')->nullable();
            $table->longText('tags')->nullable();
            $table->longText('product_type')->nullable();
            $table->longText('vendor')->nullable();
            $table->longText('status')->nullable();
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
        Schema::dropIfExists('products');
    }
};
