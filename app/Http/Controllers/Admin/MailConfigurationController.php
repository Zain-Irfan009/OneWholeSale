<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailConfiguration;
use App\Models\MailSmtpSetting;
use App\Models\Session;
use Illuminate\Http\Request;

class MailConfigurationController extends Controller
{

    public function MailConfiguration(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {
            $mail_configuration = MailConfiguration::where('shop_id', $shop->id)->first();
            if ($mail_configuration) {
                $data = [
                    'data' => $mail_configuration
                ];
                return response()->json($data);
            }
        }
    }

    public function MailConfigurationSave(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop){
            $mail_configuration=MailConfiguration::where('shop_id',$shop->id)->first();
            if($mail_configuration==null){
                $mail_configuration=new MailConfiguration();
            }

            $mail_configuration->shop_id=$shop->id;
            $mail_configuration->product_approval_status=$request->product_approval_status;
            $mail_configuration->mail_subject=$request->mail_subject;
            $mail_configuration->mail_content=$request->mail_content;
            $mail_configuration->header_background_color=$request->header_background_color;
            $mail_configuration->footer_background_color=$request->footer_background_color;
            $mail_configuration->mail_header_status=$request->mail_header_status;
            $mail_configuration->mail_footer_status=$request->mail_footer_status;
            $mail_configuration->save();

            $data = [
                'message' => 'Mail Configuration Added Successfully',
                'data' => $mail_configuration
            ];
            return response()->json($data);
        }

    }


    public function MailSmtp(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop) {
            $mail_smtp = MailSmtpSetting::where('shop_id', $shop->id)->first();
            if ($mail_smtp) {
                $data = [
                    'data' => $mail_smtp
                ];
                return response()->json($data);
            }
        }
    }
    public function MailSmtpSettingSave(Request $request){
        $user=auth()->user();
        $shop=Session::where('shop',$user->name)->first();
        if($shop){
            $mail_smtp=MailSmtpSetting::where('shop_id',$shop->id)->first();

            if($mail_smtp==null){
                $mail_smtp=new MailSmtpSetting();
            }

            $mail_smtp->shop_id=$shop->id;
            $mail_smtp->smtp_host=$request->smtp_host;
            $mail_smtp->smtp_username=$request->smtp_username;
            $mail_smtp->smtp_password=$request->smtp_password;
            $mail_smtp->email_from=$request->email_from;
            $mail_smtp->from_name=$request->from_name;
            $mail_smtp->reply_to=$request->reply_to;
            $mail_smtp->smtp_type=$request->smtp_type;
            $mail_smtp->smtp_port=$request->smtp_port;
            $mail_smtp->save();

            $data = [
                'message' => 'Mail SMTP Added Successfully',
                'data' => $mail_smtp
            ];
            return response()->json($data);
        }

    }
}
