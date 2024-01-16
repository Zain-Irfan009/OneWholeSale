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


class InventoryLevelUpdateWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 100000;
    protected $data;


    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct($data)
    {
        $this->data = $data;
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $data=$this->data;
        $product_variant=\App\Models\Variant::where('inventory_item_id',$data->inventory_item_id)->first();
        if($product_variant){
            $product_variant->quantity=$data->available;
            $product_variant->save();
        }

    }


}
