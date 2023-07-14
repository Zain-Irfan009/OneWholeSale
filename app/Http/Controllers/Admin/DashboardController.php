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
        if($request->status==0) {
            $products = Product::where('shop_id', $shop->id)->where('status', 'active')->count();
        }else if($request->status==1){
            $startDate = Carbon::now()->startOfWeek();
            $endDate = Carbon::now()->endOfWeek();

            $products = ProductHistory::where('shop_id', $shop->id)
                ->where('status', 'active')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();
        }else if($request->status==2){
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();

            $products = ProductHistory::where('shop_id', $shop->id)
                ->where('status', 'active')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();

        }else if($request->status==3){
            $startDate = Carbon::now()->startOfYear();
            $endDate = Carbon::now()->endOfYear();
            $products = ProductHistory::where('shop_id', $shop->id)
                ->where('status', 'active')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();

        }
        return response()->json($products);

    }

    public function StoreEarning(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $store_earning=CommissionLog::where('shop_id',$shop->id)->sum('total_admin_earning');
        $store_earning=(string)((float)$store_earning);
        return response()->json($store_earning);
    }

    public function StoreEarningFilter(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($request->date==null){
            $store_earning=CommissionLog::where('shop_id',$shop->id)->sum('total_admin_earning');
            $store_earning=(string)((float)$store_earning);
            return response()->json($store_earning);
        }

        $date=explode(',',$request->date);
        $start_date=$date[0];
        $end_date=$date[1];
        $store_earning = CommissionLog::where('shop_id', $shop->id)
            ->whereBetween('created_at', [$start_date, $end_date])
            ->sum('total_admin_earning');
        return response()->json($store_earning);

    }
}
