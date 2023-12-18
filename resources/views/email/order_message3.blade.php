<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome Email</title>
</head>
<body>


<?php

$mail_configuration=\App\Models\MailConfiguration::where('shop_id',$details['shop_id'])->first();


$message='Order details

{$product_details}
Regards

{$shop}';
$body_msg = str_replace($message, "" , $mail_configuration->order_mail_content);

$body = str_replace('{$seller_name}', $details['name'] ,$body_msg);

$table_html = '<h3 style="text-align: center;">Order Details</h3>';
$table_html .= '<table border="1" cellpadding="10" cellspacing="0" align="center" style="border-collapse: collapse; width: 100%; margin: 0 auto;">';
$table_html .= '<thead>';
$table_html .= '<tr>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Order Id</th>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Order Name</th>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Product Image</th>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Product Name</th>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">SKU</th>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Price</th>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Quantity</th>';
$table_html .= '<th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Sub Total</th>';
$table_html .= '</tr>';
$table_html .= '</thead>';
$table_html .= '<tbody>';
$product_total=0;
foreach($details['message'] as $index => $product) {

    $product_total=$product_total+$product['sub_total'];
    $table_html .= '<tr>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px; text-align: center;">' .$product['order_id'] . '</td>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px; text-align: center;">' .$product['order_number'] . '</td>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px;"><img style="width:70px;" src=' . $product['product_image'] . '></td>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px;">' . $product['product_name'] . '</td>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px;">' . $product['sku'] . '</td>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px;">' .$details['currency'].' '. $product['price'] . '</td>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px; text-align: center;">' . $product['quantity'] . '</td>';
    $table_html .= '<td style="border: 1px solid #ddd; padding: 10px; text-align: center;">' .$details['currency'].' '.$product['sub_total'] . '</td>';
    $table_html .= '</tr>';
}
$table_html .= '</tbody>';
$table_html .= '</table>';

// Append additional information
$table_html .= '<p style="text-align: right;">Order total- ' . $details['currency'] . ' ' . number_format($product_total,2) . '</p>';
$table_html .= '<p style="text-align: right;">Payment Status- ' . $details['financial_status'] . '</p>';

// Replace {$order_details} with the constructed table HTML
$body = str_replace('{$table_data}', $table_html,$body);

$body = str_replace('{$shop}', $details['shop_name'] ,$body);

?>
<p> {!! $body !!} </p>

</body>
</html>
