<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\ShopPageSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Shopify\Clients\Rest;

class ShopController extends Controller
{
    public function ShopSetting(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {
            $shop_setting = ShopPageSetting::where('shop_id', $shop->id)->first();

        }else{
            return response()->json([
                'message' => 'Shop Not Found',
            ],422);
        }
        return response()->json($shop_setting);
    }

    public function ShopSettingSave(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $client = new Rest($session->shop, $session->access_token);
        $shop_page_setting=ShopPageSetting::where('shop_id',$session->id)->first();
        if($shop_page_setting==null){
            $shop_page_setting=new ShopPageSetting();
        }
        $shop_page_setting->sold_by_label=$request->sold_by_label;
        $shop_page_setting->seller_name_label=$request->seller_name_label;
        $shop_page_setting->total_products_label=$request->total_products_label;
        $shop_page_setting->total_sale_label=$request->total_sale_label;
        $shop_page_setting->join_since_label=$request->join_since_label;
        $shop_page_setting->contact_label=$request->contact_label;
        $shop_page_setting->seller_products_label=$request->seller_products_label;
        $shop_page_setting->all_review_label=$request->all_review_label;
        $shop_page_setting->feedback_label=$request->feedback_label;
        $shop_page_setting->policy_label=$request->policy_label;
        $shop_page_setting->description_label=$request->description_label;
        $shop_page_setting->search_label=$request->search_label;
        $shop_page_setting->not_available_label=$request->not_available_label;
        $shop_page_setting->sort_by_label=$request->sort_by_label;
        $shop_page_setting->name_ascending_label=$request->name_ascending_label;
        $shop_page_setting->name_decending_label=$request->name_decending_label;
        $shop_page_setting->date_ascending_label=$request->date_ascending_label;
        $shop_page_setting->date_decending_label=$request->date_decending_label;
        $shop_page_setting->price_ascending_label=$request->price_ascending_label;
        $shop_page_setting->price_decending_label=$request->price_decending_label;
        $shop_page_setting->show_label=$request->show_label;
        $shop_page_setting->only_store_pickup_label=$request->only_store_pickup_label;
        $shop_page_setting->store_pickup_deliivery_label=$request->store_pickup_deliivery_label;
        $shop_page_setting->closed_store_label=$request->closed_store_label;
        $shop_page_setting->open_store_label=$request->open_store_label;
        $shop_page_setting->rating_label=$request->rating_label;
        $shop_page_setting->name_label=$request->name_label;
        $shop_page_setting->email_label=$request->email_label;
        $shop_page_setting->feedback_summary_label=$request->feedback_summary_label;
        $shop_page_setting->sumbit_label=$request->sumbit_label;
        $shop_page_setting->view_all_label=$request->view_all_label;
        $shop_page_setting->feedback_submitted_approval_label=$request->feedback_submitted_approval_label;
        $shop_page_setting->category_label=$request->category_label;
        $shop_page_setting->type_label=$request->type_label;
        $shop_page_setting->tag_label=$request->tag_label;
        $shop_page_setting->shop_id=$session->id;
        $shop_page_setting->save();

        $shop_setting=array();

        $shop_setting['sold_by_label']=$shop_page_setting->sold_by_label;
        $shop_setting['seller_name_label']=$shop_page_setting->seller_name_label;
        $shop_setting['total_products_label']=$shop_page_setting->total_products_label;
        $shop_setting['total_sale_label']=$shop_page_setting->total_sale_label;
        $shop_setting['join_since_label']=$shop_page_setting->join_since_label;
        $shop_setting['contact_label']=$shop_page_setting->contact_label;
        $shop_setting['seller_products_label']=$shop_page_setting->seller_products_label;
        $shop_setting['all_review_label']=$shop_page_setting->all_review_label;
        $shop_setting['feedback_label']=$shop_page_setting->feedback_label;
        $shop_setting['policy_label']=$shop_page_setting->policy_label;
        $shop_setting['description_label']=$shop_page_setting->description_label;
        $shop_setting['search_label']=$shop_page_setting->search_label;
        $shop_setting['not_available_label']=$shop_page_setting->not_available_label;
        $shop_setting['sort_by_label']=$shop_page_setting->sort_by_label;
        $shop_setting['name_ascending_label']=$shop_page_setting->name_ascending_label;
        $shop_setting['name_decending_label']=$shop_page_setting->name_decending_label;
        $shop_setting['date_ascending_label']=$shop_page_setting->date_ascending_label;
        $shop_setting['date_decending_label']=$shop_page_setting->date_decending_label;
        $shop_setting['price_ascending_label']=$shop_page_setting->price_ascending_label;
        $shop_setting['price_decending_label']=$shop_page_setting->price_decending_label;
        $shop_setting['show_label']=$shop_page_setting->show_label;
        $shop_setting['only_store_pickup_label']=$shop_page_setting->only_store_pickup_label;
        $shop_setting['store_pickup_deliivery_label']=$shop_page_setting->store_pickup_deliivery_label;
        $shop_setting['closed_store_label']=$shop_page_setting->closed_store_label;
        $shop_setting['open_store_label']=$shop_page_setting->open_store_label;
        $shop_setting['rating_label']=$shop_page_setting->rating_label;
        $shop_setting['name_label']=$shop_page_setting->name_label;
        $shop_setting['sumbit_label']=$shop_page_setting->sumbit_label;
        $shop_setting['view_all_label']=$shop_page_setting->view_all_label;
        $shop_setting['feedback_submitted_approval_label']=$shop_page_setting->feedback_submitted_approval_label;
        $shop_setting['category_label']=$shop_page_setting->category_label;
        $shop_setting['type_label']=$shop_page_setting->type_label;
        $shop_setting['tag_label']=$shop_page_setting->tag_label;
        $shop_setting['email_label']=$shop_page_setting->email_label;
        $shop_setting['feedback_summary_label']=$shop_page_setting->feedback_summary_label;

        if($shop_page_setting->metafield_id==null) {
            $shop_metafield = $client->post('/metafields.json', [
                "metafield" => array(
                    "key" => 'setting',
                    "value" => json_encode($shop_setting),
                    "type" => "json_string",
                    "namespace" => "onewholesale"
                )
            ]);
            $res = $shop_metafield->getDecodedBody();
            $shop_page_setting->metafield_id=$res['metafield']['id'];
            $shop_page_setting->save();

        }
        else{

            $shop_metafield = $client->put('/metafields/' . $shop_page_setting->metafield_id . '.json', [
                "metafield" => [
                    "value" => json_encode($shop_setting)
                ]
            ]);

            $res = $shop_metafield->getDecodedBody();
            $shop_page_setting->metafield_id=$res['metafield']['id'];
            $shop_page_setting->save();
        }


        $data = [
            'message' => 'Shop Page Setting Added Successfully',
            'shop_page_setting'=>$shop_page_setting
        ];
        return response()->json($data);
    }


