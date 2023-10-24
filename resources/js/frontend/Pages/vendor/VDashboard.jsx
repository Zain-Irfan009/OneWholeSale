import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page,
    Card,
    Tabs,
    Link,
    TextField,
    IndexTable,
    Loading,
    Icon,
    Text,
    Avatar,
    Pagination,
    Badge,
    EmptySearchResult,
    Toast,
    Tooltip,
    Button,
    Popover,
    ActionList,
    ButtonGroup,
    useIndexResourceState,
    Modal,
    Layout, LegacyCard
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor,DeleteMinor,HorizontalDotsMinor } from '@shopify/polaris-icons';
import { AppContext } from '../../components/providers/ContextProvider'
import { SkeltonPageForTable } from '../../components/global/SkeltonPage'
import { CustomBadge } from '../../components/Utils/CustomBadge'
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {InputField} from "../../components/Utils/InputField";
import { AreaChart, XAxis, YAxis, CartesianGrid, Area } from 'recharts';
import {getAccessToken} from "../../assets/cookies";
import {Loader} from "../../components/Loader";
import {DateRangePicker} from "rsuite";

const resourceName = {
    singular: "order",
    plural: "orders",
};

export function VDashboard() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const [graphLoading, setGraphLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingTab, setLoadingTab] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState("");
    const [toggleLoadData, setToggleLoadData] = useState(true);
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [storeUrl, setStoreUrl] = useState("");
    const [active, setActive] = useState(false);
    const [productStats, setProductsStats] = useState(0);
    const [ApprovedproductsStats, setApprovedProductsStats] = useState(0);
    const [ApprovalPendingStats, setApprovalPendingStats] = useState(0);
    const [DisabledStats, setDisabledStats] = useState(0);
    const [sellersCount, setSellersCount] = useState(0);
    const [approvedSellersCount, setApprovedSellersCount] = useState(0);
    const [disabledSellersCount, setDisabledSellersCount] = useState(0);
    const [approvalPendingSellersCount, setApprovalPendingSellersCount] = useState(0);
    const [graphData, setGraphData] = useState([]);



    const [skeleton, setSkeleton] = useState(false)
    const [skeleton1, setSkeleton1] = useState(false)

    const [currency, setCurrency] = useState('');
    const [totalCommission, setTotalCommission] = useState(0);




    const [storeEarning, setStoreEarning] = useState(0);

    const [orders, setOrders] = useState([])
    const [sellers, setSellers] = useState([])

    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [pageCursor, setPageCursor] = useState("next");
    const [pageCursorValue, setPageCursorValue] = useState("");
    const [nextPageCursor, setNextPageCursor] = useState("");
    const [previousPageCursor, setPreviousPageCursor] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [sellerHandle, setSellerHandle] = useState('');
    //modal code
    const [modalReassign, setModalReassign] = useState(false);
    const [modalChangePassword, setModalChangePassword] = useState(false);
    const [uniqueId, setUniqueId] = useState();
    const [btnLoading, setBtnLoading] = useState(false);
    const [sellerMessage, setSellerMessage] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dateRange, setDateRange] = useState([]);

    const [outofStockProduct, setOutofStockProduct] = useState([]);

    const [topSoldProduct, setTopSoldProduct] = useState([]);



    const handleSelect = async (ranges) => {
        // console.log(ranges);
        let formattedDate = [];
        ranges?.map((range) => {
            const date = new Date(range);
            formattedDate.push(date.toISOString().slice(0, 10));
            console.log(formattedDate);
        });
        setDateRange(formattedDate);
        setSkeleton1(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/store-earning-filter?date=${formattedDate}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setStoreEarning(response?.data?.store_earning)
            setCurrency(response?.data?.currency)
            setTotalCommission(response?.data?.total_commission)
            setSkeleton1(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    };

    // const handleTabChange = useCallback(
    //   (selectedTabIndex) => setSelected(selectedTabIndex),
    //   []
    // );


    const getStoreStats =async (selectedTabIndex) =>  {
        console.log(selectedTabIndex)
        setSelected(selectedTabIndex)
        setSkeleton(true)


        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/store-stats?status=${selectedTabIndex}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setProductsStats(response?.data?.products)
            setSellersCount(response?.data?.orders)

            setSkeleton(false)



        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const getStoreStatsFirst =async () =>  {


        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/store-stats?status=0`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setProductsStats(response?.data?.products)

            setSellersCount(response?.data?.orders)

            // setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }
    const getStoreEarning =async () =>  {


        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/store-earning`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setStoreEarning(response?.data?.store_earning)
            setCurrency(response?.data?.currency)
            setTotalCommission(response?.data?.total_commission)
            // setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const getTopSoldProduct =async () =>  {
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/top-sold-products`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            console.log('response',response?.data)
            setTopSoldProduct(response?.data)


        } catch (error) {
                console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const getOutofStockProduct =async () =>  {
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/out-of-stock-products`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setOutofStockProduct(response?.data)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const tabs = [
        {
            id: "all-customers-1",
            content: "Over All",
            accessibilityLabel: "All customers",
            panelID: "all-customers-content-1",
        },
        {
            id: "accepts-marketing-1",
            content: "This Week",
            panelID: "accepts-marketing-content-1",
        },
        {
            id: "repeat-customers-1",
            content: "This Month",
            panelID: "repeat-customers-content-1",
        },
        {
            id: "prospects-1",
            content: "This Year",
            panelID: "prospects-content-1",
        },
    ];

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

    const data = [
        { name: "Jan", uv: 4000 },
        { name: "Feb", uv: 3000 },
        { name: "Mar", uv: 2000 },
        { name: "Apr", uv: 2780 },
        { name: "May", uv: 1890 },
        { name: "Jun", uv: 2390 },
        { name: "Jul", uv: 3490 },
        { name: "Aug", uv: 3490 },
        { name: "Sep", uv: 3490 },
        { name: "Oct", uv: 3490 },
        { name: "Nov", uv: 3490 },
        { name: "Dec", uv: 3490 },
    ];


    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(sellers);


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

    const rowMarkup = sellers.map(
        ({ id, seller_id, name, seller_shopname, email, created_at, status }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
                onClick={() => handleRowClick(id)} // Add this line
            >
                <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {id != null ? id : "---"}
                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell>{name != null ? name : "---"}</IndexTable.Cell>

                <IndexTable.Cell className="Capitalize-Cell">
                    {seller_shopname != null ? seller_shopname : "---"}
                </IndexTable.Cell>

                <IndexTable.Cell>{email != null ? email : "---"}</IndexTable.Cell>

                <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>
                <IndexTable.Cell>
                    <CustomBadge value={status==1 ?"ACTIVE" : "Disabled"} type="products" />

                </IndexTable.Cell>

            </IndexTable.Row>
        )
    );

    const rowMarkup2 = orders.map(
        (
            {
                id,
                shopify_order_id,
                order_number,
                user_name,
                total_price,
                financial_status,
                created_at,
            },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                {/*<IndexTable.Cell className="Polaris-IndexTable-Product-Column">*/}
                {/*    <Text variant="bodyMd" fontWeight="semibold" as="span">*/}
                {/*        {id != null ? id : "---"}*/}
                {/*    </Text>*/}
                {/*</IndexTable.Cell>*/}
                {/*<IndexTable.Cell className="Polaris-IndexTable-Product-Column">*/}
                {/*    <Text variant="bodyMd" fontWeight="semibold" as="span">*/}
                {/*        {shopify_order_id != null ? shopify_order_id : "---"}*/}
                {/*    </Text>*/}
                {/*</IndexTable.Cell>*/}

                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {order_number != null ? order_number : "---"}
                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell className="Capitalize-Cell">
                    {user_name != null ? user_name : "---"}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {total_price !== null ? `${currency} ${total_price}` : "---"}
                </IndexTable.Cell>

                {financial_status === 'paid' ? (
                    <IndexTable.Cell>
                        <Badge progress='complete'>{financial_status === 'paid' ? 'Paid' : ''}</Badge>
                    </IndexTable.Cell>
                ) : financial_status === 'refunded' ? (
                    <IndexTable.Cell >
                        <Badge progress='complete'>{financial_status === 'refunded' ? 'Refunded' : ''}</Badge>
                    </IndexTable.Cell>
                ) :financial_status === 'partially_paid' ? (
                        <IndexTable.Cell className="partially_paid" >
                            <Badge progress='complete'>{financial_status === 'partially_paid' ? 'Partially paid' : ''}</Badge>
                        </IndexTable.Cell>
                    ) :
                    financial_status === 'partially_refunded' ? (
                            <IndexTable.Cell className="partially_refunded" >
                                <Badge progress='complete'>{financial_status === 'partially_refunded' ? 'Partially refunded' : ''}</Badge>
                            </IndexTable.Cell>
                        ):

                        (

                            <IndexTable.Cell className="payment_pending" >
                                <Badge progress='complete'>{financial_status === 'pending' ? 'Payment Pending' : ''}</Badge>

                            </IndexTable.Cell>
                        )}

                <IndexTable.Cell>
                    {created_at != null ? formatDate(created_at) : "---"}
                </IndexTable.Cell>


            </IndexTable.Row>
        )
    );

    const rowMarkup3 = topSoldProduct?.map(
        (
            {
                id,
                image,
                name,
                seller_name,
                quantity,
                number_of_sales,
                variant,
                variant_sku,


            },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >

                <IndexTable.Cell>
                    {/*<Avatar size="small" shape="square" name="title" source={image} />*/}
                    <Text variant="bodyMd" fontWeight="semibold" as="span" key={index}>
                        {`#${index + 1}`}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {name != null ? name.substring(0, 40) : '---'} {variant !== '' ? `(${variant})` : ''}
                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {variant_sku !== '' ? `(${variant_sku})` : ''}
                    </Text>
                </IndexTable.Cell>

                {/*<IndexTable.Cell>*/}
                {/*    <Text variant="bodyMd" fontWeight="semibold" as="span">*/}
                {/*        {seller_name != null ? seller_name : "---"}*/}
                {/*    </Text>*/}
                {/*</IndexTable.Cell>*/}

                <IndexTable.Cell className="Capitalize-Cell">
                    {quantity !== null ? `${quantity} pcs` : '0 pcs'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {number_of_sales !== null ?  `${number_of_sales} sales` : "---"}
                </IndexTable.Cell>




            </IndexTable.Row>
        )
    );


    const rowMarkup4 = outofStockProduct.map(
        (
            {
                id,
                product_id,
                name,
                total_sale,
                status,
                variant,
                variant_sku


            },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >

                <IndexTable.Cell>
                    {product_id != null ? product_id : "---"}

                </IndexTable.Cell>
                <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {name != null ? name.substring(0, 40) : "---"} {variant !== '' ? `(${variant})` : ''}
                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {variant_sku !== '' ? `(${variant_sku})` : ''}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {total_sale !== null ? `${total_sale} sales` : '---'}
                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <CustomBadge value="Out of Stock" type="orders" variant={"financial"} />
                </IndexTable.Cell>




            </IndexTable.Row>
        )
    );


    const getData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/recent-orders`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            console.log(response)
            setOrders(response?.data)
            setGraphLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const getSellerData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/recent-sellers`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setSellers(response?.data)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const getGraphData = async () => {
        setGraphLoading(true)
        const sessionToken = getAccessToken();
        try {
            const response = await axios.get(`${apiUrl}/seller/get-graph-data`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            console.log(response?.data)
            setGraphData(response?.data)
            setGraphLoading(false)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    useEffect(() => {
        getData();
        // getSellerData();
        getStoreStatsFirst()
        getStoreEarning()
        getTopSoldProduct()
        getOutofStockProduct()
        getGraphData()
        // console.log(data)
    }, []);


    return (
        <div className="Products-Page IndexTable-Page Orders-page">
            {graphLoading ? (
                <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
            ) : (
                <Page  title="Dashboard">
                    <Layout>
                        <Layout.Section oneThird>
                            <LegacyCard title="Sales">
                                <LegacyCard.Section>
                                    <Text color="subdued" as="span">
                                        Here you can check all recent Orders of your Marketplace Store.
                                    </Text>
                                </LegacyCard.Section>

                                <LegacyCard.Section>
                                    <AreaChart width={900} height={200} data={graphData}>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Area
                                            type="monotone"
                                            dataKey="uv"
                                            stroke="#8884d8"
                                            fill="#8884d8"
                                        />
                                    </AreaChart>
                                </LegacyCard.Section>
                            </LegacyCard>
                        </Layout.Section>
                    </Layout>
                    <div style={{ marginTop: "30px" }}></div>
                    <Layout>
                        <Layout.Section oneThird>

                            <LegacyCard title="Seller Statistics">
                                <LegacyCard.Section>
                                    <Text color="subdued" as="span">
                                        Here you can check Statistics of your Marketplace Store.
                                    </Text>
                                </LegacyCard.Section>
                                {skeleton ?
                                    <Loader/>
                                    :
                                    <LegacyCard>
                                        <Tabs
                                            tabs={tabs}
                                            selected={selected}
                                            onSelect={getStoreStats}
                                            loading={loadingTab}
                                        >
                                            {/*<LegacyCard.Section title={tabs[selected].content}>*/}
                                            <LegacyCard.Section >
                                                <div className="store_stats">
                                                    <div className="margin-top "></div>{" "}
                                                    <div>
                                                        <Text>
                                                            Sellers that are currently on your Marketplace.
                                                        </Text>
                                                    </div>
                                                    <div class="product_stats margin-top">
                                                        <p> <CustomBadge value={"Products"} type="products" /> <span className="product_stats_span">{productStats}</span></p>
                                                        <p className="product_status_aprroved seller_status_aprroved" ><CustomBadge value="Orders" type="orders" variant={"fulfillment"} /> <span className="product_stats_span">{sellersCount}</span></p>
                                                    </div>




                                                </div>

                                            </LegacyCard.Section>

                                        </Tabs>
                                    </LegacyCard>
                                }
                            </LegacyCard>

                        </Layout.Section>
                        <Layout.Section oneThird>
                            <LegacyCard title="Seller Earning">
                                <LegacyCard.Section>
                                    <Text color="subdued" as="span">
                                        Here you can check your earning
                                    </Text>
                                </LegacyCard.Section>
                                <LegacyCard.Section>
                                    <DateRangePicker
                                        onChange={handleSelect}
                                        ranges={[dateRange]}
                                        placeholder="Select Date Range"
                                        showOneCalendar
                                    />
                                </LegacyCard.Section>

                                {skeleton1 ? (
                                    <Loader />
                                ) : (
                                    <>
                    {/*                    <LegacyCard.Section>*/}
                    {/*                        <div className="earning_stats">*/}
                    {/*                            <text>*/}
                    {/*                                <CustomBadge value={"Total earning"} type="products" />{" "}*/}
                    {/*                                <span className="product_stats_span">*/}
                    {/*    {currency} {storeEarning}*/}
                    {/*</span>*/}
                    {/*                            </text>*/}
                    {/*                        </div>*/}
                    {/*                        <div className="margin-top"></div>*/}
                    {/*                        <Text>This is sellers' overall earning amount of your Marketplace</Text>*/}
                    {/*                    </LegacyCard.Section>*/}
                                        <LegacyCard.Section>
                                            <div className="earning_stats">
                                                <text>
                                                    <CustomBadge value={"Total Earning"} type="products" />{" "}
                                                    <span className="product_stats_span">
                        {currency} {totalCommission}
                    </span>
                                                </text>
                                            </div>
                                            <div className="margin-top"></div>
                                            <Text>This is the overall earning amount of your Marketplace.</Text>
                                        </LegacyCard.Section>
                                    </>
                                )}

                            </LegacyCard>
                        </Layout.Section>
                    </Layout>

                    {orders.length > 0 && (
                        <div style={{ marginTop: "30px" }}>
                            <LegacyCard title="Recent Orders">
                                <LegacyCard.Section>
                                    <IndexTable
                                        resourceName={resourceName}
                                        itemCount={orders.length}
                                        selectable={false}
                                        headings={[
                                            // { title: "Order Id" },
                                            // { title: "Store Order Id" },
                                            { title: "Order Number" },
                                            { title: "Seller Name" },
                                            { title: "Order Total" },
                                            { title: "Payment Status" },
                                            { title: "Order Date" },
                                        ]}
                                    >
                                        {rowMarkup2}
                                    </IndexTable>
                                </LegacyCard.Section>
                            </LegacyCard>
                        </div>
                    )}

                    <div style={{ marginTop: "30px" }}></div>

              {/*      <LegacyCard title="Recent Seller">*/}
              {/*          <LegacyCard.Section>*/}
              {/*              <IndexTable*/}
              {/*                  resourceName={resourceName}*/}
              {/*                  selectable={false}*/}
              {/*                  itemCount={sellers.length}*/}
              {/*                  selectedItemsCount={*/}
              {/*                      allResourcesSelected ? "All" : selectedResources.length*/}
              {/*                  }*/}
              {/*                  onSelectionChange={handleSelectionChange}*/}
              {/*                  headings={[*/}
              {/*                      { title: "Seller ID" },*/}
              {/*                      { title: "Seller Name" },*/}
              {/*                      { title: "Store Name" },*/}
              {/*                      { title: "Email" },*/}
              {/*                      { title: "Date" },*/}
              {/*                      { title: "Status" },*/}
              {/*                  ]}*/}
              {/*              >*/}
              {/*                  {rowMarkup}*/}
              {/*              </IndexTable>*/}
              {/*              /!* <Text color="subdued" as="span">*/}
              {/*  Here you can check all recent Orders of your Marketplace Store.*/}
              {/*</Text>*/}
              {/*<div className="margin-top"></div>*/}
              {/*<Text color="subdued" as="span">*/}
              {/*  Recent orders will appear here.{" "}*/}
              {/*</Text>*/}

              {/*<div className="margin-top"></div>*/}
              {/*<Button primary>VIEW ALL ORDERS</Button>*/}
              {/*<div className="margin-top"></div>*/}
              {/*<Text color="subdued" as="span">*/}
              {/*  Click on the Button above to View all the Details for all*/}
              {/*  Orders.*/}
              {/*</Text> *!/*/}
              {/*          </LegacyCard.Section>*/}
              {/*      </LegacyCard>*/}


                    <div style={{ marginTop: "30px" }}></div>
                    {topSoldProduct.length > 0 && (
                    <LegacyCard title="Top Sold Products">
                        <LegacyCard.Section>
                            <IndexTable
                                resourceName={resourceName}
                                selectable={false}
                                itemCount={topSoldProduct.length}
                                selectedItemsCount={
                                    allResourcesSelected ? "All" : selectedResources.length
                                }
                                // onSelectionChange={handleSelectionChange}
                                headings={[
                                    { title: "" },
                                    { title: "Product Name" },
                                    { title: "SKU" },
                                    { title: "Current Quantity" },
                                    { title: "No. of Sales" },

                                ]}
                            >
                                {rowMarkup3}
                            </IndexTable>
                        </LegacyCard.Section>
                    </LegacyCard>
                    )}

                    <div style={{ marginTop: "30px" }}></div>

                    {outofStockProduct.length > 0 && (
                    <LegacyCard title="Out of Stock Products">
                        <LegacyCard.Section>
                            <IndexTable
                                resourceName={resourceName}
                                selectable={false}
                                itemCount={outofStockProduct.length}
                                selectedItemsCount={
                                    allResourcesSelected ? "All" : selectedResources.length
                                }
                                // onSelectionChange={handleSelectionChange}
                                headings={[
                                    { title: "Product Id" },
                                    { title: "Product Name" },
                                    { title: "SKU" },
                                    { title: "Total Sales" },
                                    { title: "Status" },

                                ]}
                            >
                                {rowMarkup4}
                            </IndexTable>

                        </LegacyCard.Section>
                    </LegacyCard>
                    )}
                    <div style={{ marginTop: "30px" }}></div>

                </Page>
            )}
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

