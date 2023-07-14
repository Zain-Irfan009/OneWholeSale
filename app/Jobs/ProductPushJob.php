<?php

namespace App\Jobs;

use App\Models\CsvImport;
use App\Models\log;
use App\Models\Option;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Session;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Shopify\Clients\Rest;

class ProductPushJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $data;
    public $shop;
    public $timeout = 3600;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data,$shop)
    {
        $this->data=$data;
        $this->shop=$shop;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        $product_id=$this->data;
        $shop=$this->shop;
        $product_records=CsvImport::where('product_id',$product_id)->where('shop_id',$shop->id)->get();
        $product_data_first_record=CsvImport::where('product_id',$product_id)->where('shop_id',$shop->id)->first();
        $session=Session::where('id',$product_data_first_record->shop_id)->first();
        $client = new Rest($session->shop, $session->access_token);
        $options_array = [];
        if ($product_data_first_record->option_name1!='') {
            array_push($options_array,
                [
                    'name' => $product_data_first_record->option_name1,
                ]);
        }
        if ($product_data_first_record->option_name2!='') {
            array_push($options_array, [
                'name' => $product_data_first_record->option_name2,

            ]);
        }
        if ($product_data_first_record->option_name3!='') {
            array_push($options_array, [
                'name' => $product_data_first_record->option_name3,

            ]);
        }

        $variants_array = array();
        foreach ($product_records as $product_record) {
            array_push($variants_array, [

                "option1" => $product_record->option_value1,
                "price" => $product_record->variant_price,
                "sku" => $product_record->variant_sku,
                'inventory_quantity' => $product_record->variant_quantity,
                'compare_at_price' => $product_record->variant_compare_at_price,
                'barcode' => $product_record->variant_barcode,
                'taxable' => true,
                'grams' => $product_record->variant_grams,
                'weight' => $product_record->variant_grams / 1000,
                'weight_unit' => 'kg',
                'inventory_management' => $product_record->variant_inventory_tracking,
                'inventory_policy' => $product_record->inventory_policy,

            ]);
        }

        $tags =$product_data_first_record->tags;
        $collections = $product_data_first_record->collections;



        if($product_data_first_record->status=='Enabled'){
            $status='active';
        }else{
            $status='draft';
        }


        $images_array = array();

        $images=explode(',',$product_data_first_record->image);
        foreach ($images as $index => $image) {

            array_push($images_array, [
                'alt' => $product_data_first_record->title . '_' . $index,
                'position' => $index + 1,
                'src' => $image,
            ]);


        }


        $productdata = [
            "product" => [
                "title" => $product_data_first_record->title,
                "body_html" => $product_data_first_record->description,
//                "metafields_global_description_tag" => $product->metafields_global_description_tag,
                "vendor" => $product_data_first_record->vendor_name,
                "tags" => $tags,
                "product_type" => $product_data_first_record->type,
                "variants" => $variants_array,
                "options" => $options_array,
                "images" => $images_array,
//                "published"=>  $published,
                "status"=>  $status
            ]
        ];

        $response = $client->post('/products.json', $productdata);

        $response=$response->getDecodedBody();


        if (!isset($response['errors'])) {
            $response = $response['product'];

            $response = json_decode(json_encode($response));


            $product = new Product();

            $user = User::where('email', $product_data_first_record->seller_email)->where('role', 'seller')->first();
            $product->shop_id = $session->id;
            $product->shopify_id = $response->id;
            $product->product_name = $response->title;
            $product->description = $response->body_html;
            $product->search_engine_title = $product_data_first_record->meta_title;
            $product->search_engine_meta_description = $product_data_first_record->meta_description;
            $product->seller_email = $product_data_first_record->seller_email;
            if ($user) {
                $product->seller_name = $user->name;
                $product->user_id = $user->id;
            }
            $product->collections = $collections;
            $product->tags = $tags;
            $product->product_type = $product_data_first_record->type;
            $product->vendor = $product_data_first_record->vendor_name;
            $product->status = $response->status;
            $product->price = $response->variants[0]->price;
            $product->quantity = $response->variants[0]->inventory_quantity;
            if ($status == 'draft') {
                $product->product_status = 'Approval Pending';
            } else {
                $product->product_status = 'Approved';
            }
            $product->type = 'Normal';

            if ($response->images) {
                $image = $response->images[0]->src;
            } else {
                $image = '';
            }
            $product->featured_image = $image;
            $product->save();

            $import_csv=CsvImport::where('product_id',$product_id)->update([
                'imported'=>1,
                'product_shopify_id'=>$response->id
                ]);

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

            foreach ($response->options as $product_option) {
                $option = new Option();
                $option->shop_id = $session->id;
                $option->shopify_product_id = $product_option->product_id;
                $option->shopify_id = $product_option->id;
                $option->name = $product_option->name;
                $option->position = $product_option->position;
                $option->values = implode(',', $product_option->values);
                $option->save();
            }

            foreach ($response->images as $image) {
                $product_image = new ProductImage();
                $product_image->shop_id = $session->id;
                $product_image->shopify_product_id = $image->product_id;
                $product_image->position = $image->position;
                $product_image->src = $image->src;
                $product_image->save();
            }

        }

        $user=User::where('email',$product_data_first_record->seller_email)->first();
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
    }
}
