<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function CommissionListing(){
        $user=auth()->user();
        $session=Session::find($user->shop_id);
        $commission_logs=CommissionLog::where('user_id',$user->id)->with('has_order','has_user','has_variant')->orderBy('id','desc')->paginate(20);

        $data = [
            'data' => $commission_logs,
                  'currency'=>$session->money_format,
        ];
        return response()->json($data);
    }

    public function SearchCommission(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
//        $commissions=CommissionLog::where('product_name', 'like', '%' . $request->value . '%')->with('has_order','has_user','has_variant')->where('user_id',$user->id)->get();
        $commissions=CommissionLog::query();
        $commissions = $commissions
            ->join('orders', 'commission_logs.order_id', '=', 'orders.id')
            ->where(function ($query) use ($request) {
                $query->where('orders.order_number', 'like', '%' . $request->value . '%')
                    ->orWhere('commission_logs.product_name', 'like', '%' . $request->value . '%');
            })
            ->where('commission_logs.user_id', $user->id)
            ->with('has_order', 'has_user', 'has_variant')
            ->orderBy('commission_logs.id', 'desc') // Specify the table for id
            ->get();


        $data = [
            'data' => $commissions
        ];
        return response()->json($data);
    }
}
