<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SendMail;
use App\Models\MailSmtpSetting;
use App\Models\Product;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Shopify\Clients\Rest;

class SellerController extends Controller
{
    public function Sellers(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        $sellers=User::where('shop_id',$shop->id)->where('role','seller')->get();

        return response()->json($sellers);
    }

    public function AddSeller(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $client = new Rest($shop->shop, $shop->access_token);
        $verify_email=User::where('email',$request->seller_email)->where('role','seller')->first();
        if($verify_email){
            $data = [
                'message' => 'Email already exists',
            ];
            return response()->json($data,422);
        }

        $validator = Validator::make($request->all(), [
            'password' => 'min:8|string|required_with:password_confirmation|same:password_confirmation',
            'password_confirmation' => 'min:8',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            $errors = $validator->errors();
            $errorString = implode(", ", $errors->all());


            return response()->json([
                'message' => $errorString,
            ],422);
        }


        $custom_collection = $client->post( '/custom_collections.json', [
            'custom_collection' => [
                'title' => $request->seller_name,
            ]
        ]);

        $custom_collection=$custom_collection->getDecodedBody();
        if (!isset($custom_collection['errors']['key'])) {
            $custom_collection=$custom_collection['custom_collection'];
            $custom_collection=json_decode(json_encode($custom_collection));

            $seller=new User();
            $seller->name=$request->seller_name;
            $seller->collection_id=$custom_collection->id;
            $seller->collection_handle=$custom_collection->handle;
            $seller->seller_shopname=$request->seller_shopname;
            $seller->email=$request->seller_email;
            $seller->seller_store_address=$request->seller_store_address;
            $seller->seller_zipcode=$request->seller_zipcode;
            $seller->seller_contact=$request->seller_contact;
            $seller->seller_store_description=$request->seller_store_description;
            $seller->seller_description=$request->seller_description;
            $seller->seller_policy=$request->seller_policy;
            $seller->seller_image=$request->seller_image;
            $seller->seller_shop_image=$request->seller_shop_image;
            $seller->password=Hash::make($request->password);
            $seller->role='seller';
            $seller->status=1;
            $seller->shop_id=$shop->id;
            $seller->save();
            $data = [
                'message' => 'Seller Added Successfully',
                'seller'=>$seller
            ];
            return response()->json($data);
        }
    }


    public function SellerView($id,Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        $seller=User::where('id',$id)->where('shop_id',$shop->id)->where('role','seller')->first();

        return response()->json($seller);
    }

    public function EditSeller(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $client = new Rest($shop->shop, $shop->access_token);
        if($shop) {
            $seller = User::where('id', $request->id)->where('role', 'seller')->first();
            $custom_collection = $client->put( '/custom_collections/'.$seller->collection_id.'.json', [
                'custom_collection' => [
                    'title' => $request->seller_name,
                ]
            ]);
            $custom_collection=$custom_collection->getDecodedBody();
            if (!isset($custom_collection['errors']['key'])) {
                $custom_collection = $custom_collection['custom_collection'];
                $custom_collection = json_decode(json_encode($custom_collection));

                $seller->name = $request->seller_name;
                $seller->collection_id=$custom_collection->id;
                $seller->collection_handle=$custom_collection->handle;
                $seller->seller_shopname = $request->seller_shopname;
                $seller->email = $request->seller_email;
                $seller->seller_store_address = $request->seller_store_address;
                $seller->seller_zipcode = $request->seller_zipcode;
                $seller->seller_contact = $request->seller_contact;
                $seller->seller_store_description = $request->seller_store_description;
                $seller->seller_description = $request->seller_description;
                $seller->seller_policy = $request->seller_policy;
                if ($request->hasFile('seller_image')) {
                    $seller_image = $request->file('seller_image');
                    $destinationPath = 'sellerimage/';
                    $filename1 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $seller_image->getClientOriginalName());
                    $seller_image->move($destinationPath, $filename1);
                    $filename1 = (asset('sellerimage/' . $filename1));
                    $seller->seller_image = $filename1;
                }

                if ($request->hasFile('seller_shop_image')) {
                    $seller_shop_image = $request->file('seller_shop_image');
                    $destinationPath = 'shopimage/';
                    $filename = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $seller_shop_image->getClientOriginalName());
                    $seller_shop_image->move($destinationPath, $filename);
                    $filename = (asset('shopimage/' . $filename));
                    $seller->seller_shop_image = $filename;
                }

                if ($request->hasFile('store_banner_image')) {
                    $store_banner_image = $request->file('store_banner_image');
                    $destinationPath = 'storebannerimage/';
                    $filename2 = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $store_banner_image->getClientOriginalName());
                    $store_banner_image->move($destinationPath, $filename2);
                    $filename2 = (asset('storebannerimage/' . $filename2));
                    $seller->store_banner_image = $filename2;
                }

                if ($request->publish_seller_profile == 'true') {
                    $publish_seller_profile = 1;
                } else {
                    $publish_seller_profile = 0;
                }
                $seller->publish_seller_profile = $publish_seller_profile;
                $seller->seller_handle = $request->seller_handle;
                $seller->shop_id = $shop->id;
                $seller->save();

                $data = [
                    'message' => 'Seller Updated Successfully',
                    'seller' => $seller
                ];
                return response()->json($data);
            }
        }else{
            return response()->json([
                'message' => 'Shop Not Found',
            ],422);
        }


    }

    public function UpdateSellerStatus(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $client = new Rest($shop->shop, $shop->access_token);
        if($shop){
            $seller = User::where('id', $request->id)->where('role', 'seller')->first();

            if($seller) {
                $seller->status = $request->status;
                $seller->save();


                $res = $client->get('/collections/' . $seller->collection_id . '/metafields.json');
                $res = $res->getDecodedBody();
                $flag = 0;
                    if(!isset($res['errors'])) {
                        foreach ($res['metafields'] as $deliverydate) {

                            if ($deliverydate['key'] == 'status') {
                                $flag = 1;
                                $product_metafield = $client->put('/metafields/' . $deliverydate['id'] . '.json', [

                                    "metafield" =>
                                        array(
                                            "type" => "boolean",
                                            "value" => $request->status,
                                        ),
                                ]);
                            }
                        }
                    }
                if($flag==0) {
                    $collection_metafield = $client->put('/custom_collections/' . $seller->collection_id . '.json', [
                        'custom_collection' => [
                            "metafields" =>
                                array(
                                    0 =>
                                        array(
                                            "key" => 'status',
                                            "value" => $request->status,
                                            "type" => "boolean",
                                            "namespace" => "seller",
                                        ),
                                ),
                        ]
                    ]);
                    $collection_metafield = $collection_metafield->getDecodedBody();
                }

                $data = [
                    'message' => 'Seller Updated Successfully',
                    'seller'=>$seller
                ];
                return response()->json($data);
            }
        }else{
            return response()->json([
                'message' => 'Shop Not Found',
            ],422);
        }


    }

    public function ChangePassword(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {
            $seller=User::find($request->id);
            if($seller){
                $validator = Validator::make($request->all(), [
                    'password' => 'min:8|string|required_with:password_confirmation|same:password_confirmation',
                    'password_confirmation' => 'min:8',
                ]);

                // Check if validation fails
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $errorString = implode(", ", $errors->all());

                    return response()->json([
                        'message' => $errorString,
                    ],422);
                }

            $seller->password = Hash::make($request->password);
            $seller->save();
            $data = [
                'message' => 'Password Changed Successfully',
            ];
            return response()->json($data);
        }
        }
        else{
            return response()->json([
                'message' => 'Shop Not Found',
            ],422);
        }
    }

    public function DeleteSeller(Request $request){
     $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $client = new Rest($shop->shop, $shop->access_token);
      $user=User::find($request->id);
        if($shop) {
            if($request->delete_product=='true'){
                $products=Product::where('user_id',$request->id)->get();
                foreach ($products as $product) {
                    $del = $client->delete('/products/' . $product->shopify_id . '.json');
                    $del=$del->getDecodedBody();

                    if (!isset($del['errors']['key'])) {
                        $product->delete();
                    }

                }
            }else{
               Product::where('user_id',$request->id)->delete();
            }
            if($user) {
                $delete_collection = $client->delete('/custom_collections/' . $user->collection_id . '.json');
//                if (!isset($delete_collection['errors']['key'])) {
                    User::where('id', $request->id)->where('role', 'seller')->forceDelete();
//                }
            }
            $data = [
                'message' => 'Seller Deleted Successfully',
            ];
        }
        return response()->json($data);
    }


    public function SellersFilter(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop){
            if($request->status==1){
                $status=1;
                $sellers=User::where('status',$status)->where('role','seller')->where('shop_id',$shop->id)->get();
            }
            else if($request->status==2) {
                $status = 0;
                $sellers = User::where('status', $status)->where('role', 'seller')->where('shop_id', $shop->id)->get();
            }
                else{
                    $sellers=User::where('role','seller')->where('shop_id',$shop->id)->get();
                }
            }

            if(count($sellers) > 0){
                $data = [
                    'seller'=>$sellers
                ];
                return response()->json($data);
            }

        }


    public function SendMessage(Request $request){
        $user=auth()->user();
        $type='Seller Message';
        $shop=Session::where('shop',$user->name)->first();
        if($shop){
            $user=User::where('id',$request->id)->where('shop_id',$shop->id)->where('role','seller')->first();
            if($user){
                $Setting = MailSmtpSetting::where('shop_id', $shop->id)->first();
                $details['to'] = $user->email;
                $details['name'] = $user->name;
                $details['subject'] = 'OneWholesale';
                $details['message'] = $request->message;
                Mail::to($user->email)->send(new SendMail($details, $Setting,$type));
            }

        }
    }

    public function UpdateSellerStatusMultiple(Request $request){

        $shop=Session::where('shop',$request->shop)->first();
        if($shop){
            foreach ($request->ids as $id) {
                $seller = User::where('id', $id)->where('role', 'seller')->first();
                if ($seller) {
                    $seller->status = $request->status;
                    $seller->save();
                }
            }
            $data = [
                'message' => 'Seller Updated Successfully',
            ];
            return response()->json($data);
        }else{
            return response()->json([
                'message' => 'Shop Not Found',
            ],422);
        }


    }

    public function ExportSeller(Request $request){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $sellers=User::where('shop_id',$shop->id)->where('role','seller')->get();

        $name = 'Seller-' . time() . '.csv';
        $file = fopen(public_path($name), 'w+');

        // Add the CSV headers
        fputcsv($file, ['Seller Name','Store Name', 'Email','Status']);
        foreach ($sellers as $seller){
            if($seller->status==1){
                $status='Active';
            }else{
                $status='Disabled';
            }
            fputcsv($file, [
                $seller->name,
                $seller->seller_shopname,
                $seller->email,
                $status,
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
