<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SendMail;
use App\Models\CommissionLog;
use App\Models\GlobalCommission;
use App\Models\LineItem;
use App\Models\log;
use App\Models\MailSmtpSetting;
use App\Models\Order;
use App\Models\OrderSeller;
use App\Models\Product;
use App\Models\SellerCommission;
use App\Models\Session;
use App\Models\Variant;
use http\Client\Curl\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Mail;
use Shopify\Clients\Rest;

class OrderController extends Controller
{
    public function Orders(Request $request)
    {
        $user = auth()->user();
        $shop = Session::where('shop', $user->name)->first();
        $orders = Order::where('shop_id', $shop->id)->orderBy('order_number','Desc')->paginate(20);
        return response()->json($orders);
    }


    public function SyncOrder(Request $request, $next = null)
    {
        $user = auth()->user();
        $session = Session::where('shop', $user->name)->first();
        $shop = new Rest($session->shop, $session->access_token);
        $result = $shop->get('orders', [], ['limit' => 250]);
        $orders = $result->getDecodedBody();

        foreach ($orders['orders'] as $order) {
            $order = json_decode(json_encode($order));

            $this->singleOrder($order, $session->shop);
        }

        $data = [
            'message' => "Order Sync Successfully",
            'data' => $orders

        ];
        return response($data);
    }

