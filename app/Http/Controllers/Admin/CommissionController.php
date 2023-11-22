<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\GlobalCommission;
use App\Models\SellerCommission;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $sellers=User::where('role','seller')->where('shop_id',$shop->id)->get();
        if($shop) {
            $seller_commissions = SellerCommission::where('shop_id', $shop->id)->orderBy('id','desc')->paginate(20);
//            if (count($seller_commissions) > 0) {
                $data = [
                    'data' => $seller_commissions,
                    'sellers'=>$sellers,
                ];
                return response()->json($data);
//            }
        }
    }

    public function SellerCommissionSave(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {

            $seller_exist=SellerCommission::where('shop_id',$shop->id)->where('store_name',$request->store_name)->first();
            if($seller_exist){
                $data = [
                    'message' => 'This Seller Already Exists',
                ];
                return response()->json($data,422);
            }
            $user=User::where('seller_shopname',$request->store_name)->first();
            if($user){
            $seller_commission = SellerCommission::where('shop_id', $shop->id)->where('user_id',$user->id)->first();

            if ($seller_commission == null) {
                $seller_commission = new SellerCommission();
            }
                $seller_commission->shop_id =$shop->id;
                $seller_commission->user_id =$user->id;
                $seller_commission->seller_name =$user->name;
                $seller_commission->store_name =$user->seller_shopname;
                $seller_commission->seller_email =$user->email;
                $seller_commission->commission_type =$request->commission_type;
                $seller_commission->first_commission =$request->first_commission;
                $seller_commission->second_commission =$request->second_commission;
                $seller_commission->save();

            $data = [
                'message' => 'Seller Commission Added Successfully',
                'data' => $seller_commission
            ];
            return response()->json($data);
        }else{
                $data = [
                    'message' => 'Seller Not Found',
                ];
                return response()->json($data,422);
            }
        }else{
            $data = [
                'message' => 'Shop Not Found',
            ];
            return response()->json($data,422);
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
            $sellers=User::where('role','seller')->where('shop_id',$shop->id)->get();
            $commission_logs=CommissionLog::where('shop_id',$shop->id)->orderBy('id','desc')->with('has_order','has_user','has_variant')->paginate(20);

            $data = [
                'data' => $commission_logs,
                 'currency'=>$shop->money_format,
                'sellers'=>$sellers
            ];
            return response()->json($data);
        }

    public function SearchCommission(Request $request){

        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
//        $commissions=CommissionLog::where('product_name', 'like', '%' . $request->query_value . '%');
        $commissions=CommissionLog::query();
        if($request->value!='undefined'){
            $commissions=$commissions->where('seller_email',$request->value);
        }

        $commissions = $commissions
            ->join('orders', 'commission_logs.order_id', '=', 'orders.id')
            ->where(function ($query) use ($request) {
                $query->where('orders.order_number', 'like', '%' . $request->query_value . '%')
                    ->orWhere('commission_logs.product_name', 'like', '%' . $request->query_value . '%');
            })
            ->where('commission_logs.shop_id', $session->id)
            ->with('has_order', 'has_user', 'has_variant')
            ->orderBy('commission_logs.id', 'desc') // Specify the table for id
            ->get();



        $sellers=User::where('role','seller')->where('shop_id',$session->id)->get();
//        $commissions=$commissions->where('shop_id',$session->id)->with('has_order','has_user','has_variant')->orderBy('id','desc')->get();
        $data = [
            'data' => $commissions,
              'currency'=>$session->money_format,
            'sellers'=>$sellers
        ];
        return response()->json($data);
    }

    public function SearchSellerCommission(Request $request){

        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();


        $seller_commissions=SellerCommission::where('seller_name','like', '%' . $request->query_value . '%')->orWhere('store_name','like', '%' . $request->query_value   . '%');

      if($request->value!='undefined'){
          $seller_commissions=$seller_commissions->where('user_id',$request->value);
      }
        $seller_commissions=  $seller_commissions->where('shop_id',$session->id)->orderBy('id','Desc')->paginate(20);


        $data = [
            'data' => $seller_commissions
        ];
        return response()->json($data);
    }


    public function GetCommissionSellerList(Request $request){
        $user = auth()->user();
        $session = Session::where('shop', $user->name)->first();
        $sellers = User::where('role', 'seller')
            ->where('users.shop_id', $session->id)
            ->leftJoin('seller_commissions', 'users.id', '=', 'seller_commissions.user_id')
            ->whereNull('seller_commissions.id')
            ->get();
        $data = [
            'currency'=>$session->money_format,
            'sellers'=>$sellers,
        ];
        return response()->json($data);
    }

    public function FilterSellerCommission(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $sellers=User::where('role','seller')->where('shop_id',$shop->id)->get();
        $commission_logs=CommissionLog::where('user_id',$request->value);

        if($request->query_value!=null){
            $commission_logs=$commission_logs->where('product_name','like', '%' . $request->query_value . '%');
        }

        $commission_logs=$commission_logs->where('shop_id',$shop->id)->with('has_order','has_user','has_variant')->orderBy('id','desc')->get();

        $data = [
            'data' => $commission_logs,
            'currency'=>$shop->money_format,
            'sellers'=>$sellers
        ];
        return response()->json($data);
    }


    public function SellerCommissionSettingFilter(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $sellers=User::where('role','seller')->where('shop_id',$shop->id)->get();
        if($shop) {

            $seller_commissions = SellerCommission::where('user_id',$request->value);


            if($request->query_value!=null){
                $seller_commissions=$seller_commissions->where('seller_name','like', '%' . $request->query_value . '%')->where('store_name','like', '%' . $request->query_value . '%');
            }
            $seller_commissions=$seller_commissions->where('shop_id', $shop->id)->orderBy('id','Desc')->paginate(20);
            if (count($seller_commissions) > 0) {
                $data = [
                    'data' => $seller_commissions,
                    'sellers'=>$sellers,
                ];
                return response()->json($data);
            }
        }
    }
}
