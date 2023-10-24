<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductHistory;
use App\Models\Session;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Shopify\Clients\Rest;

class DashboardController extends Controller
{

    public function RecentOrders(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $orders = Order::where('shop_id', $shop->id)->latest()->take(3)->get();
        return response()->json($orders);
    }

    public function RecentSellers(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $sellers = User::where('shop_id', $shop->id)->where('role','seller')->latest()->take(3)->get();
        return response()->json($sellers);
    }
    public function StoreStats(Request $request){

        $user=auth()->user();

        $shop=Session::where('shop',$user->name)->first();

        if($shop->currency==null){
            $shop_api = new Rest($shop->shop, $shop->access_token);
            $result = $shop_api->get('shop');
            $result = $result->getDecodedBody();
           $result=$result['shop'];
           $money_format=$result['money_format'];
           $money_format=explode('.{{amount}}',$money_format);
            $money_format=$money_format[0];
             $shop->currency=$result['currency'];
             $shop->money_format=$money_format;
             $shop->save();
        }

        if($request->status==0) {
            $products = Product::where('shop_id', $shop->id)->count();
            $approval_pending_products = Product::where('product_status','Approval Pending')->where('shop_id', $shop->id)->count();
            $approved_products = Product::where('product_status','Approved')->where('shop_id', $shop->id)->count();
            $disabled_products = Product::where('product_status','Disabled')->where('shop_id', $shop->id)->count();



            $sellers = User::where('role','seller')->where('shop_id', $shop->id)->count();
            $approval_pending_sellers = User::whereNull('status')->where('role','seller')->where('shop_id', $shop->id)->count();
            $approved_sellers = User::where('role','seller')->where('status',1)->where('shop_id', $shop->id)->count();
            $disabled_sellers = User::where('role','seller')->where('status',0)->where('shop_id', $shop->id)->count();


        }else if($request->status==1){
            $startDate = Carbon::now()->startOfWeek();
            $endDate = Carbon::now()->endOfWeek();

            $products = Product::whereBetween('updated_at', [$startDate, $endDate])
                ->where('shop_id', $shop->id)
                ->count();

            $approved_products = Product::whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)
                ->where('product_status','Approved')
                ->count();

            $approval_pending_products = Product::where('product_status','Approval Pending')
                ->whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)
                ->count();

            $disabled_products = Product::where('shop_id', $shop->id)
                ->where('product_status','Disabled')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->count();

