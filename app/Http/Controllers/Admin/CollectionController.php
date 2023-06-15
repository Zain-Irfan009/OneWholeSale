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
        return response()->json($collections);
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
}
