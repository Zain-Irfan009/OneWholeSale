<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome Email</title>
    <link rel="stylesheet" href="">
</head>
<body>


<p>Hello {!! $details['name'] !!} </p>
<br>
<h4>Order Details</h4>
<br>

<p>{!! $details['message'] !!} Has been sold</p>

<h5>Regards</h5>
<br>
<h5>{!! $details['shop_name'] !!}</h5>




</body>
</html>
