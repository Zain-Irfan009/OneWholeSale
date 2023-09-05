<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome Email</title>
    <link rel="stylesheet" href="">
</head>
<body>
{{--<h2 style="text-align: center;">{!! $details['subject'] !!}</h2>--}}

<?php

$mail_configuration=\App\Models\MailConfiguration::where('shop_id',$details['shop_id'])->first();


$message='Product details

{$product_details}
Regards

{$shop}';
$body_msg = str_replace($message, "" , $mail_configuration->mail_content);

$body = str_replace('{$seller_name}', $details['name'] ,$body_msg);

?>
@if($mail_configuration->mail_header_status==1)
    <div style="background-color:{{$mail_configuration->header_background_color}}">
    <h3 style="text-align:center"><img src="{{asset('1.png')}}"> </h3>
    </div>
        @endif
<p> {!! $body !!} </p>
<br>
<h4>Product Details</h4>
<br>

<p>{!! $details['product_name'] !!} Has been Assigned to you</p>

<h5>Regards</h5>
<br>
<h5>{!! $details['shop_name'] !!}</h5>
<br>

@if($mail_configuration->mail_footer_status==1)
    <div style="background-color:{{$mail_configuration->footer_background_color}}">
        <h3 style="text-align:center">Footer</h3>
    </div>
@endif

</body>
</html>
