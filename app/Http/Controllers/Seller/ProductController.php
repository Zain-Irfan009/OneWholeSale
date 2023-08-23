<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Option;
use App\Models\Product;
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
            $products=Product::where('user_id',$user->id)->orderBy('id','desc')->paginate(20);
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
                $selected_variant=Variant::select('price','quantity','sku','compare_at_price')->where('shopify_product_id', $product->shopify_id)->get();
                $product_images=ProductImage::where('shopify_product_id',$product->shopify_id)->get();
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


    public function Productdelete(Request $request){
        $user=auth()->user();
        $user=User::find($user->id);
        if($user){
            $product=Product::find($request->id);
            if($product){
                $product->user_id=null;
                $product->seller_name=null;
                $product->seller_email=null;
                $product->save();

                $data = [
                    'message'=>'Product Deleted Successfully'
                ];
                return response()->json($data);
            }
        }
    }

    public function ExportProduct(Request $request){
        $user=auth()->user();
//        $shop=Session::where('shop',$user->name)->first();
        $products=Product::where('user_id',$user->id)->get();

        $name = 'Product-' . time() . '.csv';
        $file = fopen(public_path($name), 'w+');

        // Add the CSV headers
        fputcsv($file, ['Product Name', 'Status']);
        foreach ($products as $product){

            fputcsv($file, [
                $product->product_name,
//                $product->seller_name,
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

    public function SearchProducts(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
       if ($request->status == 1) {
            $status = 'Approval Pending';
            $products = Product::where('product_status', $status);
        } else if ($request->status == 2) {
            $status = 'Approved';
            $products = Product::where('product_status', $status);
        } else if ($request->status == 3) {
            $status = 'Disabled';
            $products = Product::where('product_status', $status);
        }
        $products=$products->where('product_name', 'like', '%' . $request->query_value . '%');

       $products=$products->where('user_id',$user->id)->get();
        $data = [
            'data' => $products
        ];
        return response()->json($data);
    }

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
                            'inventory_quantity' => $variant->quantity,
//                "fulfillment_service" => common::getInventoryManager(),
//                'inventory_management' => common::getInventoryManager(),
                            'grams' => (is_null($request->weight)) ? 0.0 : $request->weight * 1000,
                            'weight' => (is_null($request->weight)) ? 0.0 : $request->weight,
                            'weight_unit' => $request->weight_unit,
                            'barcode' => $request->barcode,
                            'taxable' => $request->taxable,
                            'price' => number_format($variant->price, 2),
                            'compare_at_price' => number_format($variant->compare_at_price, 2),
                            'inventory_management' => (($request->inventory_management == "true")) ? 'shopify' : null,
                            'inventory_policy' => (($request->inventory_policy == "true")) ? 'continue' : 'deny',

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

        if(isset($request->product_id)){
            $product_id_get=Product::find($request->product_id);
            $product_get_images=ProductImage::where('shopify_product_id',$product_id_get->shopify_id)->get();

            foreach ($product_get_images as $index=> $product_get_image){
                array_push($images_array, [
                    'alt' => $request->product_name . '_' . $index,
                    'position' => $index  + 1,
                    'src' => $product_get_image->src,
                ]);

                $product_get_image->delete();
            }


        }


        if($request->tags) {
            $tags = $request->tags;
        }else{
            $tags='';
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
                "status"=>  $status
            ]
        ];

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
            $product->product_status = 'Approved';
        }
        $product->type='Normal';

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
            $variant->old_inventory_quantity = $product_variant->old_inventory_quantity;
            $variant->save();
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
            $product_image=new ProductImage();
            $product_image->shop_id=$session->id;
            $product_image->shopify_product_id=$image->product_id;
            $product_image->position=$image->position;
            $product_image->src=$image->src;
            $product_image->save();
        }





        $user=User::where('email',$request->seller_email)->first();
        if($user) {
            $collect_product = $client->post('/collects.json', [
                'collect' => [
                    'collection_id' => $user->collection_id,
                    'product_id' => $response->id,
                ]
            ]);

            $collect_product = $collect_product->getDecodedBody();

            if (!isset($collect_product['errors'])) {
                $product->collect_id = $collect_product['collect']['id'];
                $product->user_id = $user->id;
                $product->seller_email = $user->email;
                $product->save();
            }
        }
        $data = [
            'message' => 'Product Created Successfully',
        ];
        return response()->json($data);


    }
}