            $sellers = User::where('role','seller')->whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)->count();
            $approval_pending_sellers = User::whereNull('status')->where('role','seller')->whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)->count();
            $approved_sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('status',1)->where('shop_id', $shop->id)->count();
            $disabled_sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('status',0)->where('shop_id', $shop->id)->count();


        }else if($request->status==2){
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();

            $products = Product::whereBetween('updated_at', [$startDate, $endDate])
                ->where('shop_id', $shop->id)
                ->count();

            $approved_products = Product::where('product_status','Approved')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->where('shop_id', $shop->id)
                ->count();

            $approval_pending_products = Product::where('product_status','Approval Pending')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->where('shop_id', $shop->id)
                ->count();
            $disabled_products = Product::where('product_status','Disabled')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->where('shop_id', $shop->id)
                ->count();

            $sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)->count();
            $approval_pending_sellers = User::whereNull('status')->where('role','seller')->whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)->count();
            $approved_sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('status',1)->where('shop_id', $shop->id)->count();
            $disabled_sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('status',0)->where('shop_id', $shop->id)->count();

        }else if($request->status==3){
            $startDate = Carbon::now()->startOfYear();
            $endDate = Carbon::now()->endOfYear();
            $products = Product::where('shop_id', $shop->id)
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->count();

            $approved_products = Product::where('shop_id', $shop->id)
                ->where('product_status','Approved')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->count();

            $approval_pending_products = Product::where('shop_id', $shop->id)
                ->where('product_status','Approval Pending')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->count();

            $disabled_products = Product::where('shop_id', $shop->id)
                ->where('product_status','Disabled')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->count();
            $sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)->count();
            $approval_pending_sellers = User::whereNull('status')->where('role','seller')->whereBetween('updated_at', [$startDate, $endDate])->where('shop_id', $shop->id)->count();
            $approved_sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('status',1)->where('shop_id', $shop->id)->count();
            $disabled_sellers = User::where('role','seller') ->whereBetween('updated_at', [$startDate, $endDate])->where('status',0)->where('shop_id', $shop->id)->count();



        }

        $data=[
          'products'=>$products,
          'approval_pending_products'=>$approval_pending_products,
          'approved_products'=>$approved_products,
          'disabled_products'=>$disabled_products,
            'sellers'=>$sellers,
            'approved_sellers'=>$approved_sellers,
            'disabled_sellers'=>$disabled_sellers,
            'approval_pending_sellers'=>$approval_pending_sellers,

        ];

        return response()->json($data);

    }

    public function StoreEarning(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $store_earning=CommissionLog::where('shop_id',$shop->id)->sum('total_product_commission');
        $store_earning = number_format((float)$store_earning, 2);
//        $total_commission=User::where('role','seller')->where('shop_id',$shop->id)->sum('total_commission');
        $total_commission=CommissionLog::where('shop_id',$shop->id)->sum('total_payout');

        $data=[
          'store_earning'=>$store_earning,
          'currency'=>$shop->money_format,
          'total_commission'=>number_format($total_commission,2),
        ];
        return response()->json($data);
    }

    public function StoreEarningFilter(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($request->date==null){
            $store_earning=CommissionLog::where('shop_id',$shop->id)->sum('total_product_commission');
//            $total_commission=User::where('role','seller')->where('shop_id',$shop->id)->sum('total_commission');
            $total_commission=CommissionLog::where('shop_id',$shop->id)->sum('total_payout');
            $store_earning = number_format((float)$store_earning, 2);
            $data=[
                'store_earning'=>$store_earning,
                'currency'=>$shop->money_format,
                'total_commission'=>number_format($total_commission,2),
            ];
            return response()->json($data);
        }

        $date=explode(',',$request->date);
        $start_date=$date[0];
        $end_date=$date[1];
        $store_earning = CommissionLog::where('shop_id', $shop->id)
            ->whereBetween('created_at', [$start_date, $end_date])
            ->sum('total_admin_earning');
        $total_commission=User::where('role','seller')->whereBetween('created_at', [$start_date, $end_date])->where('shop_id',$shop->id)->sum('total_commission');

        $data=[
            'store_earning'=>number_format($store_earning,2),
            'currency'=>$shop->money_format,
            'total_commission'=>number_format($total_commission,2),
        ];
        return response()->json($data);


    }

    public function TopSoldProduct(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $shopify_products = CommissionLog::select('shopify_product_id', DB::raw('COUNT(*) as count'))
            ->groupBy('shopify_product_id')
            ->where('shop_id',$shop->id)
            ->orderByDesc('count')
            ->limit(2)
            ->get();

        $top_sold_products=array();
            foreach ($shopify_products as $shopify_product){

            $product=Product::where('shopify_id',$shopify_product->shopify_product_id)->first();
            if($product){
                $data['image']=$product->featured_image;
                $data['name']=$product->product_name;
                  $data['seller_name']=$product->seller_name;
                  $data['quantity']=$product->quantity;
                    $data['number_of_sales']= $shopify_product->count;

            array_push($top_sold_products,$data);
            }
            }
        return response()->json($top_sold_products);
    }

    public function OutOfStockProduct(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $products = Product::where('quantity', '<', 0)->where('shop_id',$shop->id)
            ->limit(5)
            ->latest()->get();
        $outof_stock_products=array();
        foreach ($products as $product){

            $total_sale=CommissionLog::where('shopify_product_id',$product->shopify_id)->where('shop_id',$shop->id)->sum('quantity');

            $data['product_id']=$product->id;
            $data['name']=$product->product_name;
            $data['total_sale']=$total_sale;
            array_push($outof_stock_products,$data);
        }

        return response()->json($outof_stock_products);
    }


    public function GetGraphData(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $start = new Carbon('first day of January ' . now()->year);
        $end = new Carbon('last day of December ' . now()->year);


        $record = CommissionLog::where('shop_id', $shop->id)
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw('MONTH(created_at) as month, sum(total_product_commission + total_admin_earning) as total_sales'))
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
}
