<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function Orders(Request $request){
        $user=User::find($request->user_id);
        if($user){
            $orders=Order::where('user_id',$user->id)->get();
            $data = [
                'orders'=>$orders
            ];
            return response()->json($data);
        }
    }
}
