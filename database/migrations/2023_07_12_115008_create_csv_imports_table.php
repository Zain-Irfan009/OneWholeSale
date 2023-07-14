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
        Schema::create('csv_imports', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->nullable();
            $table->bigInteger('product_id')->nullable();
            $table->longText('title')->nullable();
            $table->longText('description')->nullable();
            $table->longText('seller_email')->nullable();
            $table->longText('type')->nullable();
            $table->longText('tags')->nullable();
            $table->longText('option_name1')->nullable();
            $table->longText('option_value1')->nullable();
            $table->longText('option_name2')->nullable();
            $table->longText('option_value2')->nullable();
            $table->longText('option_name3')->nullable();
            $table->longText('option_value3')->nullable();
            $table->longText('variant_sku')->nullable();
            $table->double('variant_grams')->nullable();
            $table->longText('variant_inventory_tracking')->nullable();
            $table->bigInteger('variant_quantity')->nullable();
            $table->double('variant_price')->nullable();
            $table->double('variant_compare_at_price')->nullable();
            $table->longText('variant_require_shipping')->nullable();
            $table->longText('variant_barcode')->nullable();
            $table->longText('collection')->nullable();
            $table->string('status')->nullable();
            $table->string('inventory_policy')->nullable();
            $table->longText('meta_title')->nullable();
            $table->longText('meta_description')->nullable();
            $table->longText('vendor_name')->nullable();
            $table->longText('vendor_store_name')->nullable();
            $table->longText('product_policy')->nullable();
            $table->longText('image')->nullable();
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
        Schema::dropIfExists('csv_imports');
    }
};
