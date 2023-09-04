<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionLog extends Model
{
    use HasFactory;

    public function has_order(){
        return  $this->belongsTo('App\Models\Order', 'order_id', 'id');
    }

    public function has_user(){
        return  $this->belongsTo('App\Models\User', 'user_id', 'id');
    }

    public function has_variant(){
        return  $this->belongsTo('App\Models\Variant', 'shopify_variant_id', 'shopify_id');
    }
}
