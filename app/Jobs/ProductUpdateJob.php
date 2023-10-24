<?php

namespace App\Jobs;

use App\Models\CsvImport;
use App\Models\log;
use App\Models\Option;
use App\Models\Product;
use App\Models\ProductHistory;
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
use Illuminate\Support\Carbon;
use Shopify\Clients\Rest;

class ProductUpdateJob implements ShouldQueue
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

        $product=$this->data;
        $shop=$this->shop;
        $shop = Session::where('shop',$shop)->first();

//        $logs=new log();
//        $logs->log=json_encode($product);
//        $logs->verify='product queue job';
//        $logs->save();
//
//        $product=json_decode(json_encode($product));
//
//        $logs=new log();
//        $logs->log=$product->id;
//        $logs->verify='product queue job id';
//        $logs->save();

        $p = Product::where('shopify_id', $product->id)->where('shop_id',$shop->id)->first();
        $flag=0;
        if ($p === null) {
            $flag=1;
            $p = new Product();
            $product_history=new ProductHistory();
            $product_history->product_shopify_id=$product->id;
            $product_history->shop_id=$shop->id;
            $product_history->product_name=$product->title;
            $product_history->status=$product->status;
            $product_history->date=Carbon::now();
            $product_history->save();

        }
        $search_engine_meta_description=strip_tags($product->body_html);
        $search_engine_meta_description = preg_replace("/\s+/", " ", $search_engine_meta_description);
        $p->shop_id=$shop->id;
        $p->shopify_id=$product->id;
        $p->product_name=$product->title;
        $p->description=$product->body_html;
        $p->tags=$product->tags;
        $p->product_type=$product->product_type;
        $p->vendor=$product->vendor;
        $p->status=$product->status;
        $p->price=$product->variants[0]->price;
        $p->quantity=$product->variants[0]->inventory_quantity;
//        $p->vape_seller ='No';
//        $p->excise_tax = 0;
        $p->search_engine_title=$product->title;
        $p->search_engine_meta_description=$search_engine_meta_description;
        $p->type='Normal';
        if($flag==1) {
            $p->product_status = 'Approval Pending';
        }
        if ($product->images) {
            $image = $product->images[0]->src;
        } else {
            $image = '';
        }
        $p->featured_image=$image;
        $p->save();




        $logs=new log();
        $logs->log=json_encode($product->variants);
        $logs->verify='product update trigger';
        $logs->save();


        Variant::where('shopify_product_id',$product->id)->delete();

        if(count($product->variants) >= 1) {
            foreach ($product->variants as $product_variant) {
                $v_image_check = ProductImage::where('shopify_image_id', $product_variant->image_id)->where('shopify_product_id',$product->id)
                    ->first();

                $v_image_src = null;
                if ($v_image_check) {
                    $v_image_src = $v_image_check->src;
                }
                $v = Variant::where('shopify_id', $product_variant->id)->where('shopify_product_id',$product->id)->where('shop_id',$shop->id)->first();
                $v_count = Variant::where('shopify_id',$product_variant->id)->where('shopify_product_id',$product->id)->where('shop_id',$shop->id)->count();

                if ($v_count == 0) {
                    $v = new Variant();
                }

                $v->shop_id = $shop->id;
                $v->shopify_product_id = $product->id;
                $v->shopify_id = $product_variant->id;
                $v->title = $product_variant->title;
                $v->price = $product_variant->price;
                $v->sku = $product_variant->sku;
                $v->position = $product_variant->position;
                $v->inventory_policy = $product_variant->inventory_policy;
                $v->compare_at_price = $product_variant->compare_at_price;
                $v->inventory_management = $product_variant->inventory_management;
                $v->option1 = $product_variant->option1;
                $v->option2 = $product_variant->option2;
                $v->option3 = $product_variant->option3;
                $v->taxable = $product_variant->taxable;
                $v->barcode = $product_variant->barcode;
                $v->grams = $product_variant->grams;
                $v->weight = $product_variant->weight;
                $v->weight_unit = $product_variant->weight_unit;
                $v->inventory_item_id = $product_variant->inventory_item_id;
                $v->quantity = $product_variant->inventory_quantity;
                $v->product_image_id = $product_variant->image_id;
                $v->old_inventory_quantity = $product_variant->old_inventory_quantity;
                $v->src = $v_image_src;
                $v->save();

            }
        }
        if(count($product->options) >= 1) {
            foreach ($product->options as $product_option) {
                $option=Option::where('shopify_product_id',$product->id)->where('shopify_id',$product_option->id)->first();
                $option_count = Option::where('shopify_product_id', $product->id)->where('shopify_id', $product_option->id)->count();
                if ($option_count == 0) {
                    $option = new Option();
                }
                $option->shop_id = $shop->id;
                $option->shopify_product_id = $product_option->product_id;
                $option->shopify_id = $product_option->id;
                $option->name = $product_option->name;
                $option->position = $product_option->position;
                $option->values = implode(',', $product_option->values);
                $option->save();
            }
        }
        if(count($product->images) >= 1) {
            foreach ($product->images as $image) {
                $product_image = ProductImage::where('shop_id', $shop->id)->where('shopify_image_id', $image->id)->first();
                $product_image_count = ProductImage::where('shop_id', $shop->id)->where('shopify_image_id', $image->id)->count();
                if ($product_image_count == 0) {
                    $product_image = new ProductImage();
                }
                $product_image->shop_id = $shop->id;
                $product_image->shopify_image_id = $image->id;
                $product_image->shopify_product_id = $image->product_id;
                $product_image->position = $image->position;
                $product_image->src = $image->src;
                $product_image->save();
            }
        }
    }
}
