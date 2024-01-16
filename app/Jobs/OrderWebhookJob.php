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


class OrderWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 100000;
    protected $order;
    protected $shop_name;
    protected $webhook_log_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct($order,$shop_name,$webhook_log_id)
    {
        $this->order = $order;
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
        $order=$this->order;
        $shop_name=$this->shop_name;
        $webhook_log_id=$this->webhook_log_id;
    $ordercontroller = new \App\Http\Controllers\Admin\OrderController();
        $ordercontroller->singleOrder($order,$shop_name);
        WebhookLog::where('id', $webhook_log_id)->update(['status' => 'Complete']);

    }


}
