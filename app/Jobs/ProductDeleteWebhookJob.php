<?php

namespace App\Jobs;


use App\Models\Log;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;


class ProductDeleteWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 100000;
    protected $product;
    protected $shop_name;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct($product,$shop_name)
    {
        $this->product = $product;
        $this->shop_name = $shop_name;
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $product=$this->product;
        $shop_name=$this->shop_name;
        $productcontroller = new \App\Http\Controllers\Admin\ProductController();
        $productcontroller->ShopifyDeleteProduct($product,$shop_name);

    }


}
