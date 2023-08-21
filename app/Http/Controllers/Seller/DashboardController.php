<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\Order;
use App\Models\OrderSeller;
use App\Models\Product;
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

        $order_sellers=OrderSeller::where('user_id',$user->id)->get();
        $orders=array();
        foreach ($order_sellers as $order_seller){

            $order=Order::find($order_seller->order_id);
            $data['id']=$order->id;
            $data['shopify_order_id']=$order->shopify_order_id;
            $data['order_number']=$order->order_number;
            $data['user_name']=$user->name;
            $data['total_price']=$order->total_price;
            $data['financial_status']=$order->financial_status;
            $data['created_at']=$order->created_at;
            array_push($orders,$data);
        }

        return response()->json($orders);
    }

    public function GetGraphData(Request $request){
        $user=auth()->user();
        $start = new Carbon('first day of January ' . now()->year);
        $end = new Carbon('last day of December ' . now()->year);

        $record = CommissionLog::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw('MONTH(created_at) as month, sum(total_product_commission ) as total_sales'))
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

        $products = Product::where('quantity', 0)->where('user_id',$user->id)
            ->limit(5)
            ->latest()->get();
        $outof_stock_products=array();
        foreach ($products as $product){

            $total_sale=CommissionLog::where('shopify_product_id',$product->shopify_id)->where('user_id',$user->id)->sum('quantity');

            $data['product_id']=$product->id;
            $data['name']=$product->product_name;
            $data['total_sale']=$total_sale;
            array_push($outof_stock_products,$data);
        }

        return response()->json($outof_stock_products);
    }

    public function StoreStats(Request $request){

        $user=auth()->user();

        $shop=Session::where('id',$user->shop_id)->first();


        if($request->status==0) {
            $products = Product::where('user_id', $user->id)->count();
            $orders = Order::where('user_id',$user->id)->count();

        }else if($request->status==1){
            $startDate = Carbon::now()->startOfWeek();
            $endDate = Carbon::now()->endOfWeek();

            $products = Product::whereBetween('updated_at', [$startDate, $endDate])
                ->where('user_id', $user->id)
                ->count();

            $orders = Order::whereBetween('updated_at', [$startDate, $endDate])->where('user_id',$user->id)->count();

        }else if($request->status==2){
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();

            $products = Product::whereBetween('updated_at', [$startDate, $endDate])
                ->where('user_id', $user->id)
                ->count();

            $orders = Order::whereBetween('updated_at', [$startDate, $endDate])->where('user_id',$user->id)->count();


        }else if($request->status==3){
            $startDate = Carbon::now()->startOfYear();
            $endDate = Carbon::now()->endOfYear();
            $products = Product::where('user_id', $user->id)
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->count();

            $orders = Order::whereBetween('updated_at', [$startDate, $endDate])->where('user_id',$user->id)->count();

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
        $store_earning=CommissionLog::where('user_id',$user->id)->sum('total_product_commission');
        $store_earning=(string)((float)$store_earning);
        $total_commission=$store_earning;
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
            $store_earning=CommissionLog::where('user_id',$user->id)->sum('total_product_commission');
            $store_earning=(string)((float)$store_earning);
//            $total_commission=$user->total_commission;
            $total_commission=$store_earning;
            $data=[
                'store_earning'=>$store_earning,
                'currency'=>$shop->money_format,
                'total_commission'=>$total_commission,
            ];
            return response()->json($data);
        }

        $date=explode(',',$request->date);
        $start_date=$date[0];
        $end_date=$date[1];
        $store_earning = CommissionLog::where('user_id', $user->id)
            ->whereBetween('created_at', [$start_date, $end_date])
            ->sum('total_product_commission');
        $total_commission=(string)((float)$store_earning);

        $data=[
            'store_earning'=>$store_earning,
            'currency'=>$shop->money_format,
            'total_commission'=>$total_commission,
        ];
        return response()->json($data);


    }

}
