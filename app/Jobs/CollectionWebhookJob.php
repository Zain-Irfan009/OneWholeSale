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


class CollectionWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 10000000000;
    protected $collection;
    protected $shop_name;
    protected $webhook_log_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct($collection,$shop_name,$webhook_log_id)
    {
        $this->collection = $collection;
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
        $collection=$this->collection;
        $shop_name=$this->shop_name;
        $webhook_log_id=$this->webhook_log_id;
        $collectioncontroller = new \App\Http\Controllers\Admin\CollectionController();
        $collectioncontroller->singleCollection($collection,$shop_name);
        WebhookLog::where('id', $webhook_log_id)->update(['status' => 'Complete']);

    }


}
