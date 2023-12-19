<?php

use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Shopify\Clients\Rest;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('sync-all-product',[\App\Http\Controllers\Admin\ProductController::class,'SyncAllProducts']);

Route::middleware('auth:sanctum')->group( function () {
    Route::get('profile', [App\Http\Controllers\AuthController::class, 'profile']);



    //Dashboard
    Route::get('recent-orders',[\App\Http\Controllers\Admin\DashboardController::class,'RecentOrders']);
    Route::get('recent-sellers',[\App\Http\Controllers\Admin\DashboardController::class,'RecentSellers']);
    Route::get('store-stats',[\App\Http\Controllers\Admin\DashboardController::class,'StoreStats']);
    Route::get('store-earning',[\App\Http\Controllers\Admin\DashboardController::class,'StoreEarning']);
    Route::get('store-earning-filter',[\App\Http\Controllers\Admin\DashboardController::class,'StoreEarningFilter']);
    Route::get('top-sold-products',[\App\Http\Controllers\Admin\DashboardController::class,'TopSoldProduct']);
    Route::get('out-of-stock-products',[\App\Http\Controllers\Admin\DashboardController::class,'OutOfStockProduct']);
    Route::get('get-graph-data',[\App\Http\Controllers\Admin\DashboardController::class,'GetGraphData']);

        //Seller
    Route::get('sellers',[\App\Http\Controllers\Admin\SellerController::class,'Sellers']);
    Route::post('add-seller',[\App\Http\Controllers\Admin\SellerController::class,'AddSeller']);
    Route::get('seller-view/{id}',[\App\Http\Controllers\Admin\SellerController::class,'SellerView']);
    Route::post('edit-seller',[\App\Http\Controllers\Admin\SellerController::class,'EditSeller']);
    Route::get('update-seller-status',[\App\Http\Controllers\Admin\SellerController::class,'UpdateSellerStatus'])->middleware('smtp_seller');
    Route::post('change-password',[\App\Http\Controllers\Admin\SellerController::class,'ChangePassword']);
    Route::delete('delete-seller',[\App\Http\Controllers\Admin\SellerController::class,'DeleteSeller']);
    Route::get('sellers-filter',[\App\Http\Controllers\Admin\SellerController::class,'SellersFilter']);
    Route::post('send-message',[\App\Http\Controllers\Admin\SellerController::class,'SendMessage'])->middleware('smtp_seller');
    Route::post('send-message-multiple',[\App\Http\Controllers\Admin\SellerController::class,'SendMessageMultiple'])->middleware('smtp_seller');
    Route::get('update-seller-status-multiple',[\App\Http\Controllers\Admin\SellerController::class,'UpdateSellerStatusMultiple']);
    Route::get('export-seller',[\App\Http\Controllers\Admin\SellerController::class,'ExportSeller']);
    Route::get('search-seller',[\App\Http\Controllers\Admin\SellerController::class,'SearchSeller']);
    Route::post('send-announcement-mail',[\App\Http\Controllers\Admin\SellerController::class,'SendAnnouncementMail'])->middleware('smtp_seller');



        //shop-page-setting
    Route::get('shop-setting',[\App\Http\Controllers\Admin\ShopController::class,'ShopSetting']);
    Route::post('shop-setting-save',[\App\Http\Controllers\Admin\ShopController::class,'ShopSettingSave']);
    Route::get('reset-default',[\App\Http\Controllers\Admin\ShopController::class,'ResetDefault']);

    //Product
    Route::get('products',[\App\Http\Controllers\Admin\ProductController::class,'Products']);
    Route::get('product-view/{id}',[\App\Http\Controllers\Admin\ProductController::class,'ProductView']);
    Route::post('add-product',[\App\Http\Controllers\Admin\ProductController::class,'AddProduct'])->middleware('smtp');
    Route::get('update-product-status',[\App\Http\Controllers\Admin\ProductController::class,'UpdateProductStatus'])->middleware('smtp');
    Route::get('reassign-seller',[\App\Http\Controllers\Admin\ProductController::class,'ReassignSeller']);
    Route::get('reassign-multiple-seller',[\App\Http\Controllers\Admin\ProductController::class,'ReassignMultipleSeller']);
    Route::delete('delete-product',[\App\Http\Controllers\Admin\ProductController::class,'DeleteProduct']);
    Route::get('sync-product',[\App\Http\Controllers\Admin\ProductController::class,'SyncProduct']);



    Route::get('product-filter',[\App\Http\Controllers\Admin\ProductController::class,'ProductFilter']);
    Route::get('edit-product/{id}',[\App\Http\Controllers\Admin\ProductController::class,'EditProduct'])->middleware('smtp');
    Route::get('update-product-status-multiple',[\App\Http\Controllers\Admin\ProductController::class,'UpdateProductStatusMultiple'])->middleware('smtp');
    Route::get('export-product',[\App\Http\Controllers\Admin\ProductController::class,'ExportProduct']);
    Route::get('search-product',[\App\Http\Controllers\Admin\ProductController::class,'SearchProduct']);
    Route::get('search-seller-product',[\App\Http\Controllers\Admin\ProductController::class,'SearchSellerProduct']);
    Route::get('remove-img',[\App\Http\Controllers\Admin\ProductController::class,'RemoveImage']);
    Route::post('add-product-image',[\App\Http\Controllers\Admin\ProductController::class,'AddProductImage']);
    Route::get('drag-image',[\App\Http\Controllers\Admin\ProductController::class,'DragImage']);


    //import Product
    Route::get('import-products',[\App\Http\Controllers\Admin\ProductController::class,'ImportProducts']);
    Route::get('search-import-product',[\App\Http\Controllers\Admin\ProductController::class,'SearchImportProducts']);
    Route::post('import-csv',[\App\Http\Controllers\Admin\ProductController::class,'importCSV']);
    Route::post('assign-import-products',[\App\Http\Controllers\Admin\ProductController::class,'AssignImportProducts']);
    Route::post('assign-multiple-import-products',[\App\Http\Controllers\Admin\ProductController::class,'AssignMultipleImportProducts']);


    //collection
    Route::get('collections',[\App\Http\Controllers\Admin\CollectionController::class,'Collections']);

    Route::get('get-seller-data',[\App\Http\Controllers\Admin\SellerController::class,'GetSellerData']);


    //orders
    Route::get('orders',[\App\Http\Controllers\Admin\OrderController::class,'Orders']);
    Route::get('view-order/{id}',[\App\Http\Controllers\Admin\OrderController::class,'ViewOrder']);
    Route::get('sync-orders',[\App\Http\Controllers\Admin\OrderController::class,'SyncOrder']);
    Route::get('order-filter',[\App\Http\Controllers\Admin\OrderController::class,'OrderFilter']);
    Route::get('export-order',[\App\Http\Controllers\Admin\OrderController::class,'ExportOrder']);
    Route::get('search-order',[\App\Http\Controllers\Admin\OrderController::class,'SearchOrder']);
    Route::get('order-filter-payment',[\App\Http\Controllers\Admin\OrderController::class,'OrderFilterPayment']);


        //Global Commission
    Route::get('global-commission',[\App\Http\Controllers\Admin\CommissionController::class,'GlobalCommission']);
    Route::post('global-commission-save',[\App\Http\Controllers\Admin\CommissionController::class,'GlobalCommissionSave']);

    //Seller Commission
    Route::get('seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'SellerCommission']);
    Route::get('seller-commission-setting-filter',[\App\Http\Controllers\Admin\CommissionController::class,'SellerCommissionSettingFilter']);
    Route::get('seller-commission/{id}',[\App\Http\Controllers\Admin\CommissionController::class,'SellerCommissionFind']);
    Route::post('seller-commission-save',[\App\Http\Controllers\Admin\CommissionController::class,'SellerCommissionSave']);

    Route::delete('delete-seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'DeleteSellerCommission']);
    Route::get('commission-listing',[\App\Http\Controllers\Admin\CommissionController::class,'CommissionListing']);

    Route::get('search-seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'SearchSellerCommission']);
    Route::get('filter-seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'FilterSellerCommission']);
    Route::get('get-seller-list',[\App\Http\Controllers\Admin\CommissionController::class,'GetCommissionSellerList']);


    //Mail Configuration
    Route::get('mail-configuration',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailConfiguration']);
    Route::post('mail-configuration-save',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailConfigurationSave']);

    //Mail SMTP Setting Save
    Route::get('mail-smtp-setting',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailSmtp']);
    Route::post('mail-smtp-setting-save',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailSmtpSettingSave']);

    //shipment
    Route::get('shipment',[\App\Http\Controllers\Admin\ShipmentController::class,'Shipments']);
    Route::get('change-status-shipment',[\App\Http\Controllers\Admin\ShipmentController::class,'ChangeStatusShipment']);


    Route::prefix('/seller')->group(function(){

        Route::get('get-shop',[\App\Http\Controllers\Seller\DashboardController::class,'GetShop']);

        Route::get('seller-profile',[\App\Http\Controllers\Seller\DashboardController::class,'SellerProfile']);

        //Dashboard
        Route::get('recent-orders',[\App\Http\Controllers\Seller\DashboardController::class,'RecentOrders']);
        Route::get('recent-sellers',[\App\Http\Controllers\Seller\DashboardController::class,'RecentSellers']);
        Route::get('store-stats',[\App\Http\Controllers\Seller\DashboardController::class,'StoreStats']);
        Route::get('store-earning',[\App\Http\Controllers\Seller\DashboardController::class,'StoreEarning']);
        Route::get('store-earning-filter',[\App\Http\Controllers\Seller\DashboardController::class,'StoreEarningFilter']);
        Route::get('top-sold-products',[\App\Http\Controllers\Seller\DashboardController::class,'TopSoldProduct']);
        Route::get('out-of-stock-products',[\App\Http\Controllers\Seller\DashboardController::class,'OutOfStockProduct']);
        Route::get('get-graph-data',[\App\Http\Controllers\Seller\DashboardController::class,'GetGraphData']);


        Route::post('edit-seller',[\App\Http\Controllers\Seller\DashboardController::class,'EditSeller']);

        Route::post('change-password',[\App\Http\Controllers\Seller\DashboardController::class,'ChangePassword']);

        //products
        Route::get('products',[\App\Http\Controllers\Seller\ProductController::class,'Products']);
        Route::post('add-product',[\App\Http\Controllers\Seller\ProductController::class,'AddProduct']);
        Route::get('product-filter',[\App\Http\Controllers\Seller\ProductController::class,'ProductFilter']);
        Route::get('product-view/{id}',[\App\Http\Controllers\Seller\ProductController::class,'ProductView']);
        Route::delete('product-delete',[\App\Http\Controllers\Seller\ProductController::class,'Productdelete']);
        Route::get('export-product',[\App\Http\Controllers\Seller\ProductController::class,'ExportProduct']);
        Route::get('search-product',[\App\Http\Controllers\Seller\ProductController::class,'SearchProducts']);
        Route::post('add-product-image',[\App\Http\Controllers\Seller\ProductController::class,'AddProductImage']);
        Route::get('drag-image',[\App\Http\Controllers\Seller\ProductController::class,'DragImage']);
        Route::get('remove-img',[\App\Http\Controllers\Seller\ProductController::class,'RemoveImage']);
        //orders
        Route::get('orders',[\App\Http\Controllers\Seller\OrderController::class,'Orders']);
        Route::get('view-order/{id}',[\App\Http\Controllers\Seller\OrderController::class,'ViewOrder']);
        Route::get('export-order',[\App\Http\Controllers\Seller\OrderController::class,'ExportOrder']);
        Route::get('order-filter',[\App\Http\Controllers\Seller\OrderController::class,'OrderFilter']);
        Route::get('search-order',[\App\Http\Controllers\Seller\OrderController::class,'SearchOrders']);
        Route::get('order-filter-payment',[\App\Http\Controllers\Seller\OrderController::class,'OrderFilterPayment']);



   //commissions
        Route::get('commission-listing',[\App\Http\Controllers\Seller\CommissionController::class,'CommissionListing']);
        Route::get('search-commission',[\App\Http\Controllers\Seller\CommissionController::class,'SearchCommission']);


        //collection
        Route::get('collections',[\App\Http\Controllers\Seller\CollectionController::class,'Collections']);
        Route::get('get-data',[\App\Http\Controllers\Seller\DashboardController::class,'GetSellerData']);



        //couriers
        Route::get('couriers',[\App\Http\Controllers\Seller\ShipmentController::class,'Couriers']);
        Route::post('add-shipment',[\App\Http\Controllers\Seller\ShipmentController::class,'AddShipment']);
        Route::get('shipments',[\App\Http\Controllers\Seller\ShipmentController::class,'Shipments']);
        Route::delete('delete-shipment',[\App\Http\Controllers\Seller\ShipmentController::class,'DeleteShipment']);
        Route::get('shipment-view/{id}',[\App\Http\Controllers\Seller\ShipmentController::class,'ShipmentView']);
        Route::post('edit-shipment',[\App\Http\Controllers\Seller\ShipmentController::class,'EditShipment']);
    });



});

Route::post('forgot-password',[\App\Http\Controllers\Seller\DashboardController::class,'ForgotPassword']);



Route::post('/auth/register', [\App\Http\Controllers\AuthController::class, 'register']);

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/me', function(Request $request) {
        return auth()->user();
    });

    Route::post('/auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
});


Route::get('sync-collection', [\App\Http\Controllers\Admin\CollectionController::class, 'SyncCollection']);

Route::get('/testing', function() {





    $session=Session::where('shop','onetradingltd.myshopify.com')->first();

    $client = new Rest($session->shop, $session->access_token);

    $response = $client->get('/webhooks.json');

//        $product_delete = $client->post( '/webhooks.json', [
//
//        "webhook" => array(
//            "topic" => "orders/updated",
//            "format" => "json",
//            "address" => "https://phpstack-1018470-3598964.cloudwaysapps.com/api/webhooks/order-update"
//        )
//    ]);
//    dd($product_delete->getDecodedBody());

    dd($response->getDecodedBody());

})->name('getwebbhook');


//webhooks
Route::post('/webhooks/app-uninstall', function (Request $request) {

    try {

        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='uninstall';
        $logs->save();

        $product=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
//        $client = new Rest($shop->shop, $shop->access_token);
//        \App\Models\ProductVariant::where('shop_id',$shop->id)->delete();
//        \App\Models\UserTemplate::where('shop_id',$shop->id)->delete();
//        \App\Models\Advantage::where('shop_id',$shop->id)->delete();
//        \App\Models\Competator::where('shop_id',$shop->id)->delete();
//        \App\Models\CompetitorName::where('shop_id',$shop->id)->delete();
//        \App\Models\Charge::where('shop_id',$shop->id)->delete();
//        \App\Models\UserTemplateProduct::where('shop_id',$shop->id)->delete();
//        \App\Models\Product::where('shop_id',$shop->id)->delete();
//        $result = $client->get('/metafields/' .$shop->metafield_id. '.json');
//        $result = $result->getDecodedBody();
//        if(isset($result['metafield'])) {
//            $shop_metafield = $client->delete('/metafields/' . $shop->metafield_id . '.json');
//        }
        \App\Models\User::where('shop_id',$shop->id)->forceDelete();
        Session::where('id',$shop->id)->forceDelete();

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Uninstall catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});
Route::post('/webhooks/collection-create', function (Request $request) {


    try {

        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='collection create';
        $logs->save();
        $collection=json_decode($request->getContent());



        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $collectioncontroller = new \App\Http\Controllers\Admin\CollectionController();
        $collectioncontroller->singleCollection($collection,$shop->shop);

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Collection Create catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});


Route::post('/webhooks/collection-update', function (Request $request) {
    try {
        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='collection update';
        $logs->save();
        $collection=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $collectioncontroller = new \App\Http\Controllers\Admin\CollectionController();
        $collectioncontroller->singleCollection($collection,$shop->shop);

    } catch (\Exception $e) {
        $error_log=new \App\Models\log();
        $error_log->log='Collection update catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();

    }
});

Route::post('/webhooks/collection-delete', function (Request $request) {
    try {
        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='collection Delete';
        $logs->save();
        $collection=json_decode($request->getContent());

        $logs->log=$collection->id;
        $logs->verify='collection Delete dssd';
        $logs->save();

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
       \App\Models\Collection::where('shopify_id',$collection->id)->delete();

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Collection delete catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});

Route::post('/webhooks/order-create', function (Request $request) {
    try {

        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='order create';
        $logs->save();
        $order=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $ordercontroller = new \App\Http\Controllers\Admin\OrderController();
        $ordercontroller->singleOrder($order,$shop->shop);

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Order Create catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});


Route::post('/webhooks/order-update', function (Request $request) {
    try {

        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='order update';
        $logs->save();
        $order=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $ordercontroller = new \App\Http\Controllers\Admin\OrderController();
        $ordercontroller->singleOrder($order,$shop->shop);

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Order update catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});


Route::post('/webhooks/product-create', function (Request $request) {


    try {

        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='product create';
        $logs->save();
        $product=json_decode($request->getContent());



        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $productcontroller = new \App\Http\Controllers\Admin\ProductController();
        $productcontroller->createShopifyProducts($product,$shop->shop);

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Product Create catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});
Route::post('/webhooks/product-update', function (Request $request) {


    try {

        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='product update';
        $logs->save();
        $product=json_decode($request->getContent());



        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $productcontroller = new \App\Http\Controllers\Admin\ProductController();
        \App\Jobs\ProductUpdateJob::dispatch($product,$shop->shop);
//        $productcontroller->createShopifyProducts($product,$shop->shop);

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Product update catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});
Route::post('/webhooks/product-delete', function (Request $request) {


    try {

        $logs=new \App\Models\log();
        $logs->log=json_encode($request->getContent());
        $logs->verify='product delete';
        $logs->save();
        $product=json_decode($request->getContent());



        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $productcontroller = new \App\Http\Controllers\Admin\ProductController();
        $productcontroller->ShopifyDeleteProduct($product,$shop->shop);

    } catch (\Exception $e) {

        $error_log=new \App\Models\log();
        $error_log->log='Product delete catch';
        $error_log->verify=  $e->getMessage();
        $error_log->save();
    }
});



Route::post('/webhooks/inventory-update', function (Request $request) {
    try {

        $shop = $request->header('x-shopify-shop-domain');
        $shop = Session::where('shop', $shop)->first();

        $data = $request->getContent();
        $data = json_decode($data);

        $logs = new \App\Models\log();
        $logs->log = json_encode($data);
        $logs->verify='inventory Level update ';
        $logs->save();



        $product_variant=\App\Models\Variant::where('inventory_item_id',$data->inventory_item_id)->first();
        if($product_variant){

            $product_variant->quantity=$data->available;
            $product_variant->save();
        }

    } catch (\Exception $e) {

        $error_log = new \App\Models\ErrorLog();
        $error_log->message = 'inventory update res catch'.json_encode($e->getMessage());
        $error_log->save();
    }
});
