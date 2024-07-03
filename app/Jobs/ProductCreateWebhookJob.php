<?php

namespace App\Jobs;


use App\Models\Log;
use App\Models\WebhookLog;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;


class ProductCreateWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 10000000000;
    protected $product;
    protected $shop_name;
    protected $webhook_log_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct($product,$shop_name,$webhook_log_id)
    {
        $this->product = $product;
        $this->shop_name = $shop_name;
        $this->webhook_log_id = $webhook_log_id;
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
        $webhook_log_id=$this->webhook_log_id;
        $productcontroller = new \App\Http\Controllers\Admin\ProductController();
        $productcontroller->createShopifyProducts($product,$shop_name);
        WebhookLog::where('id', $webhook_log_id)->update(['status' => 'Complete']);

    }


}