    public function singleOrder($order, $shop)
    {

        $shop = Session::where('shop', $shop)->first();
//        if ($order->financial_status != 'refunded' && $order->cancelled_at == null) {


            $newOrder = Order::where('shopify_order_id',$order->id)->where('shop_id',$shop->id)->first();

            $flag=0;
            if ($newOrder == null) {
                $newOrder = new Order();
                $flag=1;
            }
//            else{
//                if ($order->financial_status != 'refunded' ||  $order->cancelled_at == null) {
//                $commission_get_logs=  CommissionLog::where('shopify_order_id',$order->id)->sum('total_payout');
//                  $user_get=\App\Models\User::find($newOrder->user_id);
//                if($user_get) {
//                    $user_get->total_commission = $user_get->total_commission - $commission_get_logs;
//                    $user_get->save();
//                }
//            }
//            }
            $newOrder->shopify_order_id = $order->id;
            $newOrder->email = $order->email;
            $newOrder->order_number = $order->name;
            if (isset($order->shipping_address)) {
                $newOrder->shipping_name = $order->shipping_address->name;
                $newOrder->address1 = $order->shipping_address->address1;
                $newOrder->address2 = $order->shipping_address->address2;
                $newOrder->phone = $order->shipping_address->phone;
                $newOrder->city = $order->shipping_address->city;
                $newOrder->zip = $order->shipping_address->zip;
                $newOrder->province = $order->shipping_address->province;
                $newOrder->country = $order->shipping_address->country;
            }

            if (isset($order->billing_address)) {
                $newOrder->billing_shipping_name = $order->billing_address->name;
                $newOrder->billing_address1 = $order->billing_address->address1;
                $newOrder->billing_address2 = $order->billing_address->address2;
                $newOrder->billing_phone = $order->billing_address->phone;
                $newOrder->billing_city = $order->billing_address->city;
                $newOrder->billing_zip = $order->billing_address->zip;
                $newOrder->billing_province = $order->billing_address->province;
                $newOrder->billing_country = $order->billing_address->country;
            }

            $newOrder->financial_status = $order->financial_status;
            $newOrder->fulfillment_status = $order->fulfillment_status;
            if (isset($order->customer)) {
                $newOrder->first_name = $order->customer->first_name;
                $newOrder->last_name = $order->customer->last_name;
                $newOrder->customer_phone = $order->customer->phone;
                $newOrder->customer_email = $order->customer->email;
                $newOrder->customer_id = $order->customer->id;
            }
            $newOrder->shopify_created_at = date_create($order->created_at)->format('Y-m-d h:i:s');
            $newOrder->shopify_updated_at = date_create($order->updated_at)->format('Y-m-d h:i:s');
            $newOrder->tags = $order->tags;
            $newOrder->note = $order->note;
        if ($order->total_price > 0) {
            $total_price = $order->current_total_price;
        } else {
            $total_price = $order->total_price;
        }
        $newOrder->total_price = $total_price;
            $newOrder->currency = $order->currency;

        if ($order->current_subtotal_price > 0) {
            $sub_total_price = $order->current_subtotal_price;
        } else {
            $sub_total_price = $order->subtotal_price;
        }
        $newOrder->subtotal_price = $sub_total_price;

            $newOrder->total_weight = $order->total_weight;
            $newOrder->taxes_included = $order->taxes_included;
            $newOrder->total_tax = $order->total_tax;
            $newOrder->currency = $order->currency;
            $newOrder->total_discounts = $order->total_discounts;
            $newOrder->gateway=(count($order->payment_gateway_names) > 0)?$order->payment_gateway_names[0]:null;
            $newOrder->shop_id = $shop->id;
            $newOrder->save();

            $unique_user_array=array();

            foreach ($order->line_items as $item) {
//                if (!in_array($item->id, $refund_line_items)) {
            $quantity=$item->quantity;
                if (($order->refunds)) {
                    foreach ($order->refunds as $refund_odr) {
                        foreach ($refund_odr->refund_line_items as $refund_item) {
                            if($refund_item->line_item_id==$item->id){
                                $quantity= $quantity- $refund_item->quantity;
                            }
                        }
                    }
                }
                    if($quantity > 0) {
                        $new_line = LineItem::where('lineitem_id', $item->id)->where('order_id', $newOrder->id)->where('shop_id', $shop->id)->first();
                        if ($new_line == null) {
                            $new_line = new Lineitem();
                        }
                        $new_line->shopify_product_id = $item->product_id;
                        $new_line->shopify_variant_id = $item->variant_id;
                        $new_line->lineitem_id = $item->id;
                        $new_line->title = $item->title;
                        $new_line->quantity = $quantity;
                        $new_line->sku = $item->sku;
                        $new_line->variant_title = $item->variant_title;
                        $new_line->title = $item->title;
                        $new_line->vendor = $item->vendor;
                        $new_line->price = $item->price;
                        $new_line->requires_shipping = $item->requires_shipping;
                        $new_line->taxable = $item->taxable;
                        $new_line->name = $item->name;
                        $new_line->properties = json_encode($item->properties, true);
                        $new_line->fulfillable_quantity = $item->fulfillable_quantity;
                        $new_line->fulfillment_status = $item->fulfillment_status;
                        $new_line->order_id = $newOrder->id;
                        $new_line->shop_id = $shop->id;
                        $new_line->shopify_order_id = $order->id;
                        $new_line->save();


                        $product = Product::where('shopify_id', $item->product_id)->where('shop_id', $shop->id)->first();

                        if ($product) {

                            $new_line->user_id = $product->user_id;
                            $new_line->save();

//                    if($flag==1) {

//                            $variant = Variant::where('shopify_product_id', $item->product_id)->where('shopify_id', $item->variant_id)->where('shop_id', $shop->id)->first();
//                            if ($variant) {
//                                $variant->quantity = $variant->quantity - $item->quantity;
//                                $variant->save();
//                            }
//                    }
//                   $product->quantity=$product->quantity -$item->quantity;
//                   $product->save();
                            $user = \App\Models\User::find($product->user_id);


                            if ($user) {
                                array_push($unique_user_array, $user->id);
                                $seller_commission = SellerCommission::where('user_id', $user->id)->where('shop_id', $shop->id)->first();

                                if ($product->vape_seller == "Yes") {

                                    $item_price = $item->price * $item->quantity;
                                    $excise_tax = $product->excise_tax * $item->quantity;
                                    $amount_without_excise_tax = $item_price - $excise_tax;

                                    if ($seller_commission) {

                                        if ($seller_commission->commission_type == '%') {

                                            $unit_payout_subtract = 1 - ($seller_commission->first_commission / 100);
                                            $unit_payout_subtract_excise = $item->price - $product->excise_tax;
                                            $unit_payout = $unit_payout_subtract_excise * $unit_payout_subtract;
                                            $unit_payout = $unit_payout + $product->excise_tax;

                                            $sub_total_payout = $unit_payout * $item->quantity;

                                            if ($user->taxPayingSeller && $user->taxPayingSeller == 'Yes') {
                                                $sub_total_payout_tax = $sub_total_payout * ($user->tax / 100);
                                                $total_payout = $sub_total_payout + $sub_total_payout_tax;
                                            } else {
                                                $sub_total_payout_tax = $sub_total_payout * 0;
                                                $total_payout = $sub_total_payout + 0;
                                            }


                                            $unit_product_commission = $item->price - $product->excise_tax;
                                            $unit_product_commission = $unit_product_commission * ($seller_commission->first_commission / 100);
                                            $unit_product_commission = $unit_product_commission + $product->excise_tax;


                                            $commission = $amount_without_excise_tax * ($seller_commission->first_commission / 100);
                                            $total_commission = $commission + $excise_tax;
                                        } else if ($seller_commission->commission_type == 'fixed') {
                                            $unit_product_commission = $seller_commission->first_commission;
                                            $total_commission = $seller_commission->first_commission * $item->quantity;
                                        }
                                    } else {
                                        $global_commission = GlobalCommission::where('shop_id', $shop->id)->first();
                                        if ($global_commission) {
                                            if ($global_commission->commission_type == '%') {

                                                $unit_payout_subtract = 1 - ($global_commission->global_commission / 100);
                                                $unit_payout_subtract_excise = $item->price - $product->excise_tax;
                                                $unit_payout = $unit_payout_subtract_excise * $unit_payout_subtract;
                                                $unit_payout = $unit_payout + $product->excise_tax;

                                                $sub_total_payout = $unit_payout * $item->quantity;

                                                if ($user->taxPayingSeller && $user->taxPayingSeller == 'Yes') {
                                                    $sub_total_payout_tax = $sub_total_payout * ($user->tax / 100);
                                                    $total_payout = $sub_total_payout + $sub_total_payout_tax;
                                                } else {
                                                    $sub_total_payout_tax = $sub_total_payout * 0;
                                                    $total_payout = $sub_total_payout + 0;
                                                }


                                                $unit_product_commission = $item->price - $product->excise_tax;
                                                $unit_product_commission = $unit_product_commission * ($global_commission->global_commission / 100);
                                                $unit_product_commission = $unit_product_commission + $product->excise_tax;

                                                $commission = $amount_without_excise_tax * ($global_commission->global_commission / 100);
                                                $total_commission = $commission + $excise_tax;

                                            } else if ($global_commission->commission_type == 'fixed') {
                                                $unit_product_commission = $global_commission->global_commission;
                                                $total_commission = $global_commission->global_commission * $item->quantity;
                                            }

                                        }

                                    }
                                    $admin_earning = $item_price - $total_commission;
                                } else {
                                    if ($seller_commission) {
                                        if ($seller_commission->commission_type == '%') {

                                            $unit_payout = 1 - ($seller_commission->first_commission / 100);
                                            $unit_payout = $item->price * $unit_payout;

                                            $sub_total_payout = $unit_payout * $item->quantity;

                                            if ($user->taxPayingSeller && $user->taxPayingSeller == 'Yes') {
                                                $sub_total_payout_tax = $sub_total_payout * ($user->tax / 100);
                                                $total_payout = $sub_total_payout + $sub_total_payout_tax;
                                            } else {
                                                $sub_total_payout_tax = $sub_total_payout * 0;
                                                $total_payout = $sub_total_payout + 0;
                                            }

                                            $commission = ($seller_commission->first_commission / 100) * $item->price;
                                            $total_commission = $commission * $item->quantity;
                                        } else if ($seller_commission->commission_type == 'fixed') {
                                            $commission = $seller_commission->first_commission;
                                            $total_commission = $seller_commission->first_commission * $item->quantity;
                                        }

                                    } else {
                                        $global_commission = GlobalCommission::where('shop_id', $shop->id)->first();
                                        if ($global_commission) {
                                            if ($global_commission->commission_type == '%') {

                                                $unit_payout = 1 - ($global_commission->global_commission / 100);
                                                $unit_payout = $item->price * $unit_payout;

                                                $sub_total_payout = $unit_payout * $item->quantity;

                                                if ($user->taxPayingSeller && $user->taxPayingSeller == 'Yes') {
                                                    $sub_total_payout_tax = $sub_total_payout * ($user->tax / 100);
                                                    $total_payout = $sub_total_payout + $sub_total_payout_tax;
                                                } else {
                                                    $sub_total_payout_tax = $sub_total_payout * 0;
                                                    $total_payout = $sub_total_payout + 0;
                                                }


                                                $commission = ($global_commission->global_commission / 100) * $item->price;
                                                $total_commission = $commission * $item->quantity;

                                            } else if ($global_commission->commission_type == 'fixed') {
                                                $commission = $global_commission->global_commission;
                                                $total_commission = $global_commission->global_commission * $item->quantity;
                                            }

                                        }

                                    }

                                    $admin_earning = ($item->price * $item->quantity) - $total_commission;
                                }

                                $newOrder->user_id = $user->id;
                                $newOrder->user_name = $user->name;
                                $newOrder->user_email = $user->email;
                                $newOrder->seller_shopname = $user->seller_shopname;
                                $newOrder->save();

//                        if ($flag == 1) {

                                $commission_log = CommissionLog::where('shopify_order_id', $order->id)->where('shopify_line_item_id', $item->id)->first();
                                if ($commission_log == null) {
                                    $commission_log = new CommissionLog();
                                }
//                            $user->total_commission = $user->total_commission + $total_commission;
                                $user->total_commission = $user->total_commission + $total_payout;
                                $user->save();

                                $commission_log->user_id = $user->id;
                                $commission_log->seller_name = $user->name;
                                $commission_log->seller_email = $user->email;
                                $commission_log->order_id = $newOrder->id;
                                if ($product->vape_seller == "Yes") {
                                    $commission_log->commission = $unit_product_commission;
                                } else {
                                    $commission_log->commission = $commission;
                                }
                                $commission_log->shopify_product_id = $item->product_id;
                                $commission_log->shopify_order_id = $order->id;
                                $commission_log->shopify_line_item_id = $item->id;
                                $commission_log->shopify_variant_id = $item->variant_id;
                                $commission_log->product_name = $new_line->title;
                                $commission_log->quantity = $new_line->quantity;
                                $commission_log->price = $new_line->price;

                                if ($product->vape_seller == "Yes") {
                                    $commission_log->unit_product_commission = $unit_product_commission;
                                } else {
                                    $commission_log->unit_product_commission = $commission;
                                }
                                $commission_log->total_admin_earning = $admin_earning;
                                $commission_log->total_product_commission = $total_commission;
                                $commission_log->unit_payout = $unit_payout;
                                $commission_log->sub_total_payout = $sub_total_payout;
                                $commission_log->sub_total_payout_tax = $sub_total_payout_tax;
                                $commission_log->total_payout = $total_payout;
                                $commission_log->shop_id = $shop->id;
                                $commission_log->save();

//                        }
                            }

                        }

                    }
                    else{
                    LineItem::where('lineitem_id',$item->id)->where('shopify_order_id',$order->id)->delete();
                    CommissionLog::where('shopify_line_item_id',$item->id)->where('shopify_order_id',$order->id)->delete();
                }

//                }else{
//                    LineItem::where('lineitem_id',$item->id)->where('shopify_order_id',$order->id)->delete();
//                    CommissionLog::where('shopify_line_item_id',$item->id)->where('shopify_order_id',$order->id)->delete();
//                }
            }




            if($flag==1) {
                $unique_records =array_unique($unique_user_array);
                foreach ($unique_records as $unique_record) {

                    $order_seller = new OrderSeller();
                    $order_seller->order_id = $newOrder->id;
                    $order_seller->user_id = $unique_record;
                    $order_seller->save();

                    $get_line_items=LineItem::where('order_id',$newOrder->id)->where('user_id',$unique_record)->get();
                     $message='';
                      $message_record_array=array();
                     foreach ($get_line_items as $get_line_item){
//                          $message=$message."Product: ".$get_line_item['title'].' of Quantity: '.$get_line_item['quantity'].',';
                         $data['product_name']=$get_line_item['title'];
                         $data['quantity']=$get_line_item['quantity'];
                         $data['sku']=$get_line_item['sku'];
                         array_push($message_record_array,$data);
                      }

//                      $this->OrderMail($unique_record,$message_record_array);

                }


            }
//        }

        if ($order->financial_status == 'refunded' ||  $order->cancelled_at != null) {
            $commission_get_logs=  CommissionLog::where('shopify_order_id',$order->id)->sum('total_payout');
//            $user->total_commission = $user->total_commission - $commission_get_logs;
//            $user->save();
            CommissionLog::where('shopify_order_id',$order->id)->delete();
            $log=new log();
            $log->log='ewe';
            $log->verify='3232';
            $log->save();

            $log=new log();
            $log->log='abc'.$order->user_id;
            $log->verify=json_encode($order);
            $log->save();
            try {
                $this->OrderCancelMail($newOrder->user_id,$order);
//                $newOrder->delete();
            }
            catch (\Exception $exception){

            }


        }


    }

