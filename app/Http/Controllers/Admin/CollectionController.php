<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Session;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;

class CollectionController extends Controller
{

    public function Collections(Request $request){
        $user = auth()->user();
        $session = Session::where('shop', $user->name)->first();
        $collections=Collection::where('shop_id',$session->id)->get();
        $data = [
            'data'=>$collections,
            'currency'=>$session->money_format,
        ];
        return response()->json($data);
    }
    public function SyncCollection(Request $request, $next = null){
//        $user = auth()->user();
//        $session = Session::where('shop', $user->name)->first();
        $session = Session::where('shop', 'onewholesalelive.myshopify.com')->first();
//        $session = Session::where('shop', 'tlx-new-brand.myshopify.com')->first();
        $shop = new Rest($session->shop, $session->access_token);
        $result = $shop->get('custom_collections', [], ['limit' => 250]);
        $collections = $result->getDecodedBody();

        foreach ($collections['custom_collections'] as $collection) {
            $collection = json_decode(json_encode($collection));
            $this->singleCollection($collection, $session->shop);
        }
        $data = [
            'message' => "Collection Sync Successfully",
            'data' => $collection

        ];
        return response($data);
    }

    public function singleCollection($collection, $shop)
    {
        $shop = Session::where('shop', $shop)->first();

            $new_collection = Collection::where('shopify_id', $collection->id)->where('shop_id', $shop->id)->first();
            if ($new_collection == null) {
                $new_collection = new Collection();
            }
        $new_collection->shopify_id = $collection->id;
            $new_collection->handle = $collection->handle;
            $new_collection->title = $collection->title;
            $new_collection->body_html = $collection->body_html;
            $new_collection->sort_order = $collection->sort_order;
//            $new_collection->products_count = $collection->products_count;
//            $new_collection->collection_type = $collection->collection_type;
            $new_collection->shop_id = $shop->id;
            $new_collection->save();




    }

    public function line_item_fulfilled(Request $request, $id)
    {
//        $shop = Session::first();

        $shop = Session::where('shop',$request['shop'])->first();

        $client = new Rest($shop->shop, $shop->access_token);
        $order = Order::where('user_id', $shop->id)->where('shopify_order_id', $request->shopify_order_id)->first();
//        $order = Order::where('shopify_order_id', $request['shopify_order_id'])->first();

//         fulfillment_order_id 5855135301801
        if (isset($order)) {
            $line_item_which_contains_fulfillment_lineitem_ids = $order->lineitems()->where('shopify_fulfillment_order_id', "!=", null)->get();

            if (isset($order->shopify_fulfillment_order_id) && !empty($line_item_which_contains_fulfillment_lineitem_ids)) {

                if (is_null($request['tracking_number'])) {
                    $data = [
                        "fulfillment" => [
                            "notify_customer"=>true,
                            "tracking_info" => [
                                "number" => null,
                                "company" => null
                            ],
                            "line_items_by_fulfillment_order" => [

                            ],

                        ]
                    ];
                } //6122438719
                else {
                    $data = [
                        "fulfillment" => [
                            "notify_customer"=>true,
                            "tracking_info" => [
                                "number" => $request['tracking_number'],
                                "company" => $request['shipping_carrier']
                            ],
                            "line_items_by_fulfillment_order" => [

                            ],

                        ]
                    ];
                }

                $line_item_ids = [];
                $fulfillment_line_item_ids = [];
                $quantity = [];

                if (gettype($request['line_items']) == 'string') {
                    $line_item_ids = explode(', ', $request['line_items']);
                    $quantity = explode(', ', $request['quantity']);
                } else {
                    $line_item_ids = $request['line_items'];
                    $quantity = $request['quantity'];
                }

                if (isset($order->shopify_fulfillment_order_id)) {

                    $fulfillment_order_line_items = [];

                    if (!empty($line_item_ids)) {

                        foreach ($line_item_ids as $index => $item) {

//                        $line_item = LineItem::where('user_id',$shop->id)->where('shopify_lineitem_id',$item)->first();
                            $line_item = LineItem::where('user_id', $shop->id)->where('shopify_lineitem_id', $item)->first();

                            if (isset($line_item) && $line_item->fulfillment_status != "fulfilled" && $quantity[$index] > 0) {
                                array_push($fulfillment_order_line_items, [
                                    "id" => $line_item->shopify_fulfillment_order_id,
                                    "quantity" => $quantity[$index],
                                ]);
                            }
                        }
                    }

                    if (!empty($fulfillment_order_line_items)) {
                        array_push($data['fulfillment']['line_items_by_fulfillment_order'], [
                            "fulfillment_order_id" => $order->shopify_fulfillment_order_id,
                            "fulfillment_order_line_items" => $fulfillment_order_line_items
                        ]);
//                    return response()->json($data);
                        $response = $client->post('/admin/api/2022-07/fulfillments.json', $data);
                        $fulfillment_api_response = $response->getDecodedBody();
                        if (isset($fulfillment_api_response['fulfillment']) && !empty($fulfillment_api_response['fulfillment'])) {
                            return response()->json([
                                'message' => 'Your order fulfillment request will be completed with in sometime!',
                                'status' => 'success',
                                'fulfillment_api_response:' => $fulfillment_api_response
                            ]);
                        } else {
                            return response()->json([
                                'message' => '1: Order fulfillment failed!',
                                'status' => 'error',
                                'fulfillment_api_response:' => $fulfillment_api_response
                            ]);
                        }


                    } else {
                        return response()->json([
                            'message' => '2: Order fulfillment failed!',
                            'status' => 'error'
                        ]);
                    }

                }

                return response()->json([
                    'message' => '3: Order fulfillment failed!',
                    'status' => 'error'
                ]);

            }
            return response()->json([
                'message' => '4: Order fulfillment failed!',
                'status' => 'error'
            ]);
        }

        return response()->json([
            'message' => 'Order fulfillment failed because order not found!',
            'status' => 'error'
        ]);

    }
}
