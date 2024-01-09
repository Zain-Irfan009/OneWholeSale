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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->string('seller_name')->nullable();
            $table->bigInteger('courier_id')->nullable();
            $table->string('courier_name')->nullable();
            $table->string('status')->nullable();
            $table->longText('comment')->nullable();
            $table->longText('tracking_number')->nullable();
            $table->longText('file')->nullable();
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
        Schema::dropIfExists('shipments');
    }
};