    public function OrderFilter(Request $request)
    {

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if ($shop) {
            if($request->status==0) {
                $orders = Order::query();
            }else if($request->status==1){
                $orders = Order::whereNull('fulfillment_status');
            }else if($request->status==2){
                $orders = Order::where('fulfillment_status','partial');
            }
            else if($request->status==3){
                $orders = Order::where('fulfillment_status','fulfilled');
            }

            if($request->seller!='undefined'){
                if($request->seller!='all') {
                    $orders = $orders->where('financial_status', $request->seller);
                }
            }
            if($request->value!=null){
                $orders=$orders->where('order_number', 'like', '%' . '#'.$request->value . '%');
            }

            $orders=$orders->where('shop_id', $shop->id)->orderBy('id','Desc')->get();
            if (count($orders) > 0) {
                $data = [
                    'orders' => $orders
                ];
                return response()->json($data);
            }
        }

    }

        public function ViewOrder(Request $request,$id){
            $user=auth()->user();
            $session=Session::where('shop',$user->name)->first();

            $order=Order::find($id);

            $date = Date::createFromFormat('Y-m-d H:i:s', $order->created_at);
            $date = $date->format('F j, Y \a\t g:i a');

            $order_commission=CommissionLog::where('order_id',$id)->sum('total_product_commission');
            $admin_earning=CommissionLog::where('order_id',$id)->sum('total_admin_earning');

            $line_items=LineItem::where('shopify_order_id',$order->shopify_order_id)->get();

            $order_sellers=OrderSeller::where('order_id',$order->id)->get();
            $order_seller_array=array();
            foreach ($order_sellers as $order_seller){
            $user_data=\App\Models\User::find($order_seller->user_id);
                $order_seller_data['name']=$user_data->name;
                $order_seller_data['email']=$user_data->email;
                $order_seller_data['seller_shopname']=$user_data->seller_shopname;
                array_push($order_seller_array,$order_seller_data);
            }

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
              'admin_earning'=>(string)((float)$admin_earning),
                'line_items'=>$line_item_data,
                'date'=>$date,
                'total_items'=>$total_items,
                'order_sellers'=>$order_seller_array,
                  'currency'=>$session->money_format,
            ];
            return response()->json($data);

        }

        public function ExportOrder(Request $request){
            $user=auth()->user();
            $shop=Session::where('shop',$user->name)->first();
            $orders=Order::where('shop_id',$shop->id)->get();

            $name = 'Order-' . time() . '.csv';
            $file = fopen(public_path($name), 'w+');

            // Add the CSV headers
            fputcsv($file, ['Order Number','Shipping Name', 'Email','Financial Status','Seller Name']);
            foreach ($orders as $order){

                fputcsv($file, [
                    $order->order_number,
                    $order->shipping_name,
                    $order->email,
                    $order->financial_status,
                    $order->user_name,
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


        public function SearchOrder(Request $request){


            $user=auth()->user();
            $session=Session::where('shop',$user->name)->first();

            if($request->status==0) {
                $orders = Order::query();
            }else if($request->status==1){
                $orders = Order::whereNull('fulfillment_status');
            }else if($request->status==2){
                $orders = Order::where('fulfillment_status','partial');
            }
            else if($request->status==3){
                $orders = Order::where('fulfillment_status','fulfilled');
            }
            if($request->value!=null) {
                $orders = $orders->where('order_number', 'like', '%' . $request->value . '%');
            }
            if($request->seller!='undefined'){
                if($request->seller!='all'){
                    $orders = $orders->where('financial_status', $request->seller);
                }
            }
$orders=$orders->where('shop_id', $session->id)->orderBy('id', 'Desc')->get();
            $data = [
                'data' => $orders
            ];
            return response()->json($data);
        }

public function OrderFilterPayment(Request $request){

    $user=auth()->user();
    $shop=Session::where('shop',$user->name)->first();
    if ($shop) {


        if($request->value=='all') {
            $orders = Order::query();
        }else if($request->value=='paid'){
            $orders = Order::where('financial_status','paid');
        }else if($request->value=='unpaid'){
            $orders = Order::where('financial_status','unpaid');
        }

        else if($request->value=='refunded'){
            $orders = Order::where('financial_status','refunded');
        }


        if($request->status==1){
            $orders = Order::whereNull('fulfillment_status');
        }else if($request->status==2){
            $orders = Order::where('fulfillment_status','partial');
        }
        else if($request->status==3){
            $orders = Order::where('fulfillment_status','fulfilled');
        }
        if($request->order_value!=null) {
            $orders = $orders->where('order_number', 'like', '%' . $request->order_value . '%');
        }


$orders=$orders->where('shop_id', $shop->id)->orderBy('id', 'Desc')->get();

        if (count($orders) > 0) {
            $data = [
                'orders' => $orders
            ];
            return response()->json($data);
        }
    }
}


        public function OrderMail($user_id,$message){

        $user=\App\Models\User::find($user_id);
        $session=Session::find($user->shop_id);
        $type="Order Message";
            $Setting = MailSmtpSetting::where('shop_id', $user->shop_id)->first();
            $details['to'] = $user->email;
            $details['name'] = $user->name;
            $details['subject'] = 'OneWholesale';
            $details['message'] = $message;
            $details['shop_name'] =$session->shop ;
            $details['shop_id'] =$session->id ;
            Mail::to($user->email)->send(new SendMail($details, $Setting,$type));
        }

    public function OrderCancelMail($user_id,$order){

        $user=\App\Models\User::find($user_id);

        $log=new log();
        $log->log='cancel';
        $log->verify='yes';
        $log->save();
        $log=new log();
        $log->log=$user->id;
        $log->verify=$order->order_number;
        $log->save();
        $session=Session::find($user->shop_id);
        $type="Order Cancel";
        $Setting = MailSmtpSetting::where('shop_id', $user->shop_id)->first();
        $details['to'] = $user->email;
        $details['name'] = $user->name;
        $details['order_number'] = $order->order_number;
        $details['subject'] = 'OneWholesale';
        $details['shop_name'] =$session->shop ;
        $details['shop_id'] =$session->id ;
        Mail::to($user->email)->send(new SendMail($details, $Setting,$type));
    }

}
