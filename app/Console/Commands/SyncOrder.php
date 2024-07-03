<?php

namespace App\Console\Commands;

use App\Http\Controllers\Admin\OrderController;
use App\Models\SupplierProduct;
use Illuminate\Console\Command;
use App\Http\Controllers\Admin\Suppliers\AshleyController;
class SyncOrder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Supplier Products and Save it in DB Tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {

      $order_controller=new OrderController();
      $order_controller->SyncOrderCronJob();
    }
}
