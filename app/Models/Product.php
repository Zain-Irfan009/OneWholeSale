<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public function hasVariantsCount(){
        return $this->hasMany('App\Models\Variant', 'shopify_product_id', 'shopify_id')
            ->selectRaw('shopify_product_id, sum(quantity) as total_quantity')
            ->groupBy('shopify_product_id');
    }
}
