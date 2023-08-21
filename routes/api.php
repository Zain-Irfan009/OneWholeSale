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
    Route::get('update-seller-status',[\App\Http\Controllers\Admin\SellerController::class,'UpdateSellerStatus']);
    Route::post('change-password',[\App\Http\Controllers\Admin\SellerController::class,'ChangePassword']);
    Route::delete('delete-seller',[\App\Http\Controllers\Admin\SellerController::class,'DeleteSeller']);
    Route::get('sellers-filter',[\App\Http\Controllers\Admin\SellerController::class,'SellersFilter']);
    Route::post('send-message',[\App\Http\Controllers\Admin\SellerController::class,'SendMessage'])->middleware('smtp');
    Route::get('update-seller-status-multiple',[\App\Http\Controllers\Admin\SellerController::class,'UpdateSellerStatusMultiple']);
    Route::get('export-seller',[\App\Http\Controllers\Admin\SellerController::class,'ExportSeller']);
    Route::get('search-seller',[\App\Http\Controllers\Admin\SellerController::class,'SearchSeller']);



        //shop-page-setting
    Route::get('shop-setting',[\App\Http\Controllers\Admin\ShopController::class,'ShopSetting']);
    Route::post('shop-setting-save',[\App\Http\Controllers\Admin\ShopController::class,'ShopSettingSave']);
    Route::get('reset-default',[\App\Http\Controllers\Admin\ShopController::class,'ResetDefault']);

    //Product
    Route::get('products',[\App\Http\Controllers\Admin\ProductController::class,'Products']);
    Route::get('product-view/{id}',[\App\Http\Controllers\Admin\ProductController::class,'ProductView']);
    Route::post('add-product',[\App\Http\Controllers\Admin\ProductController::class,'AddProduct']);
    Route::get('update-product-status',[\App\Http\Controllers\Admin\ProductController::class,'UpdateProductStatus'])->middleware('smtp');
    Route::post('reassign-seller',[\App\Http\Controllers\Admin\ProductController::class,'ReassignSeller']);
    Route::delete('delete-product',[\App\Http\Controllers\Admin\ProductController::class,'DeleteProduct']);
    Route::get('product-filter',[\App\Http\Controllers\Admin\ProductController::class,'ProductFilter']);
    Route::get('edit-product/{id}',[\App\Http\Controllers\Admin\ProductController::class,'EditProduct']);
    Route::get('update-product-status-multiple',[\App\Http\Controllers\Admin\ProductController::class,'UpdateProductStatusMultiple']);
    Route::get('export-product',[\App\Http\Controllers\Admin\ProductController::class,'ExportProduct']);
    Route::get('search-product',[\App\Http\Controllers\Admin\ProductController::class,'SearchProduct']);
    Route::get('search-seller-product',[\App\Http\Controllers\Admin\ProductController::class,'SearchSellerProduct']);


    //import Product
    Route::get('import-products',[\App\Http\Controllers\Admin\ProductController::class,'ImportProducts']);
    Route::get('search-import-product',[\App\Http\Controllers\Admin\ProductController::class,'SearchImportProducts']);
    Route::post('import-csv',[\App\Http\Controllers\Admin\ProductController::class,'importCSV']);
    Route::post('assign-import-products',[\App\Http\Controllers\Admin\ProductController::class,'AssignImportProducts']);


    //collection
    Route::get('collections',[\App\Http\Controllers\Admin\CollectionController::class,'Collections']);

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
    Route::get('search-commission',[\App\Http\Controllers\Admin\CommissionController::class,'SearchCommission']);
    Route::get('search-seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'SearchSellerCommission']);
    Route::get('filter-seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'FilterSellerCommission']);
    Route::get('get-seller-list',[\App\Http\Controllers\Admin\CommissionController::class,'GetCommissionSellerList']);


    //Mail Configuration
    Route::get('mail-configuration',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailConfiguration']);
    Route::post('mail-configuration-save',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailConfigurationSave']);

    //Mail SMTP Setting Save
    Route::get('mail-smtp-setting',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailSmtp']);
    Route::post('mail-smtp-setting-save',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailSmtpSettingSave']);


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




        //products
        Route::get('products',[\App\Http\Controllers\Seller\ProductController::class,'Products']);
        Route::get('product-filter',[\App\Http\Controllers\Seller\ProductController::class,'ProductFilter']);
        Route::get('product-view/{id}',[\App\Http\Controllers\Seller\ProductController::class,'ProductView']);
        Route::delete('product-delete',[\App\Http\Controllers\Seller\ProductController::class,'Productdelete']);
        Route::get('export-product',[\App\Http\Controllers\Seller\ProductController::class,'ExportProduct']);
        Route::get('search-product',[\App\Http\Controllers\Seller\ProductController::class,'SearchProducts']);


        //orders
        Route::get('orders',[\App\Http\Controllers\Seller\OrderController::class,'Orders']);
        Route::get('view-order/{id}',[\App\Http\Controllers\Seller\OrderController::class,'ViewOrder']);
        Route::get('export-order',[\App\Http\Controllers\Seller\OrderController::class,'ExportOrder']);
        Route::get('order-filter',[\App\Http\Controllers\Seller\OrderController::class,'OrderFilter']);
        Route::get('search-order',[\App\Http\Controllers\Seller\OrderController::class,'SearchOrders']);

   //commissions
        Route::get('commission-listing',[\App\Http\Controllers\Seller\CommissionController::class,'CommissionListing']);
        Route::get('search-commission',[\App\Http\Controllers\Seller\CommissionController::class,'SearchCommission']);

    });



});




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

    $session=Session::where('shop','onewholesalelive.myshopify.com')->first();

    $client = new Rest($session->shop, $session->access_token);

    $response = $client->get('/webhooks.json');
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




