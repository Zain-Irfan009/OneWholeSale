<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProductPushJob;
use App\Mail\SendMail;
use App\Models\CsvImport;
use App\Models\MailConfiguration;
use App\Models\MailSmtpSetting;
use App\Models\Option;
use App\Models\Product;
use App\Models\ProductHistory;
use App\Models\ProductImage;
use App\Models\Session;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Shopify\Clients\Rest;
use Vtiful\Kernel\Excel;

class ProductController extends Controller
{
    public function Products(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        if($session){
            $products=Product::where('shop_id',$session->id)->orderBy('id','Desc')->paginate(20);

            $data = [
                'products'=>$products,
                'currency'=>$session->money_format,
            ];

            return response()->json($data);
        }
    }


    public function ProductView(Request $request,$id){

        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $product=Product::where('id',$id)->first();
        $variants = Variant::where('shopify_product_id', $product->shopify_id)->get();
        $selected_variant=Variant::select('title','price','quantity','sku','compare_at_price')->where('shopify_product_id', $product->shopify_id)->get();
        $options=Option::where('shopify_product_id',$product->shopify_id)->get();
        $product_images=ProductImage::where('shopify_product_id',$product->shopify_id)->get();

        $data = [
            'product'=>$product,
            'variants'=>$variants,
            'options'=>$options,
            'product_images'=>$product_images,
            'selected_variant'=>$selected_variant,
            'currency'=>$shop->money_format,

        ];

        return response()->json($data);

    }

