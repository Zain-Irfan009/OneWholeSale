<?php

use App\Models\Collection;
use Illuminate\Support\Facades\Route;
use App\Exceptions\ShopifyProductCreatorException;
use App\Lib\AuthRedirection;
use App\Lib\EnsureBilling;
use App\Lib\ProductCreator;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Shopify\Auth\OAuth;
use Shopify\Auth\Session as AuthSession;
use Shopify\Clients\HttpHeaders;
use Shopify\Clients\Rest;
use Shopify\Context;
use Shopify\Exception\InvalidWebhookException;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});




Route::get('/shop_home', function (Request $request) {

    if($request->shop){
        $user=\App\Models\User::where('name',$request->shop)->first();
        if($user!=null) {
          $token = $user->createToken('MyApp')->plainTextToken;

        }
        return view('shop_home',compact('token'));
    }

})->middleware('shopify.installed');


Route::get('/api/auth', function (Request $request) {
    $shop = Utils::sanitizeShopDomain($request->query('shop'));

    // Delete any previously created OAuth sessions that were not completed (don't have an access token)
    Session::where('shop', $shop)->where('access_token', null)->delete();

    return AuthRedirection::redirect($request);
});

Route::get('/api/auth/callback', function (Request $request) {
    $session = OAuth::callback(
        $request->cookie(),
        $request->query(),
        ['App\Lib\CookieHandler', 'saveShopifyCookie'],
    );

    $host = $request->query('host');
    $shop = Utils::sanitizeShopDomain($request->query('shop'));
    $email='shop@'.$shop;
    $user=\App\Models\User::where('email',$email)->first();

    $user_session=Session::where('shop',$shop)->first();
    if($user==null){
        $user=new \App\Models\User();
    }
    $user->name=$shop;
    $user->email=$email;
    $user->role='admin';
    $user->password=$session->getAccessToken();
    $user->shop_id=$user_session->id;
    $user->save();

    $response = Registry::register('/webhooks/app-uninstall', Topics::APP_UNINSTALLED, $shop, $session->getAccessToken());
    $response_order_create = Registry::register('/webhooks/order-create', Topics::ORDERS_CREATE, $shop, $session->getAccessToken());
    $response_collection_create = Registry::register('/webhooks/collection-create', Topics::COLLECTIONS_CREATE, $shop, $session->getAccessToken());
    $response_collection_update = Registry::register('/webhooks/collection-update', Topics::COLLECTIONS_UPDATE, $shop, $session->getAccessToken());
    $response_collection_delete = Registry::register('/webhooks/collection-delete', Topics::COLLECTIONS_DELETE, $shop, $session->getAccessToken());
    if ($response->isSuccess()) {
        Log::debug("Registered APP_UNINSTALLED webhook for shop $shop");


    } else {
        Log::error(
            "Failed to register APP_UNINSTALLED webhook for shop $shop with response body: " .
            print_r($response->getBody(), true)
        );
    }

    $redirectUrl = Utils::getEmbeddedAppUrl($host);
    if (Config::get('shopify.billing.required')) {
        list($hasPayment, $confirmationUrl) = EnsureBilling::check($session, Config::get('shopify.billing'));

        if (!$hasPayment) {
            $redirectUrl = $confirmationUrl;
        }
    }

    return redirect($redirectUrl);
});


Route::post('/webhooks/order-create', function (Request $request) {
    try {
        $order=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $ordercontroller = new \App\Http\Controllers\Admin\OrderController();
        $ordercontroller->singleOrder($order,$shop->shop);

    } catch (\Exception $e) {

//        $error_log=new \App\Models\ErrorLog();
//        $error_log->topic='Product Create catch';
//        $error_log->response=  $e->getMessage();
//        $error_log->save();
    }
});

Route::post('/webhooks/collection-create', function (Request $request) {
    try {
        $collection=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $collectioncontroller = new \App\Http\Controllers\Admin\CollectionController();
        $collectioncontroller->singleCollection($collection,$shop->shop);

    } catch (\Exception $e) {


    }
});

Route::post('/webhooks/collection-update', function (Request $request) {
    try {
        $collection=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $collectioncontroller = new \App\Http\Controllers\Admin\CollectionController();
        $collectioncontroller->singleCollection($collection,$shop->shop);

    } catch (\Exception $e) {


    }
});

Route::post('/webhooks/collection-delete', function (Request $request) {
    try {
        $collection=json_decode($request->getContent());

        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        Collection::where('shopify_id', $collection->id)->where('shop_id', $shop->id)->delete();

    } catch (\Exception $e) {


    }
});


Route::view('/{path?}', 'welcome')
    ->where('path', '.*')
    ->name('react');


//Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');


Route::get('/testing1', function() {


    $user=\App\Models\User::where('name','onewholesalelive.myshopify.com')->first();
    $session = Session::where('shop', $user->name)->first();
    $shop = new Rest($session->shop, $session->access_token);
    $response = $shop->get('webhooks', [], ['limit' => 250]);
    dd($response->getDecodedBody());

})->name('getwebbhook');

Route::post('/webhooks/app-uninstall', function (Request $request) {

    try {
//        $error_log=new \App\Models\ErrorLog();
//        $error_log->topic='uninstall';
//        $error_log->response=$request->header('x-shopify-shop-domain');
//        $error_log->save();

        $product=json_decode($request->getContent());
        $shop=$request->header('x-shopify-shop-domain');
        $shop=Session::where('shop',$shop)->first();
        $client = new Rest($shop->shop, $shop->access_token);
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

//        $error_log=new \App\Models\ErrorLog();
//        $error_log->topic='Unistall catch';
//        $error_log->response=  $e->getMessage();
//        $error_log->save();
    }
});

