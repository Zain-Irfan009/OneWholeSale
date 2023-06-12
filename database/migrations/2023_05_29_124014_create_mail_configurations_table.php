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
        Schema::create('mail_configurations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->unsigned()->nullable();
            $table->boolean('product_approval_status')->nullable();
            $table->longText('mail_subject')->nullable();
            $table->longText('mail_content')->nullable();
            $table->longText('header_background_color')->nullable();
            $table->longText('footer_background_color')->nullable();
            $table->boolean('mail_header_status')->nullable();
            $table->boolean('mail_footer_status')->nullable();
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
        Schema::dropIfExists('mail_configurations');
    }
};
