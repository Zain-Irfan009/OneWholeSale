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
        Schema::create('shop_page_settings', function (Blueprint $table) {
            $table->id();
            $table->longText('sold_by_label')->nullable();
            $table->longText('seller_name_label')->nullable();
            $table->longText('total_products_label')->nullable();
            $table->longText('total_sale_label')->nullable();
            $table->longText('join_since_label')->nullable();
            $table->longText('contact_label')->nullable();
            $table->longText('seller_products_label')->nullable();
            $table->longText('all_review_label')->nullable();
            $table->longText('feedback_label')->nullable();
            $table->longText('policy_label')->nullable();
            $table->longText('description_label')->nullable();
            $table->longText('search_label')->nullable();
            $table->longText('not_available_label')->nullable();
            $table->longText('sort_by_label')->nullable();
            $table->longText('name_ascending_label')->nullable();
            $table->longText('name_decending_label')->nullable();
            $table->longText('date_ascending_label')->nullable();
            $table->longText('date_decending_label')->nullable();
            $table->longText('price_ascending_label')->nullable();
            $table->longText('price_decending_label')->nullable();
            $table->longText('show_label')->nullable();
            $table->longText('only_store_pickup_label')->nullable();
            $table->longText('store_pickup_deliivery_label')->nullable();
            $table->longText('closed_store_label')->nullable();
            $table->longText('open_store_label')->nullable();
            $table->longText('rating_label')->nullable();
            $table->longText('name_label')->nullable();
            $table->longText('sumbit_label')->nullable();
            $table->longText('view_all_label')->nullable();
            $table->longText('feedback_submitted_approval_label')->nullable();
            $table->longText('category_label')->nullable();
            $table->longText('type_label')->nullable();
            $table->longText('tag_label')->nullable();
            $table->bigInteger('shop_id')->nullable();
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
        Schema::dropIfExists('shop_page_settings');
    }
};
