<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\LineItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class OrderController extends Controller
{
    public function Orders(Request $request){
        $user=auth()->user();
        $user=User::find($user->id);
        if($user){
            $orders=Order::where('user_id',$user->id)->get();
            $data = [
                'orders'=>$orders
            ];
            return response()->json($data);
        }
    }

    public function ViewOrder(Request $request,$id){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();

        $order=Order::find($id);

        $date = Date::createFromFormat('Y-m-d H:i:s', $order->created_at);
        $date = $date->format('F j, Y \a\t g:i a');

        $order_commission=CommissionLog::where('order_id',$id)->sum('total_product_commission');

        $line_items=LineItem::where('shopify_order_id',$order->shopify_order_id)->get();
        $line_item_array=array();
        $line_item_data=array();
        $total_items=0;
        foreach ($line_items as $line_item){
            $total_items+=$line_item->quantity;
            $product=Product::where('shopify_id',$line_item->shopify_product_id)->first();
            $line_item_array['id']=$line_item->id;
            $line_item_array['title']=$line_item->title;
            $line_item_array['quantity']=$line_item->quantity;
            $line_item_array['price']=$line_item->price;
            $line_item_array['image']=$product->featured_image;
            array_push($line_item_data,$line_item_array);
        }

        $data=[
            'order'=>$order,
            'order_commission'=>(string)((float)$order_commission),
            'line_items'=>$line_item_data,
            'date'=>$date,
            'total_items'=>$total_items
        ];
        return response()->json($data);

    }

    public function ExportOrder(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $orders=Order::where('user_id',$user->id)->get();

        $name = 'Order-' . time() . '.csv';
        $file = fopen(public_path($name), 'w+');

        // Add the CSV headers
        fputcsv($file, ['Order Number','Shipping Name', 'Email','Financial Status']);
        foreach ($orders as $order){

            fputcsv($file, [
                $order->order_number,
                $order->shipping_name,
                $order->email,
                $order->financial_status,
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
        $shop=Session::where('shop',$user->name)->first();
        if ($shop) {
            if($request->status==0) {
                $orders = Order::where('financial_status', $request->status)->where('user', $user->id)->get();
            }else if($request->status==1){
                $orders = Order::where('financial_status','paid')->where('user', $user->id)->get();
            }else if($request->status==2){
                $orders = Order::where('financial_status','pending')->where('user', $user->id)->get();
            }
            if (count($orders) > 0) {
                $data = [
                    'orders' => $orders
                ];
                return response()->json($data);
            }
        }

    }
}
