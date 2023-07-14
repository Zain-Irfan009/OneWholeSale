<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommissionLog;
use App\Models\GlobalCommission;
use App\Models\LineItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\SellerCommission;
use App\Models\Session;
use http\Client\Curl\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Shopify\Clients\Rest;

class OrderController extends Controller
{
    public function Orders(Request $request)
    {
        $user = auth()->user();
        $shop = Session::where('shop', $user->name)->first();
        $orders = Order::where('shop_id', $shop->id)->get();
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
        if ($order->financial_status != 'refunded' && $order->cancelled_at == null) {

            $newOrder = Order::where('shopify_order_id', $order->id)->where('shop_id', $shop->id)->first();

            $flag=0;
            if ($newOrder == null) {
                $newOrder = new Order();
                $flag=1;
            }
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
            $newOrder->total_price = $order->total_price;
            $newOrder->currency = $order->currency;

            $newOrder->subtotal_price = $order->subtotal_price;
            $newOrder->total_weight = $order->total_weight;
            $newOrder->taxes_included = $order->taxes_included;
            $newOrder->total_tax = $order->total_tax;
            $newOrder->currency = $order->currency;
            $newOrder->total_discounts = $order->total_discounts;
            $newOrder->gateway=$order->payment_gateway_names[0];
            $newOrder->shop_id = $shop->id;
            $newOrder->save();


            foreach ($order->line_items as $item) {

                $new_line = LineItem::where('lineitem_id', $item->id)->where('order_id', $newOrder->id)->where('shop_id', $shop->id)->first();
                if ($new_line == null) {
                    $new_line = new Lineitem();
                }
                $new_line->shopify_product_id = $item->product_id;
                $new_line->shopify_variant_id = $item->variant_id;
                $new_line->lineitem_id = $item->id;
                $new_line->title = $item->title;
                $new_line->quantity = $item->quantity;
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
                    $user = \App\Models\User::find($product->user_id);
                    if ($user) {
                        $seller_commission = SellerCommission::where('user_id', $user->id)->where('shop_id', $shop->id)->first();
                        if ($seller_commission) {
                            if ($seller_commission->commission_type == '%') {
                                $commission = ($seller_commission->first_commission / 100) * $item->price;
                                $total_commission = $commission * $item->quantity;
                            } else if ($seller_commission->commission_type == 'fixed') {
                                $total_commission = $seller_commission->first_commission * $item->quantity;
                            }

                        } else {
                            $global_commission = GlobalCommission::where('shop_id', $shop->id)->first();
                            if ($global_commission) {
                                if ($global_commission->commission_type == '%') {
                                    $commission = ($global_commission->global_commission / 100) * $item->price;
                                    $total_commission = $commission * $item->quantity;

                                } else if ($global_commission->commission_type == 'fixed') {
                                    $total_commission = $global_commission->global_commission * $item->quantity;
                                }

                            }

                        }

                        $admin_earning = ($item->price * $item->quantity) - $total_commission;


                        $newOrder->user_id = $user->id;
                        $newOrder->user_name = $user->name;
                        $newOrder->user_email = $user->email;
                        $newOrder->seller_shopname = $user->seller_shopname;
                        $newOrder->save();

                        if ($flag == 1) {
                            $commission_log = new CommissionLog();

                            $user->total_commission = $user->total_commission + $total_commission;
                            $user->save();

                            $commission_log->user_id = $user->id;
                            $commission_log->seller_name = $user->name;
                            $commission_log->order_id = $newOrder->id;
                            $commission_log->commission = $commission;
                            $commission_log->shopify_product_id = $item->product_id;
                            $commission_log->shopify_order_id = $order->id;
                            $commission_log->product_name = $new_line->title;
                            $commission_log->quantity = $new_line->quantity;
                            $commission_log->price = $new_line->price;
                            $commission_log->unit_product_commission = $commission;
                            $commission_log->total_admin_earning = $admin_earning;
                            $commission_log->total_product_commission = $total_commission;
                            $commission_log->shop_id = $shop->id;
                            $commission_log->save();

                        }
                    }

                }
            }
        }
    }

    public function OrderFilter(Request $request)
    {
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if ($shop) {
            if($request->status==0) {
                $orders = Order::where('financial_status', $request->status)->where('shop_id', $shop->id)->get();
            }else if($request->status==1){
                $orders = Order::where('financial_status','paid')->where('shop_id', $shop->id)->get();
            }else if($request->status==2){
                $orders = Order::where('financial_status','pending')->where('shop_id', $shop->id)->get();
            }
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
              'admin_earning'=>(string)((float)$admin_earning),
                'line_items'=>$line_item_data,
                'date'=>$date,
                'total_items'=>$total_items
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



}