    public function AddProduct(Request $request){

        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();

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

        if ($variant->title != null) {

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
    }
}
    else{

        array_push($variants_array, [
            'price' => $request->product_price,
            'inventory_quantity' => $request->product_quantity,
            'compare_at_price' => $request->product_compare_at_price,
            'sku' => $request->product_sku,
            'barcode' => $request->barcode,
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
        $filename = now()->format('YmdHi') . str_replace([' ', '(', ')'], '-', $image->getClientOriginalName());
        $image->move($destinationPath, $filename);
        $filename = (asset('productimages/' . $filename));


        array_push($images_array, [
            'alt' => $request->product_name . '_' . $index,
            'position' => $index + 1,
            'src' => $filename,
        ]);


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

        if($request->status=="true"){
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

    public function EditProduct(Request $request,$id){

        $session=Session::where('shop',$request->shop)->first();
        if($session){
            $product=Product::find($id);
            if($product){
                $variants=Variant::where('shopify_product_id',$product->shopify_id)->get();
                $options=Option::where('shopify_product_id',$product->shopify_id)->get();
                $data = [
                    'product'=>$product,
                    'variants'=>$variants,
                    'options'=>$options,
                    'currency'=>$session->money_format,
                ];
                return response()->json($data);
            }
        }
    }


    public function UpdateProductStatus(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $client = new Rest($session->shop, $session->access_token);
        if($session){
            $product=Product::find($request->id);
            if($product){

                if($request->product_status=='Deny & Delete'){
                    $product_api = $client->delete( '/products/' . $product->shopify_id . '.json');
                   $product_api=$product_api->getDecodedBody();
                   if(!isset($product_api['errors'])){

                       Option::where('shopify_product_id',$product->shopify_id)->delete();
                       Variant::where('shopify_product_id',$product->shopify_id)->delete();
                       ProductImage::where('shopify_product_id',$product->shopify_id)->delete();
                      $product->delete();
                       $data = [
                           'message' => 'Product Deleted Successfully',
                       ];
                   }
                }else{

                    if($request->product_status=='Disabled'){
                        $status='draft';
                    }else{
                        $status='active';
                    }
                    $product_data=[
                        'product'=>[
                            'status'=>$status
                        ]
                    ];
                    $this->SendMail($product,$request->product_status);

                    $product_status_update=$client->put( '/products/' . $product->shopify_id . '.json',$product_data);
                    $product_status_update=$product_status_update->getDecodedBody();

                    if(!isset($product_status_update['errors'])){
                        $product->product_status=$request->product_status;
                        $product->status=$product_status_update['product']['status'];
                        $product->save();

                        $product_history=new ProductHistory();
                        $product_history->product_shopify_id=$product_status_update['product']['id'];
                        $product_history->shop_id=$session->id;
                        $product_history->product_name=$product_status_update['product']['title'];
                        $product_history->status=$product_status_update['product']['status'];
                        $product_history->date=Carbon::now();
                        $product_history->save();


                        $this->SendMail($product,$request->product_status);


                        $data = [
                            'message' => 'Status Changed Successfully',
                        ];
                    }

                }
            }
        }
        return response()->json($data);
    }

    public function ReassignSeller(Request $request){

        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $client = new Rest($session->shop, $session->access_token);
        if($session){

            $product=Product::find($request->id);

            if($product){

                $user=User::where('email',$request->email)->first();
                if($user){

                    $delete_collect_product = $client->delete('/collects/'.$product->collect_id.'.json');
                    $delete_collect_product = $delete_collect_product->getDecodedBody();
                    if(!isset($delete_collect_product['errors'])) {

                        $collect_product = $client->post('/collects.json', [
                            'collect' => [
                                'collection_id'=>$user->collection_id,
                                'product_id'=>$product->shopify_id
                            ]
                        ]);
                    }


                    $collect_product = $collect_product->getDecodedBody();

                    if(!isset($collect_product['errors'])) {

                        $product->user_id = $user->id;
                        $product->seller_email = $user->email;
                        $product->seller_name = $user->name;
                        $product->collect_id = $collect_product['collect']['id'];
                        $product->save();

                        $data = [
                            'message' => 'Product Assigned Successfully',
                        ];
                    }else{
                        $data = [
                            'message' => $collect_product['errors']['product_id'][0],
                        ];
                        return response()->json($data,422);
                    }
                }else{
                    return response()->json([
                        'message' => 'This Email Seller Not Found',
                    ],422);
                }
            }
        }
        return response()->json($data);
    }

    public function DeleteProduct(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $client = new Rest($session->shop, $session->access_token);
        if($session){
            $product=Product::find($request->id);
            if($product){
                $product_api = $client->delete( '/products/' . $product->shopify_id . '.json');
                $product_api=$product_api->getDecodedBody();
                if(!isset($product_api['errors'])){

                    Option::where('shopify_product_id',$product->shopify_id)->delete();
                    Variant::where('shopify_product_id',$product->shopify_id)->delete();
                    ProductImage::where('shopify_product_id',$product->shopify_id)->delete();
                    $product->delete();
                    $data = [
                        'message' => 'Product Deleted Successfully',
                    ];
                }
            }
        }
        return response()->json($data);
    }

    public function ProductFilter(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop){
            if($request->status==0){
                $products=Product::where('shop_id',$shop->id)->get();
            }else if($request->status==1){
                $status='Approval Pending';
                $products=Product::where('product_status',$status)->where('shop_id',$shop->id)->get();
            }
            else if($request->status==2){
                $status='Approved';
                $products=Product::where('product_status',$status)->where('shop_id',$shop->id)->get();
            }
            else if($request->status==3){
                $status='Disabled';
                $products=Product::where('product_status',$status)->where('shop_id',$shop->id)->get();
            }
            if(count($products) > 0){
                $data = [
                    'products'=>$products
                ];
                return response()->json($data);
            }
        }
    }

    public function UpdateProductStatusMultiple(Request $request){
        $session=Session::where('shop',$request->shop)->first();
        $client = new Rest($session->shop, $session->access_token);
        foreach ($request->product_ids as $product_id) {
            if ($session) {
                $product = Product::find($product_id);
                if ($product) {
                    $product->product_status = $request->product_status;
                    $product->save();

                }
            }
        }
        $data = [
            'message' => 'Status Changed Successfully',
        ];
        return response()->json($data);
    }

    public function SendMail($product,$status){

            if($status=='Approved'){
                $type='Product Approve';
        $user=User::find($product->user_id);

        $shop=Session::find($product->shop_id);
        $mail_configuration=MailConfiguration::where('shop_id',$product->shop_id)->first();
        if($user) {
            if ($mail_configuration && $mail_configuration->product_approval_status == 1) {
                $Setting = MailSmtpSetting::where('shop_id', $shop->id)->first();
                $details['subject'] = 'Product Approved';
                $details['name'] = $user->name;
                $details['body'] = 'This is for testing email using smtp.';
                $details['shop_id'] = $product->shop_id;
                $details['product_name'] = $product->product_name;
                $details['shop_name'] = $shop->shop;

                Mail::to($user->email)->send(new SendMail($details, $Setting, $type));
            }
        }
        }
    }

    public function ExportProduct(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        $products=Product::where('shop_id',$shop->id)->get();

        $name = 'Product-' . time() . '.csv';
        $file = fopen(public_path($name), 'w+');

        // Add the CSV headers
        fputcsv($file, ['Product Name','Seller Name', 'Status']);
        foreach ($products as $product){

            fputcsv($file, [
                $product->product_name,
                $product->seller_name,
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

    public function importCSV(Request $request)
    {
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();

        $file = $request->file('csv_file');

        // dd($file);
        $filename = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $tempPath = $file->getRealPath();
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType();

        // Valid File Extensions
        $valid_extension = array("csv");

        // 2MB in Bytes
        $maxFileSize = 2097152;

        // Check file extension
        if (in_array(strtolower($extension), $valid_extension)) {

            // Check file size
            if ($fileSize <= $maxFileSize) {

                // File upload location
                $location = 'csv-file';

                // Upload file
                $file->move($location, $filename);

                // Import CSV to Database
                $filepath = public_path($location . "/" . $filename);

                // Reading file
                $file = fopen($filepath, "r");

                $importData_arr = array();
                $i = 0;

                while (($filedata = fgetcsv($file, 1000, ",")) !== FALSE) {
                    $num = count($filedata);

                    // Skip first row (Remove below comment if you want to skip the first row)
                    if ($i == 0) {
                        $i++;
                        continue;
                    }
                    for ($c = 0; $c < $num; $c++) {
                        $importData_arr[$i][] = $filedata [$c];
                    }
                    $i++;
                }
                fclose($file);

                // Insert to MySQL database
                foreach ($importData_arr as $importData) {

                    $insertData = array(
                        "shop_id"=>$shop->id,
                        "product_id"=>$importData[0],
                        "title" => $importData[1],
                        "description" => $importData[2],
                        "seller_email" => $importData[3],
                        "type" => $importData[4],
                        "tags" => $importData[5],
                        "option_name1" => $importData[6],
                        "option_value1" => $importData[7],
                        "option_name2" => $importData[8],
                        "option_value2" => $importData[9],
                        "option_name3" => $importData[10],
                        "option_value3" => $importData[11],
                        "variant_sku" => $importData[12],
                        "variant_grams" => $importData[13],
                        "variant_inventory_tracking" => $importData[14],
                        "variant_quantity" => $importData[15],
                        "variant_price" => $importData[16],
                        "variant_compare_at_price" => $importData[17],
                        "variant_require_shipping" => $importData[18],
                        "variant_barcode" => $importData[19],
                        "collection" => $importData[20],
                        "status" => $importData[21],
                        "inventory_policy" => $importData[22],
                        "image" => $importData[23],
                        "meta_title" => $importData[24],
                        "meta_description" => $importData[25],
                        "vendor_name" => $importData[27],
                        "vendor_store_name" => $importData[28],
                        "product_policy" => $importData[29]

                    );

                CsvImport::create($insertData);
                }

                $p_ids = DB::table('csv_imports')
                    ->where('shop_id', $shop->id)
                    ->where('imported', 0)
                    ->distinct('product_id')
                    ->pluck('product_id')
                    ->all();

                foreach ($p_ids as $p_id){
                    ProductPushJob::dispatch($p_id,$shop);
                }





                return response()->json([
                    'success' => true,
                    'message'=>'Import Successful',

                ]);

            } else {
                return response()->json([
                    'success' => false,
                    'message'=>'error',

                ]);

            }

        } else {
            return response()->json([
                'success' => false,
                'message'=>'error',

            ]);

        }

    }

    public function ImportProducts(Request $request)
    {
        $user = auth()->user();
        $session = Session::where('shop', $user->name)->first();
        if ($session) {
            $products = CsvImport::where('shop_id', $session->id)->groupBy('product_shopify_id')->paginate(20);

            $data = [
                'data' => $products
            ];
            return response()->json($data);
        }
    }


    public function AssignImportProducts(Request $request){

        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $client = new Rest($session->shop, $session->access_token);
        if($session){
            $csv_import=CsvImport::find($request->id);
            $product=Product::where('shopify_id',$csv_import->product_shopify_id)->first();

            if($product){

                $user=User::where('email',$request->email)->first();


                if($user->id==$product->user_id){
                    return response()->json([
                        'message' => 'Product is Already Assigned to this Seller',
                    ],422);
                }
                if($user){

                    $delete_collect_product = $client->delete('/collects/'.$product->collect_id.'.json');
                    $delete_collect_product = $delete_collect_product->getDecodedBody();

                    if(!isset($delete_collect_product['errors']) || $delete_collect_product['errors']=='Not Found' || $delete_collect_product==null) {

                        $collect_product = $client->post('/collects.json', [
                            'collect' => [
                                'collection_id'=>$user->collection_id,
                                'product_id'=>$product->shopify_id
                            ]
                        ]);
                    }

                    $collect_product = $collect_product->getDecodedBody();


                    if(!isset($collect_product['errors'])) {

                        $product->user_id = $user->id;
                        $product->seller_email = $user->email;
                        $product->seller_name = $user->name;
                        $product->collect_id = $collect_product['collect']['id'];
                        $product->save();

                        $csv_import->seller_email=$user->email;
                        $csv_import->vendor_name=$user->name;
                        $csv_import->vendor_store_name=$user->seller_shopname;
                        $csv_import->save();

                        $data = [
                            'message' => 'Product Assigned Successfully',
                        ];
                    }else{
                        $data = [
                            'message' => $collect_product['errors']['product_id'][0],
                        ];
                        return response()->json($data,422);
                    }
                }else{
                    return response()->json([
                        'message' => 'This Email Seller Not Found',
                    ],422);
                }
            }
        }
        return response()->json($data);

    }

    public function SearchImportProducts(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $products=CsvImport::where('title', 'like', '%' . $request->value . '%')->groupBy('product_shopify_id')->get();
        $data = [
            'data' => $products
        ];
        return response()->json($data);
    }

    public function SearchProduct(Request $request){
        $user=auth()->user();
        $session=Session::where('shop',$user->name)->first();
        $products=Product::where('product_name', 'like', '%' . $request->value . '%')->orWhere('seller_name','like', '%' . $request->value . '%')->where('shop_id',$session->id)->get();
        $data = [
            'data' => $products
        ];
        return response()->json($data);
    }



    }
