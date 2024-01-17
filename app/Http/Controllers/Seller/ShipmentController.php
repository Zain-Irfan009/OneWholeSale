<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Mail\SendMail;
use App\Models\Courier;
use App\Models\MailSmtpSetting;
use App\Models\Session;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ShipmentController extends Controller
{
    public function Couriers(){

        $couriers=Courier::pluck('courier')->toArray();
        $data = [
            'data'=>$couriers,
        ];
        return response()->json($data);
    }


    public function Shipments(Request $request){

        $user=auth()->user();
        $shipments=Shipment::query();
        if ($request->value != null) {
            $shipments=$shipments->where('courier_name',$request->value)->orWhere('tracking_number','like', '%' . $request->value . '%');
        }
        if($request->status!= 'undefined'){
            $shipments=$shipments->where('status',$request->status);
        }
        $shipments=$shipments->where('user_id',$user->id)->orderBy('id','desc')->paginate(20);
        $data = [
            'shipments'=>$shipments,
];
        return response()->json($data);

    }

    public function AddShipment(Request $request){

        $user=auth()->user();
        $shipment=new Shipment();
        $shipment->user_id=$user->id;
        $shipment->seller_name=$user->seller_shopname;
        $shipment->shop_id=$user->shop_id;
        $shipment->courier_name=$request->courier;
        $shipment->comment=$request->comment;
        $shipment->status='In-transit';
        $shipment->tracking_number=$request->tracking_number;

        if ($request->hasFile('file_selected')) {
            $shipment_file = $request->file('file_selected');
            $destinationPath = 'shipment/';
            $filename1 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $shipment_file->getClientOriginalName());
            $shipment_file->move($destinationPath, $filename1);
            $filename1 = (asset('shipment/' . $filename1));
            $shipment->file=$filename1;
        }
        $shipment->save();

        $Setting = MailSmtpSetting::where('shop_id', $user->shop_id)->first();
        $type='Shipment';
        $details['to'] = $user->email;
        $details['name'] = $user->name;
        $details['subject'] = 'Shipment Attachment';
        $details['tracking_number']=$shipment->tracking_number;
        $details['comment']=$shipment->comment;
        $details['courier']=$shipment->courier_name;
        $details['attachment']=$shipment->file;
        try {
        Mail::to('support@onewholesale.ca')->send(new SendMail($details, $Setting, $type));
        }catch (\Exception $exception){

        }
        $data = [
            'message' => 'Shipment Created Successfully',
        ];
        return response()->json($data);


    }


    public function DeleteShipment(Request $request){
        $user=auth()->user();
        $shipment=Shipment::find($request->id);
        if($shipment){
            $shipment->delete();
            $data = [
                'message' => 'Shipment Deleted Successfully',
            ];
            return response()->json($data);
        }
    }


    public function ShipmentView(Request $request,$id){
        $user=auth()->user();
        $shipment=Shipment::find($request->id);
        if($shipment){
            $data = [
                'shipment'=>$shipment,
            ];
            return response()->json($data);

        }
    }

    public function EditShipment(Request $request){

        $user=auth()->user();
        $shipment=Shipment::find($request->id);
        if($shipment) {
            $shipment->user_id = $user->id;
            $shipment->seller_name = $user->seller_shopname;
            $shipment->shop_id = $user->shop_id;
            $shipment->courier_name = $request->courier;
            $shipment->comment = $request->comment;
            $shipment->status = 'In-transit';
            $shipment->tracking_number = $request->tracking_number;

            if ($request->file_selected!='null' && $request->hasFile('file_selected')) {
                $shipment_file = $request->file('file_selected');
                $destinationPath = 'shipment/';
                $filename1 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $shipment_file->getClientOriginalName());
                $shipment_file->move($destinationPath, $filename1);
                $filename1 = (asset('shipment/' . $filename1));
                $shipment->file = $filename1;
            }else{
                if($request->file_url!='null') {
                    $shipment->file = $request->file_url;
                }
            }
            $shipment->save();
            $data = [
                'message' => 'Shipment Updated Successfully',
            ];
            return response()->json($data);
        }

    }
}