    public function ResetDefault(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $client = new Rest($session->shop, $session->access_token);
        $shop_page_setting=ShopPageSetting::where('shop_id',$session->id)->first();
        if($shop_page_setting==null){
            $shop_page_setting=new ShopPageSetting();
        }
        $shop_page_setting->sold_by_label='Sold By';
        $shop_page_setting->seller_name_label='Seller Name';
        $shop_page_setting->total_products_label='Total Products';
        $shop_page_setting->total_sale_label='Total Sale';
        $shop_page_setting->join_since_label='Joined Since';
        $shop_page_setting->contact_label='Contact';
        $shop_page_setting->seller_products_label='Seller Products';
        $shop_page_setting->all_review_label='All Reviews';
        $shop_page_setting->feedback_label='Feedback';
        $shop_page_setting->policy_label='Policy';
        $shop_page_setting->description_label='Description';
        $shop_page_setting->search_label='Search';
        $shop_page_setting->not_available_label='Not Available';
        $shop_page_setting->sort_by_label='Sort by';
        $shop_page_setting->name_ascending_label='Name Ascending';
        $shop_page_setting->name_decending_label='Name Descending';
        $shop_page_setting->date_ascending_label='Date Ascending';
        $shop_page_setting->date_decending_label='Date Descending';
        $shop_page_setting->price_ascending_label='Price Ascending';
        $shop_page_setting->price_decending_label='Price Descending';
        $shop_page_setting->show_label='Show';
        $shop_page_setting->only_store_pickup_label='Only Store Pickup';
        $shop_page_setting->store_pickup_deliivery_label='Store pickup + Delivery';
        $shop_page_setting->closed_store_label='Closed stores';
        $shop_page_setting->open_store_label='Open stores';
        $shop_page_setting->rating_label='Rating';
        $shop_page_setting->name_label='Name';
        $shop_page_setting->sumbit_label='Submit';
        $shop_page_setting->view_all_label='View all';
        $shop_page_setting->feedback_submitted_approval_label='Feedback submitted for approval';
        $shop_page_setting->category_label='Category';
        $shop_page_setting->type_label='Type';
        $shop_page_setting->tag_label='Tag';
        $shop_page_setting->shop_id=$session->id;
        $shop_page_setting->save();

        $shop_setting=array();

        $shop_setting['sold_by_label']=$shop_page_setting->sold_by_label;
        $shop_setting['seller_name_label']=$shop_page_setting->seller_name_label;
        $shop_setting['total_products_label']=$shop_page_setting->total_products_label;
        $shop_setting['total_sale_label']=$shop_page_setting->total_sale_label;
        $shop_setting['join_since_label']=$shop_page_setting->join_since_label;
        $shop_setting['contact_label']=$shop_page_setting->contact_label;
        $shop_setting['seller_products_label']=$shop_page_setting->seller_products_label;
        $shop_setting['all_review_label']=$shop_page_setting->all_review_label;
        $shop_setting['feedback_label']=$shop_page_setting->feedback_label;
        $shop_setting['policy_label']=$shop_page_setting->policy_label;
        $shop_setting['description_label']=$shop_page_setting->description_label;
        $shop_setting['search_label']=$shop_page_setting->search_label;
        $shop_setting['not_available_label']=$shop_page_setting->not_available_label;
        $shop_setting['sort_by_label']=$shop_page_setting->sort_by_label;
        $shop_setting['name_ascending_label']=$shop_page_setting->name_ascending_label;
        $shop_setting['name_decending_label']=$shop_page_setting->name_decending_label;
        $shop_setting['date_ascending_label']=$shop_page_setting->date_ascending_label;
        $shop_setting['date_decending_label']=$shop_page_setting->date_decending_label;
        $shop_setting['price_ascending_label']=$shop_page_setting->price_ascending_label;
        $shop_setting['price_decending_label']=$shop_page_setting->price_decending_label;
        $shop_setting['show_label']=$shop_page_setting->show_label;
        $shop_setting['only_store_pickup_label']=$shop_page_setting->only_store_pickup_label;
        $shop_setting['store_pickup_deliivery_label']=$shop_page_setting->store_pickup_deliivery_label;
        $shop_setting['closed_store_label']=$shop_page_setting->closed_store_label;
        $shop_setting['open_store_label']=$shop_page_setting->open_store_label;
        $shop_setting['rating_label']=$shop_page_setting->rating_label;
        $shop_setting['name_label']=$shop_page_setting->name_label;
        $shop_setting['sumbit_label']=$shop_page_setting->sumbit_label;
        $shop_setting['view_all_label']=$shop_page_setting->view_all_label;
        $shop_setting['feedback_submitted_approval_label']=$shop_page_setting->feedback_submitted_approval_label;
        $shop_setting['category_label']=$shop_page_setting->category_label;
        $shop_setting['type_label']=$shop_page_setting->type_label;
        $shop_setting['tag_label']=$shop_page_setting->tag_label;
        $shop_setting['email_label']=$shop_page_setting->email_label;
        $shop_setting['feedback_summary_label']=$shop_page_setting->feedback_summary_label;

        if($shop_page_setting->metafield_id==null) {

            $shop_metafield = $client->post('/metafields.json', [
                "metafield" => array(
                    "key" => 'setting',
                    "value" => json_encode($shop_setting),
                    "type" => "json_string",
                    "namespace" => "onewholesale"
                )
            ]);
            $res = $shop_metafield->getDecodedBody();
            $shop_page_setting->metafield_id=$res['metafield']['id'];
            $shop_page_setting->save();

        }
        else{

            $shop_metafield = $client->put('/metafields/' . $shop_page_setting->metafield_id . '.json', [
                "metafield" => [
                    "value" => json_encode($shop_setting)
                ]
            ]);
            $res = $shop_metafield->getDecodedBody();
            $shop_page_setting->metafield_id=$res['metafield']['id'];
            $shop_page_setting->save();
        }


        $data = [
            'message' => 'Default Setting Saved Successfully',
            'shop_page_setting'=>$shop_page_setting
        ];
        return response()->json($data);
    }
}
