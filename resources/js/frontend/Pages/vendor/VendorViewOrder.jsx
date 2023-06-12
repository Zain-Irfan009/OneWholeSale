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
import { SkeltonPageForTable } from '../../components/global/SkeltonPage'
import { CustomBadge } from '../../components/Utils/CustomBadge'
import { AppContext } from '../../components/providers/ContextProvider'
// import { useAuthState } from "../../components/providers/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";



export function VendorViewOrder() {


    let data=[
        {
            id:1,
            title:"1000ml Classic Refill Bubbles",
            quantity:"1",
            price:"5.99",
            product_images:[
                {
                    src:"https://cdn.shopify.com/s/files/1/0608/1983/3070/products/277_103.663500_-Extra_Classic_Refill18.png?v=1674566261"
                }
            ]
        }
    ]


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
    const [lineItems, setLineItems] = useState(data);
    const [cartPrices, setCartPrices] = useState(cart_data);
    const [shippingDetails, setShippingDetails] = useState();
    const [billingDetails, setBillingDetails] = useState();

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

    function convertNumberToBoolean(value) {
        let booleanValue;
        if (value === 1) {
            booleanValue = true;
        } else {
            booleanValue = false;
        }
        return booleanValue;
    }

    // const abandonedCheckoutDetail = async (id) => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(
    //             `${apiUrl}/api/abundant-checkout-view/${id}`,
    //             {
    //                 headers: { Authorization: `Bearer ${getAccessToken()}` },
    //             }
    //         );
    //
    //         console.log(
    //             "AbandonedCheckoutDetail response: ",
    //             response.data?.data?.checkout?.emailSendAt
    //         );
    //         if (response.data.errors) {
    //             setToastMsg(response.data.message);
    //             setErrorToast(true);
    //         } else {
    //             setAbandonedCheckout(response.data?.data?.checkout);
    //             setLineItems(response.data?.data?.cart?.line_items);
    //             if (response.data?.data?.checkout?.oldShippingFormDetails) {
    //                 setShippingDetails(
    //                     JSON.parse(response.data?.data?.checkout?.oldShippingFormDetails)
    //                 );
    //             }
    //             if (response.data?.data?.checkout?.oldBillingFormDetails) {
    //                 setBillingDetails(
    //                     JSON.parse(response.data?.data?.checkout?.oldBillingFormDetails)
    //                 );
    //             }
    //             if (response.data?.data?.checkout?.oldThankYouPageData) {
    //                 setCartPrices(
    //                     JSON.parse(response.data?.data?.checkout?.oldThankYouPageData)[0]
    //                 );
    //             }
    //             setLoading(false);
    //             setToggleLoadData(false);
    //             window.scrollTo(0, 0);
    //         }
    //     } catch (error) {
    //         console.warn("AbandonedCheckoutDetail Api Error", error.response);
    //         if (error.response?.data?.message) {
    //             setToastMsg(error.response?.data?.message);
    //         } else {
    //             setToastMsg("Server Error");
    //         }
    //         setErrorToast(true);
    //     }
    // };

    useEffect(() => {
        console.log('check',cartPrices)
        if (toggleLoadData) {
            // abandonedCheckoutDetail(params.abandonedCheckoutId);
        }
    }, [toggleLoadData]);

    const discardAbandonedCheckout = () => {
        navigate("/vendor/orders");
    };

    return (
        <div className="Discount-Detail-Page Abandoned-Checkout-Detail-Page">
            {!loading ? (
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
                    title='#266'
                    // subtitle={dateFormat(
                    //     abandonedCheckout?.created_at,
                    //     "mmmm d, yyyy 'at' h:MM tt"
                    // )}
                    subtitle={
                        "March 21, 2023 at 8:07 pm"
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
                                                                    src={item.product_images[0]?.src}
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
                                                    {lineItems?.length}{" "}
                                                    {lineItems?.length > 1 ? "items" : "item"}
                                                </p>
                                                <p>
                                                    {abandonedCheckout?.oldCurrencyCode}{" "}
                                                    {5.99}
                                                </p>
                                            </Stack>
                                        </div>

                                        <div className="Paid-SubTotal">
                                            <Stack>
                                                <p>Shipping</p>
                                                <p>{cartPrices?.shippingName}</p>
                                                <p>
                                                    {abandonedCheckout?.oldCurrencyCode}
                                                    {2000.00}
                                                </p>
                                            </Stack>
                                        </div>

                                        <div className="Paid-Tax">
                                            <Stack>
                                                <p>Estimated tax</p>
                                                <p>
                                                    {abandonedCheckout?.oldCurrencyCode}{" "}
                                                    {10.00}
                                                </p>
                                            </Stack>
                                        </div>

                                        <div className="Paid-Total">
                                            <Stack>
                                                <p>Total</p>
                                                <p>
                                                    {abandonedCheckout?.oldCurrencyCode}{" "}
                                                    {2025.99}
                                                </p>
                                            </Stack>
                                        </div>

                                        <div className="Paid-By">
                                            <Stack>
                                                <p>To be paid by customer</p>
                                                <p>
                                                    {abandonedCheckout?.oldCurrencyCode}{" "}
                                                    {2025.99}
                                                </p>
                                            </Stack>
                                        </div>
                                    </div>
                                </Card.Section>

                            </Card>

                            <div className="seller_detail_div">
                                <Card title="Seller Earning">

                                    <Card.Section>
                                        <div className="order_detail_status">
                                            <Text variant="headingXs" as="h6">
                                                Here is earning of seller.
                                            </Text>

                                            <p className="order_status_p seller_status">
                                                Product Earning -<span className="order_status_span">  $26.24</span>
                                            </p>
                                            <p className="order_status_p">
                                                Shipping Charge Earning -<span className="order_status_span">   $0.00</span>
                                            </p>
                                            <p className="order_status_p">
                                                Tax Charge Earning -<span className="order_status_span">   $0.00</span>
                                            </p>
                                            <p className="order_status_p">
                                                Tip Charge Earning -<span className="order_status_span">   $0.00</span>
                                            </p>
                                            <p className="order_status_p">
                                                Total Order Earning -<span className="order_status_span">   $26.24</span>
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
                                            Ordered On -<span className="order_status_span">   Mar 21, 2023 9:43 PM</span>
                                        </p>
                                        <p className="order_status_p">
                                            Delivery Method - <span className="order_status_span">   Standard shipping</span>
                                        </p>
                                        <p className="order_status_p">
                                            Order Status - <span className="order_status_span">    <Badge status='critical'>Unfulfilled</Badge></span>
                                        </p>
                                        <p className="order_status_p">
                                            Payment Status - <span className="order_status_span">    <Badge status='success'>Paid</Badge></span>
                                        </p>



                                    </div>
                                </Card.Section>

                                <Card.Section title="Customer">
                                    <p>
                                        Test Person
                                    </p>
                                    <p>test@gmail.com</p>
                                </Card.Section>

                                <Card.Section title="Shipping address">
                                    <p>
                                        Test Person
                                    </p>
                                    <p> 62 Nerrigundah Drive</p>
                                    <p>
                                        Skye Victoria
                                        3977
                                    </p>
                                    <p>Australia</p>
                                </Card.Section>

                                <Card.Section title="Billing address">

                                    <p>
                                        Test Person
                                    </p>
                                    <p> 62 Nerrigundah Drive</p>
                                    <p>
                                        Skye Victoria
                                        3977
                                    </p>
                                    <p> Australia</p>


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
