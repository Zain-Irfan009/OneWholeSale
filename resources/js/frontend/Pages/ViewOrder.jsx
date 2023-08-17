import React, { useState, useCallback, useEffect, useContext } from "react";
import {
    Page,
    Layout,
    Card,
    Scrollable,
    Text,
    Stack,
    Icon,
    Toast,
    Loading,
    List,
    Banner,
    Avatar,
    Badge,
    TextField,
} from "@shopify/polaris";
import { ExternalMinor } from "@shopify/polaris-icons";
import { SkeltonPageForTable } from '../components/global/SkeltonPage'
import { CustomBadge } from '../components/Utils/CustomBadge'
import { AppContext } from '../components/providers/ContextProvider'
// import { useAuthState } from "../../components/providers/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {getAccessToken} from "../assets/cookies";



export function ViewOrder() {


    // let data=[
    //     {
    //         id:1,
    //         title:"1000ml Classic Refill Bubbles",
    //         quantity:"1",
    //         price:"5.99",
    //         image:"https://cdn.shopify.com/s/files/1/0608/1983/3070/products/277_103.663500_-Extra_Classic_Refill18.png?v=1674566261"
    //
    //
    //     }
    // ]


    let data1=
        {
            oldCurrencyCode:"Rs.",
            oldDiscountedValue:"0.00",

        }


        let cart_data=

                {
                    oldThankYouPageData:[
                        {
                    countryName:"Pakistan",
                    stateName:"Punjab",
                    billingCountryName:"James",
                billingStateName:"Noida",
                 paymentMethod:"cash",
                  discountValue:0,
                    discountCode:null,
                    subTotal:5.99,
                    taxValue:"Rs. 10.00",
                    taxTotal:10,
                    totalValue:2025.99,
                    localCurrency:"PKR",
                    localRate:1,
                    shippingName:"test",
                    shippingDescription:null,
                    shippingValue:"2000"
}
]
                }

    const params = useParams();
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [toggleLoadData, setToggleLoadData] = useState(true);
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const [abandonedCheckout, setAbandonedCheckout] = useState(data1);
    const [lineItems, setLineItems] = useState([]);
    const [orderSellers, setOrderSellers] = useState([]);
    const [cartPrices, setCartPrices] = useState(cart_data);
    const [shippingDetails, setShippingDetails] = useState();
    const [billingDetails, setBillingDetails] = useState();
    const [subtotalPrice, setSubtotalPrice] = useState();
    const [totalTax, setTotalTax] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const [sellerName, setSellerName] = useState();
    const [shopName, setShopName] = useState();
    const [email, setEmail] = useState();
    const [totalOrderCommission, setTotalOrderCommission] = useState('');
    const [totalAdminEarning, setTotalAdminEarning] = useState('');
    const [orderCreateDate, setOrderCreateDate] = useState();
    const [orderStatus, setOrderStatus] = useState();
    const [paymentStatus, setPaymentStatus] = useState();
    const [customerName, setCustomerName] = useState();
    const [customerEmail, setCustomerEmail] = useState();
    const [shippingName, setShippingName] = useState();
    const [shippingAddress, setShippingAddress] = useState();
    const [shippingCity, setShippingCity] = useState();
    const [shippingZip, setShippingZip] = useState();
    const [shippingCountry, setShippingCountry] = useState();
    const [orderNum, setOrderNum] = useState();
    const [orderDate, setOrderDate] = useState();
    const [totalItems, setTotalItems] = useState();

    const [billingName, setBillingName] = useState();
    const [billingAddress, setBillingAddress] = useState();
    const [billingCity, setBillingCity] = useState();
    const [billingZip, setBillingZip] = useState();
    const [billingCountry, setBillingCountry] = useState();


    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(
        () => setErrorToast((errorToast) => !errorToast),
        []
    );
    const toggleSuccessMsgActive = useCallback(
        () => setSucessToast((sucessToast) => !sucessToast),
        []
    );

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    function convertBooleanToNumber(value) {
        let booleanValue;
        if (value === true) {
            booleanValue = 1;
        } else {
            booleanValue = 0;
        }

        return booleanValue;
    }

    const formatDate = (created_at) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const date = new Date(created_at);
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        const formattedDate = `${monthName} ${day}, ${year}`;
        return formattedDate;
    }


    const getOrderData = async (id) => {
        const sessionToken = getAccessToken();
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/view-order/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            console.log(response?.data?.order_sellers)
            setSubtotalPrice(response?.data?.order?.subtotal_price)
            setTotalTax(response?.data?.order?.total_tax)
            setTotalPrice(response?.data?.order?.total_price)
            // setSellerName(response?.data?.order?.user_name)
            // setShopName(response?.data?.order?.seller_shopname)
            setLineItems(response?.data?.line_items)
            setOrderSellers(response?.data?.order_sellers)




            // setEmail(response?.data?.order?.user_email)
            setTotalOrderCommission(response?.data?.order_commission)
            setTotalAdminEarning(response?.data?.admin_earning)
            setOrderNum(response?.data?.order?.order_number)
            setOrderDate(response?.data?.date)
            setTotalItems(response?.data?.total_items)
           let format_date= formatDate(response?.data?.order?.created_at)
                setOrderCreateDate(format_date)

            setOrderStatus(response?.data?.order?.fulfillment_status)
            setPaymentStatus(response?.data?.order?.financial_status)
            setCustomerName(response?.data?.order?.first_name+' ' +response?.data?.order?.last_name)
            setCustomerEmail(response?.data?.order?.email)
            setShippingName(response?.data?.order?.shipping_name)
            setShippingAddress(response?.data?.order?.address1)
            setShippingCity(response?.data?.order?.city)
            setShippingZip(response?.data?.order?.zip)
            setShippingCountry(response?.data?.order?.country)
            setBillingName(response?.data?.order?.billing_shipping_name)
            setBillingAddress(response?.data?.order?.billing_address1)
            setBillingCity(response?.data?.order?.billing_city)
            setBillingZip(response?.data?.order?.billing_zip)
            setBillingCountry(response?.data?.order?.billing_country)


            setLoading(false)
            // setCustomers(response?.data)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
console.log('eror',error)
            setLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

    };

    function convertNumberToBoolean(value) {
        let booleanValue;
        if (value === 1) {
            booleanValue = true;
        } else {
            booleanValue = false;
        }
        return booleanValue;
    }



    useEffect(() => {
console.log('check',cartPrices)
        if (toggleLoadData) {
            // abandonedCheckoutDetail(params.abandonedCheckoutId);
        }
    }, [toggleLoadData]);


    useEffect(() => {
        getOrderData(params.order_id);

    }, []);

    useEffect(() => {
        console.log('orderSellers',orderSellers)

    }, [orderSellers]);


    const discardAbandonedCheckout = () => {
        navigate("/orderslisting");
    };

    return (
        <div className="Discount-Detail-Page Abandoned-Checkout-Detail-Page">
            {loading ? (
                <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
            ) : (
                <Page
                    breadcrumbs={[
                        {
                            content: "Abandoned Checkout",
                            onAction: discardAbandonedCheckout,
                        },
                    ]}
                    title={orderNum}
                    // subtitle={dateFormat(
                    //     abandonedCheckout?.created_at,
                    //     "mmmm d, yyyy 'at' h:MM tt"
                    // )}
                    subtitle={
                       orderDate
                    }

                      // primaryAction={{
                      //   content: "Save discount",
                      //   onAction: handleUpdateDiscount,
                      //   loading: btnLoading[1],
                      // }}
                >

                    <Layout>
                        <Layout.Section>
                            <Card title="Order Details">
                                <Card.Section>
                                    <Scrollable
                                        style={{
                                            height: lineItems?.length == 1 ? "75px" : "225px",
                                        }}
                                    >
                                        {lineItems?.map((item) => {
                                            return (
                                                <div className="Order-Product-Details" key={item.id}>
                                                    <Stack>
                                                        <div className="Order-Product-Image-Section">
                                                            <div className="Order-Product-Image">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                />
                                                            </div>

                                                            <div className="Order-Quantity">
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="Order-Product-Detail-Section">
                                                            <div className="Product-Title-Section">
                                                                <h2 className="Product-Title">{item.title}</h2>
                                                                <h2 className="Product-Title">
                                                                    {abandonedCheckout?.oldCurrencyCode}
                                                                    {item.price && Number(item.price).toFixed(2)}
                                                                </h2>
                                                            </div>
                                                            {/* <h2 className='Product-Extras'>Old</h2> */}
                                                        </div>
                                                    </Stack>
                                                </div>
                                            );
                                        })}
                                    </Scrollable>
                                </Card.Section>

                                    <Card.Section>
                                        <div className="Paid-Section">
                                            {abandonedCheckout?.oldDiscountCode && (
                                                <div className="Paid-SubTotal">
                                                    <Stack>
                                                        <p>Discount</p>
                                                        <p>{abandonedCheckout?.oldDiscountCode}</p>
                                                        <p>
                                                            - {abandonedCheckout?.oldCurrencyCode}{" "}
                                                            {abandonedCheckout?.oldDiscountedValue}
                                                        </p>
                                                    </Stack>
                                                </div>
                                            )}
                                            <div className="Paid-SubTotal">
                                                <Stack>
                                                    <p>SubTotal</p>
                                                    <p>
                                                        {totalItems > 1 ? `${totalItems} items` : `${totalItems} item`}
                                                    </p>
                                                    <p>
                                                        {abandonedCheckout?.oldCurrencyCode}{" "}
                                                        {subtotalPrice}
                                                    </p>
                                                </Stack>
                                            </div>

                                            <div className="Paid-SubTotal">
                                                <Stack>
                                                    <p>Tax</p>
                                                    <p>{cartPrices?.shippingName}</p>
                                                    <p>
                                                        {abandonedCheckout?.oldCurrencyCode}
                                                        {totalTax}
                                                    </p>
                                                </Stack>
                                            </div>

                                            {/*<div className="Paid-SubTotal">*/}
                                            {/*    <Stack>*/}
                                            {/*        <p>Shipping</p>*/}
                                            {/*        <p>{cartPrices?.shippingName}</p>*/}
                                            {/*        <p>*/}
                                            {/*            {abandonedCheckout?.oldCurrencyCode}*/}
                                            {/*            {2000.00}*/}
                                            {/*        </p>*/}
                                            {/*    </Stack>*/}
                                            {/*</div>*/}

                                            {/*    <div className="Paid-Tax">*/}
                                            {/*        <Stack>*/}
                                            {/*            <p>Estimated tax</p>*/}
                                            {/*            <p>*/}
                                            {/*                {abandonedCheckout?.oldCurrencyCode}{" "}*/}
                                            {/*                {10.00}*/}
                                            {/*            </p>*/}
                                            {/*        </Stack>*/}
                                            {/*    </div>*/}

                                            <div className="Paid-Total">
                                                <Stack>
                                                    <p>Total</p>
                                                    <p>
                                                        {abandonedCheckout?.oldCurrencyCode}{" "}
                                                        {totalPrice}
                                                    </p>
                                                </Stack>
                                            </div>

                                            <div className="Paid-By">
                                                <Stack>
                                                    <p>To be paid by customer</p>
                                                    <p>
                                                        {abandonedCheckout?.oldCurrencyCode}{" "}
                                                        {totalPrice}
                                                    </p>
                                                </Stack>
                                            </div>
                                        </div>
                                    </Card.Section>

                            </Card>

                            {orderSellers?.map((item) => {
                                return (
                                <div className="seller_detail_div">
                                    <Card title="Seller Details">

                                        <Card.Section>
                                            <div className="order_detail_status">
                                                <Text variant="headingXs" as="h6">
                                                    Here are seller details
                                                </Text>

                                                <p className="order_status_p seller_status">
                                                    Seller Name -<span
                                                    className="order_status_span"> {item.name}</span>
                                                </p>
                                                <p className="order_status_p">
                                                    Seller Shop Name -<span
                                                    className="order_status_span">  {item.seller_shopname}</span>
                                                </p>
                                                <p className="order_status_p">
                                                    Seller Email -<span className="order_status_span"> {item.email}</span>
                                                </p>
                                            </div>

                                        </Card.Section>

                                    </Card>
                                </div>
                                )
                            })}
                            <div className="seller_detail_div">
                                <Card title="Seller Earning">

                                    <Card.Section>
                                        <div className="order_detail_status">
                                            <Text variant="headingXs" as="h6">
                                                Here is earning of seller.
                                            </Text>

                                            {/*<p className="order_status_p seller_status">*/}
                                            {/*    Product Earning -<span className="order_status_span">  $26.24</span>*/}
                                            {/*</p>*/}
                                            {/*<p className="order_status_p">*/}
                                            {/*    Shipping Charge Earning -<span className="order_status_span">   $0.00</span>*/}
                                            {/*</p>*/}
                                            {/*<p className="order_status_p">*/}
                                            {/*    Tax Charge Earning -<span className="order_status_span">   $0.00</span>*/}
                                            {/*</p>*/}
                                            {/*<p className="order_status_p">*/}
                                            {/*Tip Charge Earning -<span className="order_status_span">   $0.00</span>*/}
                                            {/*  </p>*/}
                                            <p className="order_status_p">
                                            Total Order Commission -<span className="order_status_span">   ${totalOrderCommission}</span>
                                              </p>

                                            <p className="order_status_p">
                                                Total Admin Earning -<span className="order_status_span">   ${totalAdminEarning}</span>
                                            </p>
                                        </div>

                                    </Card.Section>

                                </Card>
                            </div>
                        </Layout.Section>


                        <Layout.Section oneThird>
                                <Card>
                                    <Card.Section title="Current Order Status">
                                        <div className="order_detail_status">
                                        <h2 className="order_status_heading">Here is current status of order.</h2>
                                        <p className="order_status_p">
                                            Ordered On : <span className="order_status_span">{orderCreateDate}   </span>
                                        </p>
                                            {/*<p className="order_status_p">*/}
                                            {/*    Delivery Method - <span className="order_status_span">   Standard shipping</span>*/}
                                            {/*</p>*/}
                                            <p className="order_status_p">
                                                Order Status : <span className="order_status_span">    <Badge status='critical'>{!orderStatus ? 'Unfulfilled' : orderStatus}</Badge></span>
                                            </p>
                                            <p className="order_status_p">
                                                Payment Status : <span className="order_status_span">    <Badge status='success'>{paymentStatus}</Badge></span>
                                            </p>



                                        </div>
                                    </Card.Section>

                                    <Card.Section title="Customer">
                                        <p>
                                            {customerName}
                                        </p>
                                        <p>{customerEmail}</p>
                                    </Card.Section>

                                    <Card.Section title="Shipping address">
                                        <p>
                                            {shippingName}
                                        </p>
                                        <p> {shippingAddress }</p>
                                        <p>
                                            {shippingCity}
                                            {shippingZip}
                                        </p>
                                        <p>{shippingCountry}</p>
                                    </Card.Section>

                                    <Card.Section title="Billing address">

                                                <p>
                                                    {billingName}
                                                </p>
                                        <p> {billingAddress}</p>
                                                <p>
                                                    {billingCity}
                                                    {billingZip}
                                                </p>
                                        <p> {billingCountry}</p>


                                    </Card.Section>
                                </Card>
                        </Layout.Section>
                    </Layout>
                </Page>
            )}
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
