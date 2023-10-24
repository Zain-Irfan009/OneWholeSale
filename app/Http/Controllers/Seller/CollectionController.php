<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function Collections(Request $request){
        $user = auth()->user();
        $user_email = User::where('email', $user->email)->pluck('email');
        $session = Session::where('id', $user->shop_id)->first();
        $sellers=User::where('role','seller')->where('id',$user->id)->get();
        $collections=Collection::where('shop_id', $session->id)->distinct('title')->pluck('title')->toArray();
        $product_types = Product::where('user_id',$user->id)
            ->distinct()
            ->pluck('product_type')
            ->filter(function ($value) {
                return !is_null($value) && $value !== '';
            })
            ->values();

        $data = [
            'data'=>$collections,
            'currency'=>$session->money_format,
            'sellers'=>$sellers,
            'product_types'=>$product_types,
            'email'=>$user_email
        ];
        return response()->json($data);
    }
}
