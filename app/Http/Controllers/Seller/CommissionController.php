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

        $commission_logs=CommissionLog::where('user_id',$user->id)->get();

        $data = [
            'data' => $commission_logs
        ];
        return response()->json($data);
    }
}
