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
$body = str_replace('{$product_details}', $details['product_name'] ,$body);
$body = str_replace('{$shop}', $details['shop_name'] ,$body);

?>

<p> {!! $body !!} </p>


</body>
</html>
