<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordMail;
use App\Models\Collection;
use App\Models\CommissionLog;
use App\Models\Order;
use App\Models\OrderSeller;
use App\Models\Product;
use App\Models\Session;
use App\Models\User;
use App\Models\Variant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Shopify\Clients\Rest;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    public function RecentOrders(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        $order_sellers=OrderSeller::where('user_id',$user->id)->latest()->take(3)->get();

        $orders=array();
        foreach ($order_sellers as $order_seller){

            $order=Order::find($order_seller->order_id);
            if($order) {
                $data['id'] = $order->id;
                $data['shopify_order_id'] = $order->shopify_order_id;
                $data['order_number'] = $order->order_number;
                $data['user_name'] = $user->name;
                $data['total_price'] = $order->total_price;
                $data['financial_status'] = $order->financial_status;
                $data['created_at'] = $order->created_at;
                array_push($orders, $data);
            }
        }

        return response()->json($orders);
    }

    public function GetGraphData(Request $request){
        $user=auth()->user();
        $start = new Carbon('first day of January ' . now()->year);
        $end = new Carbon('last day of December ' . now()->year);

        $record = CommissionLog::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw('MONTH(created_at) -1 as month, sum(total_product_commission ) as total_sales'))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->pluck('total_sales', 'month')
            ->toArray();
        $months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        $result = [];

        foreach ($months as $index => $monthName) {
            $monthNumber = $index;
            $value = $record[$monthNumber] ?? 0;
            $result[$monthNumber] = ['name' => $monthName, 'uv' => $value];
        }
        return response()->json($result);
    }
    public function TopSoldProduct(Request $request){

        $user=auth()->user();
        $shopify_products = CommissionLog::select('shopify_product_id', DB::raw('COUNT(*) as count'))
            ->groupBy('shopify_product_id')
            ->where('user_id',$user->id)
            ->orderByDesc('count')
            ->limit(2)
            ->get();

        $top_sold_products=array();
        foreach ($shopify_products as $shopify_product){

            $product=Product::where('shopify_id',$shopify_product->shopify_product_id)->first();
            if($product){

                $variant=Variant::where('shopify_product_id',$product->shopify_id)->where('title','!=','Default Title')->pluck('title')->toArray();
                $variant_sku=Variant::where('shopify_product_id',$product->shopify_id)->pluck('sku')->toArray();
                $variant=implode(',',$variant);
                $variant_sku = array_filter($variant_sku, function ($value) {
                    return !is_null($value) && $value !== '';
                });
                $variant_sku = implode(',', $variant_sku);
                $data['image']=$product->featured_image;
                $data['name']=$product->product_name;
                $data['seller_name']=$product->seller_name;
                $data['quantity']=$product->quantity;
                $data['number_of_sales']= $shopify_product->count;
                $data['variant']=$variant;
                $data['variant_sku']=$variant_sku;

                array_push($top_sold_products,$data);
            }
        }

        return response()->json($top_sold_products);
    }


    public function OutOfStockProduct(Request $request){
        $user=auth()->user();

        $products = Product::where('quantity', 0)->where('user_id',$user->id)
            ->limit(5)
            ->latest()->get();
        $outof_stock_products=array();
        foreach ($products as $product){
            $variant=Variant::where('shopify_product_id',$product->shopify_id)->where('title','!=','Default Title')->pluck('title')->toArray();
            $variant_sku=Variant::where('shopify_product_id',$product->shopify_id)->pluck('sku')->toArray();
            $variant=implode(',',$variant);
            $variant_sku = array_filter($variant_sku, function ($value) {
                return !is_null($value) && $value !== '';
            });
            $variant_sku = implode(',', $variant_sku);

            $total_sale=CommissionLog::where('shopify_product_id',$product->shopify_id)->where('user_id',$user->id)->sum('quantity');

            $data['product_id']=$product->id;
            $data['name']=$product->product_name;
            $data['total_sale']=$total_sale;
            $data['variant']=$variant;
            $data['variant_sku']=$variant_sku;
            array_push($outof_stock_products,$data);
        }

        return response()->json($outof_stock_products);
    }

    public function StoreStats(Request $request){

        $user=auth()->user();

        $shop=Session::where('id',$user->shop_id)->first();


        if($request->status==0) {
            $products = Product::where('user_id', $user->id)->count();
            $orders=OrderSeller::where('user_id',$user->id)->count();

        }else if($request->status==1){
            $startDate = Carbon::now()->startOfWeek();
            $endDate = Carbon::now()->endOfWeek();

            $products = Product::whereBetween('updated_at', [$startDate, $endDate])
                ->where('user_id', $user->id)
                ->count();

            $orders = OrderSeller::whereBetween('updated_at', [$startDate, $endDate])->where('user_id',$user->id)->count();

        }else if($request->status==2){
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();

            $products = Product::whereBetween('updated_at', [$startDate, $endDate])
                ->where('user_id', $user->id)
                ->count();

            $orders = OrderSeller::whereBetween('updated_at', [$startDate, $endDate])->where('user_id',$user->id)->count();


        }else if($request->status==3){
            $startDate = Carbon::now()->startOfYear();
            $endDate = Carbon::now()->endOfYear();
            $products = Product::where('user_id', $user->id)
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->count();

            $orders = OrderSeller::whereBetween('updated_at', [$startDate, $endDate])->where('user_id',$user->id)->count();

        }
        $data=[
            'products'=>$products,
            'orders'=>$orders,
        ];

        return response()->json($data);

    }


    public function StoreEarning(Request $request){
        $user=auth()->user();
        $shop=Session::find($user->shop_id);
        $store_earning=CommissionLog::where('user_id',$user->id)->sum('total_payout');
        $store_earning=(string)((float)$store_earning);
        $total_commission=$store_earning;
        $total_commission = number_format($total_commission, 2, '.', '');

        $data=[
            'store_earning'=>$store_earning,
            'currency'=>$shop->money_format,
            'total_commission'=>$total_commission,
        ];
        return response()->json($data);
    }

    public function StoreEarningFilter(Request $request){

        $user=auth()->user();
        $shop=Session::find($user->shop_id);
        if($request->date==null){
            $store_earning=CommissionLog::where('user_id',$user->id)->sum('total_payout');
            $store_earning=(string)((float)$store_earning);
//            $total_commission=$user->total_commission;
            $total_commission=$store_earning;
            $total_commission = number_format($total_commission, 2, '.', '');
            $data=[
                'store_earning'=>$store_earning,
                'currency'=>$shop->money_format,
                'total_commission'=>$total_commission,
            ];
            return response()->json($data);
        }

        $date=explode(',',$request->date);
        $start_date=$date[0];
        $end_date = date('Y-m-d', strtotime($date[1] . ' + 1 day'));
        $store_earning = CommissionLog::where('user_id', $user->id)
            ->whereBetween('created_at', [$start_date, $end_date])
            ->sum('total_payout');
        $total_commission=(string)((float)$store_earning);
        $total_commission = number_format($total_commission, 2, '.', '');

        $data=[
            'store_earning'=>$store_earning,
            'currency'=>$shop->money_format,
            'total_commission'=>$total_commission,
        ];
        return response()->json($data);

    }
        public function GetShop(Request $request){

            $user=auth()->user();
            if($user){

                return response()->json($user->collection_handle);
            }
        }

        public function SellerProfile(Request $request){
            $user=auth()->user();
            $seller=User::where('id',$user->id)->where('role','seller')->first();

            return response()->json($seller);
        }


    public function EditSeller(Request $request){
        $user=auth()->user();
        $shop=Session::where('id',$user->shop_id)->first();

        $client = new Rest($shop->shop, $shop->access_token);
        if($shop) {
            $seller = User::where('id', $user->id)->where('role', 'seller')->first();
            $custom_collection = $client->put( '/custom_collections/'.$seller->collection_id.'.json', [
                'custom_collection' => [
                    'title' => $request->seller_name,
                ]
            ]);
            $custom_collection=$custom_collection->getDecodedBody();
            if (!isset($custom_collection['errors']['key'])) {
                $custom_collection = $custom_collection['custom_collection'];
                $custom_collection = json_decode(json_encode($custom_collection));

                $seller->name = $request->seller_name;
                $seller->collection_id=$custom_collection->id;
                $seller->collection_handle=$custom_collection->handle;
//                $seller->seller_shopname = $request->seller_shopname;
//                $seller->email = $request->seller_email;
                $seller->seller_store_address = $request->seller_store_address;
                $seller->seller_zipcode = $request->seller_zipcode;
                $seller->seller_contact = $request->seller_contact;
                $seller->seller_store_description = $request->seller_store_description;
                $seller->seller_description = $request->seller_description;
                $seller->seller_policy = $request->seller_policy;
                if ($request->hasFile('seller_image')) {
                    $seller_image = $request->file('seller_image');
                    $destinationPath = 'sellerimage/';
                    $filename1 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $seller_image->getClientOriginalName());
                    $seller_image->move($destinationPath, $filename1);
                    $filename1 = (asset('sellerimage/' . $filename1));
                    $seller->seller_image = $filename1;
                }

                if ($request->hasFile('seller_shop_image')) {
                    $seller_shop_image = $request->file('seller_shop_image');
                    $destinationPath = 'shopimage/';
                    $filename = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $seller_shop_image->getClientOriginalName());
                    $seller_shop_image->move($destinationPath, $filename);
                    $filename = (asset('shopimage/' . $filename));
                    $seller->seller_shop_image = $filename;
                }

                if ($request->hasFile('store_banner_image')) {
                    $store_banner_image = $request->file('store_banner_image');
                    $destinationPath = 'storebannerimage/';
                    $filename2 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $store_banner_image->getClientOriginalName());
                    $store_banner_image->move($destinationPath, $filename2);
                    $filename2 = (asset('storebannerimage/' . $filename2));
                    $seller->store_banner_image = $filename2;
                }

                if ($request->publish_seller_profile == 'true') {
                    $publish_seller_profile = 1;
                } else {
                    $publish_seller_profile = 0;
                }
                $seller->publish_seller_profile = $publish_seller_profile;
                $seller->seller_handle = $request->seller_handle;
                $seller->shop_id = $shop->id;
                $seller->save();
                $this->SellerDetailMetafield($seller,$client);
                $data = [
                    'message' => 'Seller Updated Successfully',
                    'seller' => $seller
                ];
                return response()->json($data);
            }
        }else{
            return response()->json([
                'message' => 'Shop Not Found',
            ],422);
        }


    }

    public function SellerDetailMetafield($seller,$client){
        $seller_detail=array();
        $seller_detail['publish_profile']=$seller->publish_seller_profile;
        $seller_detail['name']=$seller->name;
        $seller_detail['seller_shopname']=$seller->seller_shopname;
        $seller_detail['email']=$seller->email;
        $seller_detail['seller_store_address']=$seller->seller_store_address;
        $seller_detail['seller_zipcode']=$seller->seller_zipcode;
        $seller_detail['seller_contact']=$seller->seller_contact;
        $seller_detail['seller_store_description']=$seller->seller_store_description;
        $seller_detail['seller_description']=$seller->seller_description;
        $seller_detail['seller_policy']=$seller->seller_policy;
        $seller_detail['seller_image']=$seller->seller_image;
        $seller_detail['seller_shop_image']=$seller->seller_shop_image;
        $seller_detail['store_banner_image']=$seller->store_banner_image;
        $seller_detail['seller_handle']=$seller->collection_handle;




        if($seller->metafield==null) {
            $seller_metafield = $client->post('/admin/api/2023-04/custom_collections/' . $seller->collection_id . '/metafields.json', [
                "metafield" => [
                    "key" => 'seller_detail',
                    "value" => json_encode($seller_detail),
                    "type" => "json_string",
                    "namespace" => "seller"
                ],
            ]);
        }else{

            $shop_metafield =$client->put('/admin/api/2023-04/metafields/'.$seller->metafield_id.'.json', [

                "metafield" =>

                    array(
                        "value" => json_encode($seller_detail),
                        "type" => "json_string",
                    ),
            ]);
        }
        $res= $seller_metafield->getDecodedBody();

        if(!isset($res['errors'])){

            $seller->metafield_id=$res['metafield']['id'];
            $seller->save();
        }

    }

    public function ForgotPassword(Request $request){

        $user=User::where('email',$request->email)->first();
        if($user){
            $randomPassword = Str::random(8);
            $details['to'] = $user->email;
            $details['name'] = $user->name;
            $details['subject'] = 'Onewholesale';
            $details['message'] = 'Your new Password is';
            $details['password'] = $randomPassword;

            Mail::to($details['to'])
                ->send(new ForgotPasswordMail($details));
            $status="Password Send Successfully on mail";
            $user->password= Hash::make($randomPassword);
            $user->save();
            return response()->json($status);
        }else{
            $status="We can't find a user with that email address.";
            return response()->json($status);
        }
    }


    public function ChangePassword(Request $request){

        $user=auth()->user();

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'message' => 'The current password is incorrect.',
            ], 422);
        }


        $validator = Validator::make($request->all(), [
            'password' => 'min:8|string|required_with:password_confirmation|same:password_confirmation',
            'password_confirmation' => 'min:8',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $errorString = implode(", ", $errors->all());


            return response()->json([
                'message' => $errorString,
            ],422);
        }

        $user->password=Hash::make($request->password);
        $user->save();
        return response()->json([
            'message' => "Password Changed Successfully",
        ]);

    }

    public function GetSellerData(Request $request){

        $user=auth()->user();
        $session=Session::where('shop',$user->shop_id)->first();
        $get_user=User::where('email',$request->email)->first();
        if($get_user){
            $collections=Collection::where('shopify_id',$get_user->collection_id)->first();

        }
        $data = [
            'collections'=>$collections,
            'shop_name'=>$get_user->seller_shopname
        ];

        return response()->json($data);
    }


    public function SetNewPassword(Request $request){
//dd($request->all());
        $validator = Validator::make($request->all(), [
            'password' => 'min:8|string|required_with:password_confirmation|same:password_confirmation',
            'password_confirmation' => 'min:8',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            $errors = $validator->errors();
            $errorString = implode(", ", $errors->all());


            return response()->json([
                'message' => $errorString,
            ],422);
        }
//        $seller->password=Hash::make($request->password);
    }
}
