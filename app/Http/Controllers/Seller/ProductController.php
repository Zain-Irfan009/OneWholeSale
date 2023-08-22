<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Option;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Session;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Http\Request;

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
}
