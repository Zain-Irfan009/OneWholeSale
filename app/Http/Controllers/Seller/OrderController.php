<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\LineItem;
use App\Models\Order;
use App\Models\OrderSeller;
use App\Models\Product;
use App\Models\Session;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class OrderController extends Controller
{
    public function Orders(Request $request){
        $user=auth()->user();
        $user=User::find($user->id);

        $order_sellers=OrderSeller::where('user_id',$user->id)->orderBy('id','Desc')->get();
        $order_array=array();

        foreach ($order_sellers as $order_seller){
            $order=Order::find($order_seller->order_id);
            if($order) {
                $data['id'] = $order->id;
                $data['order_number'] = $order->order_number;
                $data['financial_status'] = $order->financial_status;
                $data['fulfillment_status'] = $order->fulfillment_status;
                $data['created_at'] = $order->created_at;
                $data['cancelled_at'] = $order->cancelled_at;
                array_push($order_array, $data);
            }
            }
        if($user){

            $data = [
                'orders'=>$order_array
            ];
            return response()->json($data);
        }
    }

    public function ViewOrder(Request $request,$id){
        $user=auth()->user();
        $session=Session::where('id',$user->shop_id)->first();


        $order=Order::find($id);

        $date = Date::createFromFormat('Y-m-d H:i:s', $order->created_at);
        $date = $date->format('F j, Y \a\t g:i a');

        $order_commission=CommissionLog::where('order_id',$id)->where('user_id',$user->id)->sum('sub_total_payout');

        $line_items=LineItem::where('shopify_order_id',$order->shopify_order_id)->where('user_id',$user->id)->get();
        $line_item_array=array();
        $line_item_data=array();
        $total_items=0;
        foreach ($line_items as $line_item){
            $total_items+=$line_item->quantity;
            $product=Product::where('shopify_id',$line_item->shopify_product_id)->where('user_id',$user->id)->first();

            $line_item_array['id']=$line_item->id;
            $line_item_array['title']=$line_item->title;
            $line_item_array['quantity']=$line_item->quantity;
            $line_item_array['price']=$line_item->price;
            $variant=Variant::where('shopify_id',$line_item->shopify_variant_id)->first();
            if($variant && $variant->src){
                $line_item_array['image'] = $variant->src;
            }
            else if($product && $product->featured_image){
                $line_item_array['image'] = $product->featured_image;
            }else{
                $line_item_array['image'] = public_path('empty.jpg');
            }
            array_push($line_item_data,$line_item_array);
        }


        $data=[
            'order'=>$order,
            'order_commission'=>(string)((float)$order_commission),
            'line_items'=>$line_item_data,
            'date'=>$date,
            'total_items'=>$total_items,
            'currency'=>$session->money_format,
        ];
        return response()->json($data);

    }

    public function ExportOrder(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        $order_sellers=OrderSeller::where('user_id',$user->id)->orderBy('id','Desc')->get();
        $order_array=array();

        foreach ($order_sellers as $order_seller){
            $order=Order::find($order_seller->order_id);
            if($order) {
                $data['id'] = $order->id;
                $data['order_number'] = $order->order_number;
                $data['shipping_name'] = $order->shipping_name;
                $data['email'] = $order->email;
                $data['financial_status'] = $order->financial_status;
                $data['fulfillment_status'] = $order->fulfillment_status;
                $data['created_at'] = $order->created_at;
                $data['cancelled_at'] = $order->cancelled_at;
                array_push($order_array, $data);
            }
        }


        $name = 'Order-' . time() . '.csv';
        $file = fopen(public_path($name), 'w+');

        // Add the CSV headers
        fputcsv($file, ['Order Number','Shipping Name', 'Email','Financial Status']);
        foreach ($order_array as $order_a){

            fputcsv($file, [
                $order_a['order_number'],
                $order_a['shipping_name'],
                $order_a['email'],
                $order_a['financial_status'],
//                $order->user_name,
            ]);
        }

        fclose($file);

        return response()->json([
            'success' => true,
            'name'=>$name,
            'message'=>'Export Successfully',
            'link' => asset($name),
        ]);
    }

    public function OrderFilter(Request $request)
    {

        $user=auth()->user();

        $order_array=array();

        $order_sellers=OrderSeller::where('user_id',$user->id)->orderBy('id','Desc')->get();

        foreach ($order_sellers as $order_seller){
//            if($request->status==0) {
//                $order = Order::find($order_seller->order_id);
//            }
//            else if($request->status==1) {
//                $order = Order::where('financial_status','paid')->where('id', $order_seller->order_id)->first();
//            }
//            else if($request->status==2){
//                $order = Order::where('financial_status','pending')->where('id', $order_seller->order_id)->first();
//            }

            if ($request->seller == 'all') {
                $order = Order::query();
            } else if ($request->seller == 'paid') {
                $order = Order::where('financial_status', 'paid');
            } else if ($request->seller == 'unpaid') {
                $order = Order::where('financial_status', 'unpaid');
            }else{
                $order = Order::query();
            }

            if($request->status==0) {
                $order = $order->where('id',$order_seller->order_id);
            }else if($request->status==1){
                $order = $order->whereNull('fulfillment_status')->where('id', $order_seller->order_id);
            }else if($request->status==2){
                $order = $order->where('fulfillment_status','partial')->where('id', $order_seller->order_id);
            }
            else if($request->status==3){
                $order = $order->where('fulfillment_status','fulfilled')->where('id', $order_seller->order_id);
            }

            if($request->value){
                $order=$order->where('order_number', 'like', '%' . $request->value . '%')->first();
            }
            else{
                $order=$order->first();
            }



            if($order) {
                $data['id'] = $order->id;
                $data['order_number'] = $order->order_number;
                $data['financial_status'] = $order->financial_status;
                $data['fulfillment_status'] = $order->fulfillment_status;
                $data['created_at'] = $order->created_at;
                $data['cancelled_at']=$order->cancelled_at;
                array_push($order_array, $data);
            }
        }
                $data = [
                    'orders' => $order_array
                ];
                return response()->json($data);



    }

    public function SearchOrders(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $order_array=array();

        $order_sellers=OrderSeller::where('user_id',$user->id)->orderBy('id','Desc')->get();

        foreach ($order_sellers as $order_seller){


            if ($request->seller == 'all') {
                $order = Order::query();
            } else if ($request->seller == 'paid') {
                $order = Order::where('financial_status', 'paid');
            } else if ($request->seller == 'unpaid') {
                $order = Order::where('financial_status', 'unpaid');
            }else{
                $order = Order::query();
            }



                if($request->status==0) {
                    $order=$order->where('order_number', 'like', '%' . $request->value . '%')->where('id',$order_seller->order_id)->first();

                }else if($request->status==1){
                    $order = $order->where('order_number', 'like', '%' . $request->value . '%')->whereNull('fulfillment_status')->where('id', $order_seller->order_id)->first();
                }else if($request->status==2){
                    $order = $order->where('order_number', 'like', '%' . $request->value . '%')->where('fulfillment_status','partial')->where('id', $order_seller->order_id)->first();
                }
                else if($request->status==3){
                    $order = $order->where('order_number', 'like', '%' . $request->value . '%')->where('fulfillment_status','fulfilled')->where('id', $order_seller->order_id)->first();
                }


            if($order) {
                //            $orders=Order::where('order_number', 'like', '%' . $request->value . '%')->where('user_id',$user->id)->get();
                $data['id'] = $order->id;
                $data['order_number'] = $order->order_number;
                $data['financial_status'] = $order->financial_status;
                $data['fulfillment_status'] = $order->fulfillment_status;
                $data['created_at'] = $order->created_at;
                $data['cancelled_at']=$order->cancelled_at;
                array_push($order_array, $data);
            }
        }

        $data = [
            'data' => $order_array
        ];
        return response()->json($data);
    }

    public function OrderFilterPayment(Request $request){

        $user=auth()->user();
        $shop=Session::where('id',$user->shop_id)->first();
        $order_array=array();

        $order_sellers=OrderSeller::where('user_id',$user->id)->orderBy('id','Desc')->get();

        foreach ($order_sellers as $order_seller) {


            if ($request->value == 'all') {
                $order = Order::query();
            } else if ($request->value == 'paid') {
                $order = Order::where('financial_status', 'paid');
            } else if ($request->value == 'unpaid') {
                $order = Order::where('financial_status', 'unpaid');
            }
            else if($request->value=='refunded'){
                $order = Order::where('financial_status','refunded');
            }

            if ($request->status == 1) {
                $order = $order->whereNull('fulfillment_status');
            } else if ($request->status == 2) {
                $order = $order->where('fulfillment_status', 'partial');
            } else if ($request->status == 3) {
                $order =$order->where('fulfillment_status', 'fulfilled');
            }

        if($request->order_value){
            $order = $order->where('order_number', 'like', '%' . $request->order_value . '%');
        }

            $order = $order->where('id', $order_seller->order_id)->first();

            if($order) {
                $data['id'] = $order->id;
                $data['order_number'] = $order->order_number;
                $data['financial_status'] = $order->financial_status;
                $data['fulfillment_status'] = $order->fulfillment_status;
                $data['created_at'] = $order->created_at;
                $data['cancelled_at']=$order->cancelled_at;
                array_push($order_array, $data);
            }


        }
        $data = [
            'orders' => $order_array
        ];
        return response()->json($data);
    }
}
