<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function Shipments(Request $request){
//        dd($request->all());
        $user = auth()->user();
        $session = Session::where('shop', $user->name)->first();
        $sellers=User::where('role','seller')->where('shop_id',$session->id)->get();
        $shipments=Shipment::query();
        if ($request->value != null) {
            $shipments=$shipments->where('courier_name',$request->value)->orWhere('tracking_number','like', '%' . $request->value . '%');
        }
        if($request->status!= 'undefined'){
            $shipments=$shipments->where('status',$request->status);
        }
        if($request->seller!= 'undefined'){
            $shipments=$shipments->where('user_id',$request->seller);
        }
        $shipments=$shipments->orderby('id','desc')->paginate(20);
        $data = [
            'shipments'=>$shipments,
            'sellers'=>$sellers
        ];
        return response()->json($data);
    }


    public function ChangeStatusShipment(Request $request){
        $user = auth()->user();
        $session = Session::where('shop', $user->name)->first();
        $shipment=Shipment::find($request->id);
        if($shipment){
            $shipment->status=$request->status;
            $shipment->save();
            $data = [
                'message' => 'Shipment Status Changed Successfully',
            ];
            return response()->json($data);
        }

    }
}
