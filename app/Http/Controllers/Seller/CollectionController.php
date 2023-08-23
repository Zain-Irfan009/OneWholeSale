<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function Collections(Request $request){
        $user = auth()->user();
        $session = Session::where('id', $user->shop_id)->first();
        $sellers=User::where('role','seller')->where('id',$user->id)->get();
        $collections=Collection::where('shop_id', $session->id)->distinct('title')->pluck('title')->toArray();

        $data = [
            'data'=>$collections,
            'currency'=>$session->money_format,
            'sellers'=>$sellers,
        ];
        return response()->json($data);
    }
}
