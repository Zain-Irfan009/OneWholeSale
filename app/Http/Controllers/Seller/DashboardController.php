<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\Order;
use App\Models\OrderSeller;
use App\Models\Product;
use App\Models\Session;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}
