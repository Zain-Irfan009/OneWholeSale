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

    $response = Registry::register('/api/webhooks/app-uninstall', Topics::APP_UNINSTALLED, $shop, $session->getAccessToken());
    $response_order_create = Registry::register('/api/webhooks/order-create', Topics::ORDERS_CREATE, $shop, $session->getAccessToken());
    $response_collection_create = Registry::register('/api/webhooks/collection-create', Topics::COLLECTIONS_CREATE, $shop, $session->getAccessToken());
    $response_collection_update = Registry::register('/api/webhooks/collection-update', Topics::COLLECTIONS_UPDATE, $shop, $session->getAccessToken());
    $response_collection_delete = Registry::register('/api/webhooks/collection-delete', Topics::COLLECTIONS_DELETE, $shop, $session->getAccessToken());
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





Route::view('/{path?}', 'welcome')
    ->where('path', '.*')
    ->name('react');


//Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');






