<?php

namespace App\Http\Middleware;

use App\Models\Email;
use App\Models\MailSmtpSetting;
use App\Models\Product;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class SmtpEmailMiddlware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $product=Product::find($request->id);
        if($product){
            $smtp_setting=MailSmtpSetting::where('shop_id',$product->shop_id)->first();
            if($smtp_setting){

                    Config::set('mail.mailers.smtp.host',isset($smtp_setting->smtp_host)?($smtp_setting->smtp_host):'smtp.mailgun.org');
                    Config::set('mail.mailers.smtp.port',isset($smtp_setting->smtp_post)?($smtp_setting->smtp_post):587);
                    Config::set('mail.mailers.smtp.username',isset($smtp_setting->smtp_mail)?($smtp_setting->smtp_mail):null);
                    Config::set('mail.mailers.smtp.password',isset($smtp_setting->smtp_password)?($smtp_setting->smtp_password):null);
                    Config::set('mail.from.address',isset($smtp_setting->set_form)?($smtp_setting->set_form):'info@tetralogicx.com');
                    Config::set('mail.from.name',isset($smtp_setting->sender_name)?($smtp_setting->sender_name):'Example');
//            dd(Config::get('mail.from.name'));

            }
        }






        return $next($request);
    }
}
