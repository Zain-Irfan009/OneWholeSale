<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Option;
use App\Models\Product;
use App\Models\ProductCollect;
use App\Models\ProductHistory;
use App\Models\ProductImage;
use App\Models\Session;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Shopify\Clients\Rest;

class ProductController extends Controller
{
    public function Products(Request $request){

        $user=auth()->user();
        $user=User::find($user->id);
        $session=Session::find($user->shop_id);
        if($user){
            $products=Product::where('user_id',$user->id)->with('hasVariantsCount')->orderBy('id','desc')->paginate(20);
            $data = [
                'products'=>$products,
                'currency'=>$session->money_format,
            ];
            return response()->json($data);
        }
    }

    public function ProductFilter(Request $request){

        $user=auth()->user();
        $user=User::find($user->id);
        if($user) {
            if ($request->status == 0) {
                $products = Product::query();
            } else if ($request->status == 1) {
                $status = 'Approval Pending';
                $products = Product::where('product_status', $status);
            } else if ($request->status == 2) {
                $status = 'Approved';
                $products = Product::where('product_status', $status);
            } else if ($request->status == 3) {
                $status = 'Disabled';
                $products = Product::where('product_status', $status);
            }
            if($request->query_value!=null){
                $products=$products->where('product_name', 'like', '%' . $request->value . '%');
            }

            $products=$products->where('user_id', $user->id)->orderBy('id','Desc')->get();

            if (count($products) > 0) {
                $data = [
                    'products' => $products
                ];
                return response()->json($data);
            }
        }
    }

    public function ProductView(Request $request,$id){
        $user=auth()->user();
        $user=User::find($user->id);
        if($user){
            $product=Product::find($id);
            if($product){
                $variants=Variant::where('shopify_product_id',$product->shopify_id)->get();
                $options=Option::where('shopify_product_id',$product->shopify_id)->get();
                $selected_variant=Variant::select('title','price','quantity','sku','compare_at_price','barcode','src')->where('shopify_product_id', $product->shopify_id)->get();
                $product_images=ProductImage::where('shopify_product_id',$product->shopify_id)->whereNotNull('shopify_image_id')->orderBy('position','asc')->get();
                $data = [
                    'product'=>$product,
                    'variants'=>$variants,
                    'options'=>$options,
                    'product_images'=>$product_images,
                    'selected_variant'=>$selected_variant,
                ];
                return response()->json($data);
            }
        }

    }

//
//    public function Productdelete(Request $request){
//        $user=auth()->user();
//        $user=User::find($user->id);
//        if($user){
//            $product=Product::find($request->id);
//            if($product){
//                $product->user_id=null;
//                $product->seller_name=null;
//                $product->seller_email=null;
//                $product->save();
//
//                $data = [
//                    'message'=>'Product Deleted Successfully'
//                ];
//                return response()->json($data);
//            }
//        }
//    }


