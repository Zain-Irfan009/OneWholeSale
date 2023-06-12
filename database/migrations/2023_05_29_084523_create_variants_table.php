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
        Schema::create('variants', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->nullable();
            $table->bigInteger('shopify_product_id')->nullable();
            $table->bigInteger('shopify_id')->nullable();
            $table->longText('title')->nullable();
            $table->double('price')->nullable();
            $table->double('compare_at_price')->nullable();
            $table->longText('sku')->nullable();
            $table->boolean('taxable')->nullable();
            $table->longText('inventory_management')->nullable();
            $table->bigInteger('quantity')->nullable();
            $table->longText('inventory_policy')->nullable();
            $table->longText('barcode')->nullable();
            $table->double('weight')->nullable();
            $table->double('grams')->nullable();
            $table->string('weight_unit')->nullable();
            $table->bigInteger('position')->nullable();
            $table->bigInteger('inventory_item_id')->nullable();
            $table->bigInteger('old_inventory_quantity')->nullable();
            $table->longText('option1')->nullable();
            $table->longText('option2')->nullable();
            $table->longText('option3')->nullable();
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
        Schema::dropIfExists('variants');
    }
};
