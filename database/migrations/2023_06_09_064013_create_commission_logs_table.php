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
        Schema::create('commission_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->double('commission')->nullable();
            $table->bigInteger('shopify_product_id')->nullable();
            $table->bigInteger('shopify_order_id')->nullable();
            $table->longText('product_name')->nullable();
            $table->bigInteger('quantity')->nullable();
            $table->double('price')->nullable();
            $table->double('unit_product_commission')->nullable();
            $table->double('total_product_commission')->nullable();
            $table->double('total_admin_earning')->nullable();
            $table->double('refunded_admin_earning')->nullable();
            $table->double('vat_on_commssion')->nullable();

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
        Schema::dropIfExists('commission_logs');
    }
};
