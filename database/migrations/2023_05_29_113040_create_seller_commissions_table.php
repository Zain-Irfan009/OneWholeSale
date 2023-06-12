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
        Schema::create('seller_commissions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->nullable();
            $table->bigInteger('user_id')->nullable();
            $table->longText('seller_email')->nullable();
            $table->longText('commission_type')->nullable();
            $table->double('first_commission')->nullable();
            $table->double('second_commission')->nullable();
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
        Schema::dropIfExists('seller_commissions');
    }
};
