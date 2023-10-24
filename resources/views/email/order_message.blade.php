<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome Email</title>
</head>
<body>

<h3 style="text-align: center;">Order Detail</h3>
<table border="1" cellpadding="10" cellspacing="0" align="center" style="border-collapse: collapse; width: 80%; margin: 0 auto;">
    <thead>
    <tr>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">No</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Product Name</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">SKU</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Quantity</th>
    </tr>
    </thead>
    <tbody>
    @foreach($details['message'] as $index => $product)
        <tr>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">{{ ++$index }}</td>
            <td style="border: 1px solid #ddd; padding: 10px;">{{ $product['product_name'] }}</td>
            <td style="border: 1px solid #ddd; padding: 10px;">{{ $product['sku'] }}</td>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">{{ $product['quantity'] }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

</body>
</html>
