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
        Schema::table('users', function (Blueprint $table) {
            $table->longText('seller_shopname')->nullable();
            $table->longText('seller_store_address')->nullable();
            $table->longText('seller_zipcode')->nullable();
            $table->longText('seller_contact')->nullable();
            $table->longText('seller_store_description')->nullable();
            $table->longText('seller_description')->nullable();
            $table->longText('seller_policy')->nullable();
            $table->longText('seller_image')->nullable();
            $table->longText('seller_shop_image')->nullable();
            $table->bigInteger('shop_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
