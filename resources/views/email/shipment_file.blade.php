<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Shipment</title>
    <style>
        /* Add any custom styles here */
    </style>
</head>

<body>

<p>Dear recipient,</p>

<p>This email contains an Information of Shipment of {!! $details['name'] !!}  Vendor. Please find the details below:</p>

<p><strong>Name:</strong> {!! $details['name'] !!}</p>
<p><strong>Email:</strong> {!! $details['email'] !!}</p>
<p><strong>Store Name:</strong> {!! $details['store_name'] !!}</p>

<p><strong>Courier:</strong> {!! $details['courier'] !!}</p>
<p><strong>Tracking Number:</strong> {!! $details['tracking_number'] !!}</p>
<p><strong>Comment:</strong> {!! $details['comment'] !!}</p>

<br>

<p>Thank you </p>



</body>

</html>


