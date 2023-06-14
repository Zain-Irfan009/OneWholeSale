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
        //Seller
    Route::get('sellers',[\App\Http\Controllers\Admin\SellerController::class,'Sellers']);
    Route::post('add-seller',[\App\Http\Controllers\Admin\SellerController::class,'AddSeller']);
    Route::get('seller-view/{id}',[\App\Http\Controllers\Admin\SellerController::class,'SellerView']);
    Route::post('edit-seller',[\App\Http\Controllers\Admin\SellerController::class,'EditSeller']);
    Route::get('update-seller-status',[\App\Http\Controllers\Admin\SellerController::class,'UpdateSellerStatus']);
    Route::post('change-password',[\App\Http\Controllers\Admin\SellerController::class,'ChangePassword']);
    Route::delete('delete-seller',[\App\Http\Controllers\Admin\SellerController::class,'DeleteSeller']);
    Route::get('sellers-filter',[\App\Http\Controllers\Admin\SellerController::class,'SellersFilter']);
    Route::post('send-message',[\App\Http\Controllers\Admin\SellerController::class,'SendMessage']);
    Route::get('update-seller-status-multiple',[\App\Http\Controllers\Admin\SellerController::class,'UpdateSellerStatusMultiple']);

        //shop-page-setting
    Route::get('shop-setting',[\App\Http\Controllers\Admin\ShopController::class,'ShopSetting']);
    Route::post('shop-setting-save',[\App\Http\Controllers\Admin\ShopController::class,'ShopSettingSave']);
    Route::get('reset-default',[\App\Http\Controllers\Admin\ShopController::class,'ResetDefault']);

    //Product
    Route::get('products',[\App\Http\Controllers\Admin\ProductController::class,'Products']);
    Route::post('add-product',[\App\Http\Controllers\Admin\ProductController::class,'AddProduct']);
    Route::get('update-product-status',[\App\Http\Controllers\Admin\ProductController::class,'UpdateProductStatus']);
    Route::post('reassign-seller',[\App\Http\Controllers\Admin\ProductController::class,'ReassignSeller']);
    Route::delete('delete-product',[\App\Http\Controllers\Admin\ProductController::class,'DeleteProduct']);
    Route::get('product-filter',[\App\Http\Controllers\Admin\ProductController::class,'ProductFilter']);
    Route::get('edit-product/{id}',[\App\Http\Controllers\Admin\ProductController::class,'EditProduct']);
    Route::get('update-product-status-multiple',[\App\Http\Controllers\Admin\ProductController::class,'UpdateProductStatusMultiple']);

    //collection
    //Product
    Route::get('collections',[\App\Http\Controllers\Admin\CollectionController::class,'Collections']);
    //orders
    Route::get('orders',[\App\Http\Controllers\Admin\OrderController::class,'Orders']);
    Route::get('view-order/{id}',[\App\Http\Controllers\Admin\OrderController::class,'ViewOrder']);
    Route::get('sync-orders',[\App\Http\Controllers\Admin\OrderController::class,'SyncOrder']);
    Route::get('order-filter',[\App\Http\Controllers\Admin\OrderController::class,'OrderFilter']);

        //Global Commission
    Route::get('global-commission',[\App\Http\Controllers\Admin\CommissionController::class,'GlobalCommission']);
    Route::post('global-commission-save',[\App\Http\Controllers\Admin\CommissionController::class,'GlobalCommissionSave']);

    //Seller Commission
    Route::get('seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'SellerCommission']);
    Route::get('seller-commission/{id}',[\App\Http\Controllers\Admin\CommissionController::class,'SellerCommissionFind']);
    Route::post('seller-commission-save',[\App\Http\Controllers\Admin\CommissionController::class,'SellerCommissionSave']);
    Route::delete('delete-seller-commission',[\App\Http\Controllers\Admin\CommissionController::class,'DeleteSellerCommission']);
    Route::get('commission-listing',[\App\Http\Controllers\Admin\CommissionController::class,'CommissionListing']);



    //Mail Configuration
    Route::get('mail-configuration',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailConfiguration']);
    Route::post('mail-configuration-save',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailConfigurationSave']);

    //Mail SMTP Setting Save
    Route::get('mail-smtp-setting',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailSmtp']);
    Route::post('mail-smtp-setting-save',[\App\Http\Controllers\Admin\MailConfigurationController::class,'MailSmtpSettingSave']);


    Route::prefix('/seller')->group(function(){

        //products
        Route::get('products',[\App\Http\Controllers\Seller\ProductController::class,'Products']);
        Route::get('product-filter',[\App\Http\Controllers\Seller\ProductController::class,'ProductFilter']);
        Route::get('product-view/{id}',[\App\Http\Controllers\Seller\ProductController::class,'ProductView']);
        Route::get('product-delete',[\App\Http\Controllers\Seller\ProductController::class,'Productdelete']);


        //orders
        Route::get('orders',[\App\Http\Controllers\Seller\OrderController::class,'Orders']);

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

    $session=Session::where('shop','tlx-new-brand.myshopify.com')->first();

    $client = new Rest($session->shop, $session->access_token);

    $response = $client->get('/webhooks.json');
    dd($response->getDecodedBody());

})->name('getwebbhook');