    public function Productdelete(Request $request){
        $user=auth()->user();
        $session=Session::where('id',$user->shop_id)->first();
        $client = new Rest($session->shop, $session->access_token);
        if($session){
            $product=Product::find($request->id);
            if($product){
                $product_api = $client->delete( '/products/' . $product->shopify_id . '.json');
                $product_api=$product_api->getDecodedBody();
//                if(!isset($product_api['errors'])){

                Option::where('shopify_product_id',$product->shopify_id)->delete();
                Variant::where('shopify_product_id',$product->shopify_id)->delete();
                ProductImage::where('shopify_product_id',$product->shopify_id)->delete();
                $product->delete();
                $data = [
                    'message' => 'Product Deleted Successfully',
                ];
//                }
            }
        }
        return response()->json($data);
    }
    public function ExportProduct(Request $request){
        $user=auth()->user();
//        $shop=Session::where('shop',$user->name)->first();
        $products=Product::where('user_id',$user->id)->orderby('id','desc')->get();

        $name = 'Product-' . time() . '.csv';
        $file = fopen(public_path($name), 'w+');

        // Add the CSV headers
        fputcsv($file, ['Product Name','Price','Quantity','Status']);
        foreach ($products as $product){
            $quantity=0;
            if($product->hasVariantsCount && count($product->hasVariantsCount) > 0 && $product->hasVariantsCount[0]->total_quantity!=0  ){
                $quantity=$product->hasVariantsCount[0]->total_quantity;
            }


            fputcsv($file, [
                $product->product_name,
                $product->price,
                $quantity,
                $product->product_status,

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

    public function SearchProducts(Request $request)
    {
        $user = auth()->user();
        $session=Session::where('shop',$user->name)->first(); // Use firstOrFail() to throw an exception if not found

        $products = Product::where('user_id', $user->id); // Start with products related to the user

        // Filter products based on the status
        if ($request->has('status')) {
            if ($request->status == 1) {
                $status = 'Approval Pending';
            } elseif ($request->status == 2) {
                $status = 'Approved';
            } elseif ($request->status == 3) {
                $status = 'Disabled';
            }
            if($request->status!=0) {
                $products->where('product_status', $status);
            }
        }

        // Search products by name or SKU
        if ($request->has('query_value')) {
            $queryValue = '%' . $request->query_value . '%';
            $products->where(function ($query) use ($queryValue) {
                $query->where('product_name', 'like', $queryValue)
                    ->orWhereHas('variants', function ($query) use ($queryValue) {
                        $query->where('sku', 'like', $queryValue);
                    });
            });
        }

        // Load relation 'hasVariantsCount' to eager load with products
        $products = $products->with('hasVariantsCount')->get();

        $data = [
            'data' => $products
        ];
        return response()->json($data);
    }


//    public function AddProduct(Request $request){
//
//        $user=auth()->user();
//        $session=Session::where('id',$user->shop_id)->first();
//
//        $check_user=User::where('email',$request->seller_email)->where('role','seller')->first();
//        if($check_user==null){
//            return response()->json([
//                'message' => 'Seller Not Found',
//            ],422);
//        }
//        $client = new Rest($session->shop, $session->access_token);
//
//        $options_array = [];
//
//
//        if (isset($request->options)) {
//
//            $options=json_decode($request->options);
//
//            if (count($options) > 0) {
//                foreach ($options as $index => $option) {
//                    $temp = [];
//
//
//                    if (isset($option->name) && $option->name != null) {
//                        $option_values = array_filter($option->value);
//                        array_push($options_array, [
//                            'name' => $option->name,
//                            'position' => $index + 1,
//                            'values' => $option_values
//                        ]);
//                    }
//                }
//            }
//        }
//
//        $variants_array = [];
//
//        if(isset($request->variants) ) {
//            $variants=json_decode($request->variants);
//
//            if( count($variants) > 0){
//
//                foreach ($variants as $index => $variant) {
//
//                    $title = explode("/", $variant->title);
//
//                    $variant_option1 = (isset($title[0])) ? $title[0] : null;
//                    $variant_option2 = (isset($title[1])) ? $title[1] : null;
//                    $variant_option3 = (isset($title[2])) ? $title[2] : null;
//
//                    if ($variant->title != 'Default Title') {
//
//                        array_push($variants_array, [
//                            'title' => $variant->title,
//                            'sku' => $variant->sku,
//                            'option1' => $variant_option1,
//                            'option2' => $variant_option2,
//                            'option3' => $variant_option3,
//                            'inventory_quantity' => $variant->quantity,
////                "fulfillment_service" => common::getInventoryManager(),
////                'inventory_management' => common::getInventoryManager(),
//                            'grams' => (is_null($request->weight)) ? 0.0 : $request->weight * 1000,
//                            'weight' => (is_null($request->weight)) ? 0.0 : $request->weight,
//                            'weight_unit' => $request->weight_unit,
//                            'barcode' => $request->barcode,
//                            'taxable' => $request->taxable,
//                            'price' => number_format($variant->price, 2),
//                            'compare_at_price' => number_format($variant->compare_at_price, 2),
//                            'inventory_management' => (($request->inventory_management == "true")) ? 'shopify' : null,
//                            'inventory_policy' => (($request->inventory_policy == "true")) ? 'continue' : 'deny',
//
//                        ]);
//                    }
//                    else{
//
//                        array_push($variants_array, [
//                            'price' => $request->product_price,
//                            'inventory_quantity' => $request->product_quantity,
//                            'compare_at_price' => ($request->product_compare_at_price=='null') ? 0 : $request->product_compare_at_price,
//                            'sku' => ($request->product_sku=='null' ?'' :$request->product_sku),
//                            'barcode' =>($request->barcode=='null' ?'' :$request->barcode),
//                            'taxable' => $request->taxable,
//                            'grams' => (is_null($request->weight)) ? 0.0 : $request->weight * 1000,
//                            'weight' => (is_null($request->weight)) ? 0.0 : $request->weight,
//                            'weight_unit' => $request->weight_unit,
//                            'inventory_management'=>(($request->inventory_management=="true")) ? 'shopify' : null,
//                            'inventory_policy'=>(($request->inventory_policy=="true")) ? 'continue' : 'deny',
//                        ]);
//                    }
//                }
//            }
//            else{
//
//                array_push($variants_array, [
//                    'price' => $request->product_price,
//                    'inventory_quantity' => $request->product_quantity,
//                    'compare_at_price' => ($request->product_compare_at_price=='null') ? 0 : $request->product_compare_at_price,
//                    'sku' => ($request->product_sku=='null' ?'' :$request->product_sku),
//                    'barcode' => ($request->barcode=='null' ?'' :$request->barcode),
//                    'taxable' => $request->taxable,
//                    'grams' => (is_null($request->weight)) ? 0.0 : $request->weight * 1000,
//                    'weight' => (is_null($request->weight)) ? 0.0 : $request->weight,
//                    'weight_unit' => $request->weight_unit,
//                    'inventory_management'=>(($request->inventory_management=="true")) ? 'shopify' : null,
//                    'inventory_policy'=>(($request->inventory_policy=="true")) ? 'continue' : 'deny',
//                ]);
//            }
//        }
//
//
//        $images_array = array();
//        if(isset($request->images)) {
//
//            foreach ($request->images as $index => $image) {
//
//                $destinationPath = 'productimages/';
//                $filename = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', Str::random(10).'.png');
//                $image->move($destinationPath, $filename);
//                $filename = (asset('productimages/' . $filename));
//
//
//
//                array_push($images_array, [
//                    'alt' => $request->product_name . '_' . $index,
//                    'position' => $index + 1,
//                    'src' => $filename,
//                ]);
//
//
//            }
//        }
//
//        if(isset($request->product_id)){
//            $product_id_get=Product::find($request->product_id);
//            $product_get_images=ProductImage::where('shopify_product_id',$product_id_get->shopify_id)->get();
//
//            foreach ($product_get_images as $index=> $product_get_image){
//                array_push($images_array, [
//                    'alt' => $request->product_name . '_' . $index,
//                    'position' => $index  + 1,
//                    'src' => $product_get_image->src,
//                ]);
//
//                $product_get_image->delete();
//            }
//
//
//        }
//
//
//        if($request->tags) {
//            $tags = $request->tags;
//        }else{
//            $tags='';
//        }
//
//
//        if($request->collections) {
//
//            $collections = $request->collections;
////            $collections = implode(',', $collections);
//        }else{
//            $collections='';
//        }
//
//        if($request->status=="active"){
//            $status='active';
//        }else{
//            $status='draft';
//        }
//
//        $productdata = [
//            "product" => [
//                "title" => $request->product_name,
//                "body_html" => $request->description,
////                "metafields_global_description_tag" => $product->metafields_global_description_tag,
//                "vendor" => $request->vendor,
//                "tags" => $tags,
//                "product_type" => $request->product_type,
//                "variants" => $variants_array,
//                "options" => $options_array,
//                "images" => $images_array,
////                "published"=>  $published,
//                "status"=>  $status
//            ]
//        ];
//
//        if(isset($request->product_id)){
//            $product_get=Product::find($request->product_id);
//            $response = $client->put('/products/' . $product_get->shopify_id .'.json', $productdata);
//
//        }else {
//            $response = $client->post('/products.json', $productdata);
//        }
//
//        $response=$response->getDecodedBody();
//
//
//
//        $response=$response['product'];
//
//        $response=json_decode(json_encode($response));
//
//
//        if(isset($request->product_id)){
//            $product=Product::find($request->product_id);
//        }else {
//            $product = new Product();
//        }
//        $user=User::where('email',$request->seller_email)->where('role','seller')->first();
//        $product->shop_id=$session->id;
//        $product->shopify_id=$response->id;
//        $product->product_name=$response->title;
//        $product->description=$response->body_html;
//        $product->search_engine_title=$request->search_engine_title;
//        $product->search_engine_meta_description=$request->search_engine_meta_description;
//        $product->seller_email=$request->seller_email;
//        if($user) {
//            $product->seller_name = $user->name;
//            $product->user_id = $user->id;
//        }
//        $product->collections=$collections;
//        $product->tags=$tags;
//        $product->product_type=$request->product_type;
//        $product->vendor=$request->vendor;
//        $product->status=$response->status;
//        $product->price=$response->variants[0]->price;
//        $product->quantity=$response->variants[0]->inventory_quantity;
//        if($request->status=='draft') {
//            $product->product_status = 'Approval Pending';
//        }else{
//            $product->product_status = 'Approved';
//        }
//        $product->type='Normal';
//
//        if ($response->images) {
//            $image = $response->images[0]->src;
//        } else {
//            $image = '';
//        }
//        $product->featured_image=$image;
//        $product->save();
//
//
//        $product_history=new ProductHistory();
//        $product_history->product_shopify_id=$response->id;
//        $product_history->shop_id=$session->id;
//        $product_history->product_name=$response->title;
//        $product_history->status=$response->status;
//        $product_history->date=Carbon::now();
//        $product_history->save();
//
//
//        if(isset($request->product_id)){
//            Variant::where('shopify_product_id',$product->shopify_id)->delete();
//        }
//
//        foreach ($response->variants as $product_variant) {
//
//            $variant = new Variant();
//            $variant->shop_id = $session->id;
//            $variant->shopify_product_id = $response->id;
//            $variant->shopify_id = $product_variant->id;
//            $variant->title = $product_variant->title;
//            $variant->price = $product_variant->price;
//            $variant->sku = $product_variant->sku;
//            $variant->position = $product_variant->position;
//            $variant->inventory_policy = $product_variant->inventory_policy;
//            $variant->compare_at_price = $product_variant->compare_at_price;
//            $variant->inventory_management = $product_variant->inventory_management;
//            $variant->option1 = $product_variant->option1;
//            $variant->option2 = $product_variant->option2;
//            $variant->option3 = $product_variant->option3;
//            $variant->taxable = $product_variant->taxable;
//            $variant->barcode = $product_variant->barcode;
//            $variant->grams = $product_variant->grams;
//            $variant->weight = $product_variant->weight;
//            $variant->weight_unit = $product_variant->weight_unit;
//            $variant->inventory_item_id = $product_variant->inventory_item_id;
//            $variant->quantity = $product_variant->inventory_quantity;
//            $variant->old_inventory_quantity = $product_variant->old_inventory_quantity;
//            $variant->save();
//        }
//        if(isset($request->product_id)){
//            Option::where('shopify_product_id',$product->shopify_id)->delete();
//        }
//        foreach ($response->options as $product_option){
//            $option=new Option();
//            $option->shop_id=$session->id;
//            $option->shopify_product_id=$product_option->product_id;
//            $option->shopify_id=$product_option->id;
//            $option->name=$product_option->name;
//            $option->position=$product_option->position;
//            $option->values=implode(',',$product_option->values);
//            $option->save();
//        }
//
//        foreach ($response->images as $image){
//            $product_image=new ProductImage();
//            $product_image->shop_id=$session->id;
//            $product_image->shopify_product_id=$image->product_id;
//            $product_image->position=$image->position;
//            $product_image->src=$image->src;
//            $product_image->save();
//        }
//
//
//
//
//
//        $user=User::where('email',$request->seller_email)->first();
//        if($user) {
//            $collect_product = $client->post('/collects.json', [
//                'collect' => [
//                    'collection_id' => $user->collection_id,
//                    'product_id' => $response->id,
//                ]
//            ]);
//
//            $collect_product = $collect_product->getDecodedBody();
//
//            if (!isset($collect_product['errors'])) {
//                $product->collect_id = $collect_product['collect']['id'];
//                $product->user_id = $user->id;
//                $product->seller_email = $user->email;
//                $product->save();
//            }
//        }
//        $data = [
//            'message' => 'Product Created Successfully',
//        ];
//        return response()->json($data);
//
//
//    }

    public function AddProduct(Request $request){

        $user=auth()->user();
        $session=Session::where('id',$user->shop_id)->first();

        $check_user=User::where('email',$request->seller_email)->where('role','seller')->first();
        if($check_user==null){
            return response()->json([
                'message' => 'Seller Not Found',
            ],422);
        }
        $client = new Rest($session->shop, $session->access_token);

        $options_array = [];


        if (isset($request->options)) {

            $options=json_decode($request->options);

            if (count($options) > 0) {
                foreach ($options as $index => $option) {
                    $temp = [];


                    if (isset($option->name) && $option->name != null) {
                        $option_values = array_filter($option->value);

                        array_push($options_array, [
                            'name' => $option->name,
                            'position' => $index + 1,
                            'values' => $option_values
                        ]);

                    }
                }

            }
        }

        $variants_array = [];

        if(isset($request->variants) ) {
            $variants=json_decode($request->variants);



            if( count($variants) > 0){

                foreach ($variants as $index => $variant) {

                    $title = explode("/", $variant->title);

                    $variant_option1 = (isset($title[0])) ? $title[0] : null;
                    $variant_option2 = (isset($title[1])) ? $title[1] : null;
                    $variant_option3 = (isset($title[2])) ? $title[2] : null;

                    if ($variant->title != 'Default Title') {

                        array_push($variants_array, [
                            'title' => $variant->title,
                            'sku' => $variant->sku,
                            'option1' => $variant_option1,
                            'option2' => $variant_option2,
                            'option3' => $variant_option3,
                            'inventory_quantity' => (isset($variant->quantity)) ? $variant->quantity : 0,
//                "fulfillment_service" => common::getInventoryManager(),
//                'inventory_management' => common::getInventoryManager(),
                            'grams' => (is_null($request->weight)) ? 0.0 : $request->weight * 1000,
                            'weight' => (is_null($request->weight)) ? 0.0 : $request->weight,
                            'weight_unit' => $request->weight_unit,
                            'barcode' => $request->barcode,
                            'taxable' => $request->taxable,
                            'price' => number_format($variant->price, 2),
                            'compare_at_price' => ($variant->compare_at_price=="") ? 0 : number_format($variant->compare_at_price, 2),
                            'inventory_management' => (($request->inventory_management == "true")) ? 'shopify' : null,
                            'inventory_policy' => (($request->inventory_policy == "true")) ? 'continue' : 'deny',
                            'barcode'=>(isset($variant->barcode)) ? $variant->barcode : ''



                        ]);
                    }
                    else{

                        array_push($variants_array, [
                            'price' => $request->product_price,
                            'inventory_quantity' => $request->product_quantity,
                            'compare_at_price' => ($request->product_compare_at_price=='null') ? 0 : $request->product_compare_at_price,
                            'sku' => ($request->product_sku=='null' ?'' :$request->product_sku),
                            'barcode' =>($request->barcode=='null' ?'' :$request->barcode),
                            'taxable' => $request->taxable,
                            'grams' => (is_null($request->weight)) ? 0.0 : $request->weight * 1000,
                            'weight' => (is_null($request->weight)) ? 0.0 : $request->weight,
                            'weight_unit' => $request->weight_unit,
                            'inventory_management'=>(($request->inventory_management=="true")) ? 'shopify' : null,
                            'inventory_policy'=>(($request->inventory_policy=="true")) ? 'continue' : 'deny',
                        ]);
                    }
                }
            }
            else{

                array_push($variants_array, [
                    'price' => $request->product_price,
                    'inventory_quantity' => $request->product_quantity,
                    'compare_at_price' => ($request->product_compare_at_price=='null') ? 0 : $request->product_compare_at_price,
                    'sku' => ($request->product_sku=='null' ?'' :$request->product_sku),
                    'barcode' => ($request->barcode=='null' ?'' :$request->barcode),
                    'taxable' => $request->taxable,
                    'grams' => (is_null($request->weight)) ? 0.0 : $request->weight * 1000,
                    'weight' => (is_null($request->weight)) ? 0.0 : $request->weight,
                    'weight_unit' => $request->weight_unit,
                    'inventory_management'=>(($request->inventory_management=="true")) ? 'shopify' : null,
                    'inventory_policy'=>(($request->inventory_policy=="true")) ? 'continue' : 'deny',

                ]);
            }
        }


        $images_array = array();
        if(isset($request->images)) {

            foreach ($request->images as $index => $image) {

                $destinationPath = 'productimages/';
                $filename = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', Str::random(10).'.png');
                $image->move($destinationPath, $filename);
                $filename = (asset('productimages/' . $filename));



                array_push($images_array, [
                    'alt' => $request->product_name . '_' . $index,
                    'position' => $index + 1,
                    'src' => $filename,
                ]);


            }
        }

//        if(isset($request->product_id)){
//            $product_id_get=Product::find($request->product_id);
//            $product_get_images=ProductImage::where('shopify_product_id',$product_id_get->shopify_id)->get();
//
//            foreach ($product_get_images as $index=> $product_get_image){
//                array_push($images_array, [
//                    'alt' => $request->product_name . '_' . $index,
//                    'position' => $index  + 1,
//                'src' => $product_get_image->src,
//            ]);
//
//
//
//                $product_get_image->delete();
//            }
//
//
//        }



        if($request->tags) {
            $tagsArray = explode(',', $request->tags);
            $filteredTagsArray = array_filter($tagsArray, function($tag) {
                return strpos($tag, 'Excise_') === false;
            });
            $tags = implode(',', $filteredTagsArray);
            if($request->vape_seller=='Yes'){
                $excise_tax=number_format($request->excise_tax, 2, '.', '');
                $tags =  $tags . ',' . 'Excise_' . $excise_tax;

            }
        }else{
            $tags='';
            if($request->vape_seller=='Yes') {
                $excise_tax = number_format($request->excise_tax, 2, '.', '');
                $tags = 'Excise_' . $excise_tax;
            }

        }


        if($request->collections) {

            $collections = $request->collections;
//            $collections = implode(',', $collections);
        }else{
            $collections='';
        }

        if($request->status=="active"){
            $status='active';
        }else{
            $status='draft';
        }

        if(isset($request->product_id)){
            $productdata = [
                "product" => [
                    "title" => $request->product_name,
                    "body_html" => $request->description,
                    "vendor" => $request->vendor,
                    "tags" => $tags,
                    "product_type" => $request->product_type,
                    "variants" => $variants_array,
                    "options" => $options_array,
                    "status" => $status
                ]
            ];

        }else {
            $productdata = [
                "product" => [
                    "title" => $request->product_name,
                    "body_html" => $request->description,
//                "metafields_global_description_tag" => $product->metafields_global_description_tag,
                    "vendor" => $request->vendor,
                    "tags" => $tags,
                    "product_type" => $request->product_type,
                    "variants" => $variants_array,
                    "options" => $options_array,
                    "images" => $images_array,
//                "published"=>  $published,
                    "status" => $status
                ]
            ];

        }


        if(isset($request->product_id)){

            $product_get=Product::find($request->product_id);
            $response = $client->put('/products/' . $product_get->shopify_id .'.json', $productdata);
        }else {

            $response = $client->post('/products.json', $productdata);
        }

        $response=$response->getDecodedBody();


        $response=$response['product'];

        $response=json_decode(json_encode($response));


        if(isset($request->product_id)){
            $product=Product::find($request->product_id);
        }else {
            $product = new Product();
        }
        $user=User::where('email',$request->seller_email)->where('role','seller')->first();
        $product->shop_id=$session->id;
        $product->shopify_id=$response->id;
        $product->product_name=$response->title;
        $product->description=$response->body_html;
        $product->search_engine_title=$request->search_engine_title;
        $product->search_engine_meta_description=$request->search_engine_meta_description;
        $product->seller_email=$request->seller_email;
        if($user) {
            $product->seller_name = $user->name;
            $product->user_id = $user->id;
        }
        $product->collections=$collections;
        $product->tags=$tags;
        $product->product_type=$request->product_type;
        $product->vendor=$request->vendor;
        $product->status=$response->status;
        $product->price=$response->variants[0]->price;
        $product->quantity=$response->variants[0]->inventory_quantity;

        if($request->status=='draft') {
            $product->product_status = 'Approval Pending';
        }else{
            $product->product_status = 'Approval Pending';
        }
        $product->type='Normal';
        $product->vape_seller=$request->vape_seller;
        $product->excise_tax=$request->excise_tax;

        if ($response->images) {
            $image = $response->images[0]->src;
        } else {
            $image = '';
        }
        $product->featured_image=$image;
        $product->save();


        $product_history=new ProductHistory();
        $product_history->product_shopify_id=$response->id;
        $product_history->shop_id=$session->id;
        $product_history->product_name=$response->title;
        $product_history->status=$response->status;
        $product_history->date=Carbon::now();
        $product_history->save();


        if(isset($request->product_id)){
            Variant::where('shopify_product_id',$product->shopify_id)->delete();
        }

        foreach ($response->variants as $product_variant) {
            $v_image_check = ProductImage::where('shopify_image_id',$product_variant->image_id)->where('shopify_product_id',$response->id)
                ->first();

            $v_image_src=null;
            if($v_image_check){
                $v_image_src=$v_image_check->src;
            }

            $variant = new Variant();
            $variant->shop_id = $session->id;
            $variant->shopify_product_id = $response->id;
            $variant->shopify_id = $product_variant->id;
            $variant->title = $product_variant->title;
            $variant->price = $product_variant->price;
            $variant->sku = $product_variant->sku;
            $variant->position = $product_variant->position;
            $variant->inventory_policy = $product_variant->inventory_policy;
            $variant->compare_at_price = $product_variant->compare_at_price;
            $variant->inventory_management = $product_variant->inventory_management;
            $variant->option1 = $product_variant->option1;
            $variant->option2 = $product_variant->option2;
            $variant->option3 = $product_variant->option3;
            $variant->taxable = $product_variant->taxable;
            $variant->barcode = $product_variant->barcode;
            $variant->grams = $product_variant->grams;
            $variant->weight = $product_variant->weight;
            $variant->weight_unit = $product_variant->weight_unit;
            $variant->inventory_item_id = $product_variant->inventory_item_id;
            $variant->quantity = $product_variant->inventory_quantity;
            $variant->product_image_id=$product_variant->image_id;
            $variant->old_inventory_quantity = $product_variant->old_inventory_quantity;
            $variant->src=$v_image_src;
            $variant->save();

            if(isset($request->product_id)) {
                $product=Product::find($request->product_id);
                if(isset($request->variants) ) {
                    $variants_gets = json_decode($request->variants);

                    if (count($variants_gets) > 0) {
                        foreach ($variants_gets as $index => $variants_get) {
                            if ($variants_get->title != 'Default Title') {
                                $variant_check = Variant::where('shopify_product_id', $product->shopify_id)->where('title', $variants_get->title)->first();
                                if ($variant_check) {
                                    $location = $client->get('/locations.json');
                                    $location = $location->getDecodedBody();
                                    $location = json_decode(json_encode($location));
                                    $location_id = $location->locations[0]->id;
                                    $data = [
                                        "location_id" => $location_id,
                                        "inventory_item_id" => $product_variant->inventory_item_id,
                                        'available' => (isset($variants_get->quantity)) ? $variant->quantity : 0,
                                    ];

                                    $res = $client->post('/inventory_levels/set.json', $data);
                                    $variant->quantity = (isset($variants_get->quantity)) ? $variant->quantity : 0;
                                    $variant->save();
                                }
                            }
                        }
                    }
                }
            }
        }
        if(isset($request->product_id)){
            Option::where('shopify_product_id',$product->shopify_id)->delete();
        }
        foreach ($response->options as $product_option){
            $option=new Option();
            $option->shop_id=$session->id;
            $option->shopify_product_id=$product_option->product_id;
            $option->shopify_id=$product_option->id;
            $option->name=$product_option->name;
            $option->position=$product_option->position;
            $option->values=implode(',',$product_option->values);
            $option->save();
        }


        foreach ($response->images as $image){
            $product_image=ProductImage::where('shop_id',$session->id)->where('shopify_image_id',$image->id)->first();
            if($product_image==null) {
                $product_image=new ProductImage();
            }
            $product_image->shop_id=$session->id;
            $product_image->shopify_image_id=$image->id;
            $product_image->shopify_product_id=$image->product_id;
            $product_image->position=$image->position;
            $product_image->src=$image->src;
            $product_image->save();
        }




        if(isset($request->product_id)){
            $product=Product::find($request->product_id);
            if(isset($request->variants) ) {
                $variants = json_decode($request->variants);

                if (count($variants) > 0) {
                    foreach ($variants as $index => $variant) {
                        if (isset($variant->src) && $variant->src != null) {
                            $variant_check = Variant::where('shopify_product_id', $product->shopify_id)->where('title', $variant->title)->first();

                            if ($variant_check) {

                                $product_image_check = ProductImage::where('shopify_product_id', $product->shopify_id)
                                    ->where('src', $variant->src)
                                    ->first();


                                if ($product_image_check) {
                                    $variant_check->product_image_id = $product_image_check->shopify_image_id;
                                    $variant_check->src = $variant->src;
                                    $variant_check->save();

                                    $i = [
                                        'image' => [
                                            'id' => $product_image_check->shopify_image_id,
                                            'variant_ids' => [$variant_check->shopify_id]
                                        ]
                                    ];
                                    $imagesResponse = $client->put('/admin/products/' . $product->shopify_id . '/images/' . $product_image_check->shopify_image_id . '.json', $i);
                                    $imagesResponse = $imagesResponse->getDecodedBody();
                                }
                            }
                        }
                    }
                }
            }
        }



        $user=User::where('email',$request->seller_email)->first();
        if($user) {

            $delete_collect_product = $client->delete('/collects/'.$product->collect_id.'.json');
            $delete_collect_product = $delete_collect_product->getDecodedBody();


            if(!isset($delete_collect_product['errors']) || $delete_collect_product==null) {

                $collect_product = $client->post('/collects.json', [
                    'collect' => [
                        'collection_id' => $user->collection_id,
                        'product_id' => $response->id,
                    ]
                ]);
            } elseif ($delete_collect_product['errors']=='Not Found'){
                $collect_product = $client->post('/collects.json', [
                    'collect' => [
                        'collection_id' => $user->collection_id,
                        'product_id' => $response->id,
                    ]
                ]);
            }


            $collect_product = $collect_product->getDecodedBody();

            if (!isset($collect_product['errors'])) {
                $product->collect_id = $collect_product['collect']['id'];
                $product->user_id = $user->id;
                $product->seller_email = $user->email;
                $product->save();
            }


            if(isset($request->collections)) {
                $get_collect_products=ProductCollect::where('product_shopify_id',$response->id)->get();
                foreach ($get_collect_products as $get_collect_product){
                    $delete_collect_product_del = $client->delete('/collects/'.$get_collect_product->collect_id.'.json');
                    $delete_collect_product_del = $delete_collect_product_del->getDecodedBody();


                }
                ProductCollect::where('product_shopify_id',$response->id)->delete();


                $ex_collection_titles=explode(',',$request->collections);
                foreach ($ex_collection_titles as $ex_collection_title){

                    $check_collection=Collection::where('title',$ex_collection_title)->first();
                    if($check_collection){

                        $collect_exisiting_product = $client->post('/collects.json', [
                            'collect' => [
                                'collection_id' => $check_collection->shopify_id,
                                'product_id' => $response->id,
                            ]
                        ]);
                        $collect_exisiting_product = $collect_exisiting_product->getDecodedBody();
                        if (!isset($collect_exisiting_product['errors'])) {
                            $product_collect=new ProductCollect();
                            $product_collect->product_shopify_id=$response->id;
                            $product_collect->collection_shopify_id=$check_collection->shopify_id;
                            $product_collect->collect_id=$collect_exisiting_product['collect']['id'];
                            $product_collect->shop_id=$session->id;
                            $product_collect->save();
                        }}

                }
            }
        }
//        $this->SendMail($product,$product->product_status );
        $data = [
            'message' => 'Product Created Successfully',
        ];
        return response()->json($data);


    }

    public function AddProductImage(Request $request){
        $user=auth()->user();
        $session=Session::where('id',$user->shop_id)->first();
        $client = new Rest($session->shop, $session->access_token);
        $product=Product::find($request->product_id);

        $images_array = array();

        $image=$request->images;
        $destinationPath = 'productimages/';
        $filename = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', Str::random(10).'.png');
        $image->move($destinationPath, $filename);
        $filename = (asset('productimages/' . $filename));

        $productImagesJson = [
            'alt' => Str::random(10).'_'.Str::random(2) ,
            'position' =>1,
            'src' => $filename,
        ];

        $assignImagetoProducts = $client->post('/products/' . $product->shopify_id . '/images.json', [
            'image' => $productImagesJson
        ]);
        $assignImagetoProducts=$assignImagetoProducts->getDecodedBody();
        if(!isset($assignImagetoProducts['errors'])) {
            $product_image = new ProductImage();
            $product_image->shop_id = $session->id;
            $product_image->shopify_product_id = $product->shopify_id;
            $product_image->shopify_image_id = $assignImagetoProducts['image']['id'];
            $product_image->position = $assignImagetoProducts['image']['position'];
            $product_image->src = $assignImagetoProducts['image']['src'];
            $product_image->save();

            $product->featured_image= $assignImagetoProducts['image']['src'];
            $product->save();
            $product_images=ProductImage::where('shopify_product_id',$product->shopify_id)->get();
            $data = [

                'product_images'=>$product_images,


            ];

            return response()->json($data);
        }
    }

    public function DragImage(Request $request){
        $user=auth()->user();
        $session=Session::where('id',$user->shop_id)->first();
        $client = new Rest($session->shop, $session->access_token);
        $image_data=json_decode($request['data']);
        foreach ($image_data as $index=> $data){
            $index=$index+1;
            $productImagesJson = [
                'alt' => Str::random(10).'_'.Str::random(2) ,
                'position' =>$index,
                'src' => $data->src,
            ];

            $assignImagetoProducts = $client->put('/products/' . $data->shopify_product_id . '/images/'.$data->shopify_image_id.'.json', [
                'image' => $productImagesJson
            ]);

            $product_image=ProductImage::where('shopify_product_id',$data->shopify_product_id)->where('shopify_image_id',$data->shopify_image_id)->first();
            if($product_image){
                $product_image->position=$index;
                $product_image->save();
            }

            if($index==1){
                $product=Product::where('shopify_id',$data->shopify_product_id)->first();
                if($product){
                    $product->featured_image=$data->src;
                    $product->save();
                }
            }
        }

    }

    public function RemoveImage(Request $request){
        $user=auth()->user();
        $session=Session::where('id',$user->shop_id)->first();
        $client = new Rest($session->shop, $session->access_token);
        $product=Product::find($request->id);
        $product_image=ProductImage::where('shopify_product_id',$product->shopify_id)->where('src',$request->src)->first();
        if($product_image){
            $delete_product_image = $client->delete('/products/' . $product->shopify_id . '/images/'.$product_image->shopify_image_id.'.json');
            $delete_product_image=$delete_product_image->getDecodedBody();

            if(!isset($delete_product_image['errors'])) {
                $product_image->delete();
            }
        }
        $product_images=ProductImage::where('shopify_product_id',$product->shopify_id)->orderBy('position','asc')->get();
        $product->featured_image=$product_images[0]->src;
        $product->save();
        $data = [
            'product_images'=>$product_images,
        ];

        return response()->json($data);


    }


}
