<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CsvImport extends Model
{
    use HasFactory;

    protected $fillable = ['shop_id','product_id', 'title', 'description','seller_email','type','tags','option_name1','option_value1','option_name2','option_value2','option_name3','option_value3','variant_sku','variant_grams','variant_inventory_tracking','variant_quantity','variant_price','variant_compare_at_price','variant_require_shipping','variant_barcode','collection','status','inventory_policy','meta_title','meta_description','vendor_name','vendor_store_name','product_policy','image'];
}
