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
        Schema::create('mail_smtp_settings', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->unsigned()->nullable();
            $table->longText('smtp_host')->nullable();
            $table->longText('smtp_username')->nullable();
            $table->longText('smtp_password')->nullable();
            $table->longText('email_from')->nullable();
            $table->longText('from_name')->nullable();
            $table->longText('reply_to')->nullable();
            $table->longText('smtp_type')->nullable();
            $table->longText('smtp_port')->nullable();
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
        Schema::dropIfExists('mail_smtp_settings');
    }
};
