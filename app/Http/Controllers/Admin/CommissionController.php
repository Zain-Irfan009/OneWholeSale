<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\GlobalCommission;
use App\Models\SellerCommission;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;

class CommissionController extends Controller
{

    public function GlobalCommission(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {
            $global_commission = GlobalCommission::where('shop_id', $shop->id)->first();
            if ($global_commission) {
                $data = [
                    'data' => $global_commission
                ];
                return response()->json($data);
            }
        }

    }

    public function GlobalCommissionSave(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        $global_commission=GlobalCommission::where('shop_id',$shop->id)->first();
        if($global_commission==null){
            $global_commission=new GlobalCommission();
        }
        $global_commission->commission_type=$request->commission_type;
        $global_commission->fixed_commission_type=$request->fixed_commission_type;
        $global_commission->global_commission=$request->global_commission;
        $global_commission->second_global_commission=$request->second_global_commission;
        $global_commission->enable_maximum_commission=$request->enable_maximum_commission;
        $global_commission->maximum_commission=$request->maximum_commission;
        $global_commission->shop_id=$shop->id;
        $global_commission->save();

        $data = [
            'message' => 'Global Commission Added Successfully',
            'data'=>$global_commission
        ];
        return response()->json($data);

    }

    public function SellerCommission(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        if($shop) {
            $seller_commissions = SellerCommission::where('shop_id', $shop->id)->get();
            if (count($seller_commissions) > 0) {
                $data = [
                    'data' => $seller_commissions
                ];
                return response()->json($data);
            }
        }
    }

    public function SellerCommissionSave(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {
            $user=User::where('email',$request->seller_email)->first();
            if($user){
            $seller_commission = SellerCommission::where('shop_id', $shop->id)->where('user_id',$user->id)->first();

            if ($seller_commission == null) {
                $seller_commission = new SellerCommission();
            }
                $seller_commission->shop_id =$shop->id;
                $seller_commission->user_id =$user->id;
                $seller_commission->seller_name =$user->name;
                $seller_commission->store_name =$user->seller_shopname;
                $seller_commission->seller_email =$request->seller_email;
                $seller_commission->commission_type =$request->commission_type;
                $seller_commission->first_commission =$request->first_commission;
                $seller_commission->second_commission =$request->second_commission;
                $seller_commission->save();

            $data = [
                'message' => 'Seller Commission Added Successfully',
                'data' => $seller_commission
            ];
            return response()->json($data);
        }
        }

    }

    public function SellerCommissionFind($id, Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        if($shop){

            $seller_commission=SellerCommission::find($id);
            if($seller_commission){
                $data = [
                    'data' => $seller_commission
                ];
                return response()->json($data);

            }
        }
    }

    public function DeleteSellerCommission(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {
            SellerCommission::where('id',$request->id)->where('shop_id', $shop->id)->delete();
                $data = [
                    'message' => 'Seller Commission Deleted Successfully',
                ];
                return response()->json($data);
        }
        }

        public function CommissionListing(Request $request){

            $user=auth()->user();
            $shop=Session::where('shop',$user->name)->first();

            $commission_logs=CommissionLog::where('shop_id',$shop->id)->get();

            $data = [
                'data' => $commission_logs
            ];
            return response()->json($data);
        }


}