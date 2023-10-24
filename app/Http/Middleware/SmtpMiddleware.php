<?php

namespace App\Http\Middleware;

use App\Models\MailSmtpSetting;
use App\Models\Product;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class SmtpMiddleware
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

        if (is_array($request->id)) {
            $user=User::find($request->id[0]);

        }
        else{
            $user=User::find($request->id);
        }
        if($user){

            $smtp_setting=MailSmtpSetting::where('shop_id',$user->shop_id)->first();

            if($smtp_setting){
                Config::set('mail.mailers.smtp.host',isset($smtp_setting->smtp_host)?($smtp_setting->smtp_host):'smtp.mailgun.org');
                Config::set('mail.mailers.smtp.port',isset($smtp_setting->smtp_port	)?($smtp_setting->smtp_port):587);
                Config::set('mail.mailers.smtp.username',isset($smtp_setting->smtp_username)?($smtp_setting->smtp_username):null);
                Config::set('mail.mailers.smtp.password',isset($smtp_setting->smtp_password)?($smtp_setting->smtp_password):null);
                Config::set('mail.from.address',isset($smtp_setting->email_from)?($smtp_setting->email_from):'info@tetralogicx.com');
                Config::set('mail.from.name',isset($smtp_setting->from_name)?($smtp_setting->from_name):'Example');
//            dd(Config::get('mail.from.name'));

            }
        }else{
            $smtp_setting=MailSmtpSetting::first();
            if($smtp_setting){
                Config::set('mail.mailers.smtp.host',isset($smtp_setting->smtp_host)?($smtp_setting->smtp_host):'smtp.mailgun.org');
                Config::set('mail.mailers.smtp.port',isset($smtp_setting->smtp_port	)?($smtp_setting->smtp_port):587);
                Config::set('mail.mailers.smtp.username',isset($smtp_setting->smtp_username)?($smtp_setting->smtp_username):null);
                Config::set('mail.mailers.smtp.password',isset($smtp_setting->smtp_password)?($smtp_setting->smtp_password):null);
                Config::set('mail.from.address',isset($smtp_setting->email_from)?($smtp_setting->email_from):'info@tetralogicx.com');
                Config::set('mail.from.name',isset($smtp_setting->from_name)?($smtp_setting->from_name):'Example');


            }
        }
        return $next($request);
    }
}
