<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Option;
use App\Models\Product;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function Products(Request $request){
        $user=User::find($request->user_id);
        if($user){
            $products=Product::where('user_id',$user->id)->get();
            $data = [
                'products'=>$products
            ];
            return response()->json($data);
        }
    }

    public function ProductFilter(Request $request){
        $user=User::find($request->user_id);
        if($user){
            $products=Product::where('status',$request->status)->where('user_id',$user->id)->get();
            $data = [
                'products'=>$products
            ];
            return response()->json($data);
        }
    }

    public function ProductView(Request $request,$id){
        $user=User::find($request->user_id);
        if($user){
            $product=Product::find($id);
            if($product){
                $variants=Variant::where('shopify_product_id',$product->shopify_id)->get();
                $options=Option::where('shopify_product_id',$product->shopify_id)->get();
                $data = [
                    'product'=>$product,
                    'variants'=>$variants,
                    'options'=>$options,
                ];
                return response()->json($data);
            }
        }

    }


    public function Productdelete(Request $request){
        $user=User::find($request->user_id);
        if($user){
            $product=Product::find($request->product_id);
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
}
