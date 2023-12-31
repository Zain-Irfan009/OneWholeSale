import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Card, Tabs, Link, TextField, IndexTable, Loading, Icon, Text, Avatar, Pagination,
    Badge, EmptySearchResult, Toast, Tooltip,Button, Popover,ActionList,ButtonGroup,useIndexResourceState,Modal,TextContainer
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor,DeleteMinor,HorizontalDotsMinor } from '@shopify/polaris-icons';
import { AppContext } from '../components/providers/ContextProvider'
import { SkeltonPageForTable } from '../components/global/SkeltonPage'
import { CustomBadge } from '../components/Utils/CustomBadge'
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {InputField} from "../components/Utils";
import {getAccessToken} from "../assets/cookies";
import ReactSelect from "react-select";
// import dateFormat from "dateformat";





export function CommissionListing() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [customersLoading, setCustomersLoading] = useState(false)
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [storeUrl, setStoreUrl] = useState('')
    const [active, setActive] = useState(false);
    const [currency, setCurrency] = useState('');

    const [sellerList, setSellerList] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showSelect, setShowSelect] = useState(true);
    const [showClearButton, setShowClearButton] = useState(false);
    const [showPaymentClearButton, setShowPaymentClearButton] = useState(false);
    const toggleActive1 = useCallback(() => setActive((active) => !active), []);
    const [tableLoading, setTableLoading] = useState(false);

    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);

    const [commissions, setCommissions] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');


    const [uniqueId, setUniqueId] = useState()

    const [itemStrings, setItemStrings] = useState([
        "All",
        "Unfulfilled",
        "Partially Fulfilled",
        "Fulfilled",

    ]);




    const tabs = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => {},
        id: `${item}-${index}`,
        isLocked: index === 0,

    }));

    const toggleActive=(id)=>{

        setActive((prev) => {
            let toggleId;
            if (prev[id]) {
                toggleId = { [id]: false };
            } else {
                toggleId = { [id]: true };
            }
            return { ...toggleId };
        });
    }
    const [toggleLoadData1, setToggleLoadData1] = useState(true);

    const handlePaginationTabs = (active1, page) => {
        if (!active1) {
            setPagination(page);
            setToggleLoadData1(!toggleLoadData1);
        }
    };


    const handleClearButtonClick = () => {
        setLoading(true)
        setSelectedStatus('');
        setShowClearButton(false);
        getData();

    };


    const handleClearPaymentButtonClick = () => {
        setLoading(true)
        setSelectedPaymentStatus('');
        setShowPaymentClearButton(false);
        getData();

    };

    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;


    // ---------------------Tag/Filter Code Start Here----------------------
    const handleQueryValueRemove = () => {
        setPageCursorValue('')
        setQueryValue('')
        getData()
        // setCustomersLoading(false)
        setToggleLoadData(true)
    }

    const handlePagination = (value) => {
        console.log("value", value, nextPageCursor)
        if (value == "next") {
            setPageCursorValue(nextPageCursor);
        } else {
            setPageCursorValue(previousPageCursor);
        }
        setPageCursor(value);
        setToggleLoadData(!toggleLoadData);
    };

    // ---------------------Index Table Code Start Here----------------------



    const handleSelectChange = async (selectedOption)  => {

        const sessionToken = getAccessToken();

        setSelectedStatus(selectedOption)
        setLoading(true)
        setShowClearButton(true)

    };


    const handlePaymentSelectChange = (selectedOption) => {

        const selectedValue =  selectedOption; // Access the value property of the selected option
        setSelectedPaymentStatus(selectedValue);
        setLoading(true)
        setShowPaymentClearButton(true)

    };


    const handleOrderFilter =async (value) =>  {
        setSelected(value)
        setLoading(true)
    }


    const resourceName = {
        singular: 'Customer',
        plural: 'Customers',
    };


    const handleViewAction = (id) => {
        navigate(`/view-order/${id}`)
    }

    const handleDisableAction = useCallback(
        () => console.log('Exported action'),
        [],
    );

    const handleViewinStoreAction = useCallback(
        () => console.log('View in Store action'),
        [],
    );


    const handleSendMessageAction = useCallback(
        () => console.log('View in Send message action'),
        [],
    );

    const handleReassignAction = (id) => {
        setUniqueId(id)
        setModalReassign(true)
    }


    const handleDeleteAction = useCallback(
        () => console.log('View in delete action'),
        [],
    );

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

    const getData = async () => {

        setTableLoading(true)


        const sessionToken = getAccessToken();
        try {
            if (pageCursorValue != '') {

                var url = pageCursorValue+ '&payment_status=' + selectedPaymentStatus.value+ '&fulfillment_status=' + selected + '&seller='+selectedStatus.value + '&query_value'+queryValue;
            } else {
                var url = `${apiUrl}/commission-listing?${pageCursor}=${pageCursorValue}&payment_status=${selectedPaymentStatus.value}&fulfillment_status=${selected}&seller=${selectedStatus.value}&query_value=${queryValue}`;
            }

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })


            console.log(response)
            setCurrency(response?.data?.currency)
            setCommissions(response?.data?.data?.data)
            let arr_seller = response?.data?.sellers.map(({ id,name,seller_shopname, email }) => ({
                value: id,
                // label: `${name} (${email})`
                label: `${seller_shopname}`
            }));
            setSellerList(arr_seller)
            setLoading(false)
            // setCustomersLoading(false)
            setNextPageCursor(response?.data?.data?.next_page_url)
            setPreviousPageCursor(response?.data?.data?.prev_page_url)
            if (response?.data?.data?.next_page_url) {
                setHasNextPage(true)
            } else {
                setHasNextPage(false)
            }
            if (response?.data?.data?.prev_page_url) {
                setHasPreviousPage(true)
            } else {
                setHasPreviousPage(false)
            }

            setTableLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
            setTableLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const handleFiltersQueryChange = async (value)  => {
        setPageCursorValue('')
        setQueryValue(value)

    }

    useEffect(() => {
        getData();
    }, [toggleLoadData,selectedPaymentStatus.value,selected,selectedStatus.value,queryValue]);






    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(commissions);

    const rowMarkup = commissions? commissions?.map(
        // ({ id, order_id,created_at,seller_name,product_name,quantity,price,unit_product_commission,total_product_commission ,total_admin_earning,refunded_admin_earning,vat_on_commission }, index) => (
        ({ id,has_order,has_user, order_id,created_at,seller_name,product_name,quantity,price,unit_product_commission,total_product_commission ,total_admin_earning,unit_payout,sub_total_payout,sub_total_payout_tax,total_payout,has_variant }, index) => (

            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>

                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {order_id != null ? order_id : '---'}

                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>

                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {has_order?.order_number != null ? has_order?.order_number : '---'}

                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell className='Capitalize-Cell'>
                    {created_at != null ? formatDate(created_at) : "---"}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {has_user?.seller_shopname != null ? has_user?.seller_shopname : '---'}

                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {product_name != null && has_variant
                        ? `${product_name.substring(0, 40)} (${has_variant.sku})`
                        : product_name != null
                            ? product_name
                            : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {quantity != null ? quantity : '---'}
                </IndexTable.Cell>


                <IndexTable.Cell>{price != null ? `${currency} ${price.toFixed(2)}` : '---'}</IndexTable.Cell>


                <IndexTable.Cell>
                    {unit_payout != null ? `${currency} ${unit_payout.toFixed(2)}` : '---'}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {sub_total_payout != null ? `${currency} ${sub_total_payout.toFixed(2)}` : '---'}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {sub_total_payout_tax != null ? `${currency} ${sub_total_payout_tax.toFixed(2)}` : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {total_payout != null ? `${currency} ${total_payout.toFixed(2)}` : '---'}
                </IndexTable.Cell>


                {has_order?.fulfillment_status === 'fulfilled' ? (
                    <IndexTable.Cell className="fulfilled">
                        <Badge progress='complete'>{has_order?.fulfillment_status === 'fulfilled' ? 'Fulfilled' : ''}</Badge>


                    </IndexTable.Cell>
                ) : has_order?.fulfillment_status === 'partial' ? (
                    <IndexTable.Cell className="partial">
                        <Badge progress='complete'>{has_order?.fulfillment_status === 'partial' ? 'Partially fulfilled' : ''}</Badge>
                    </IndexTable.Cell>
                ) : (
                    <IndexTable.Cell className="unfulfilled">
                        <Badge progress='complete'>{has_order?.fulfillment_status==null ? 'Unfulfilled' : has_order?.fulfillment_status}</Badge>

                    </IndexTable.Cell>
                )}

                {has_order?.financial_status === 'paid' ? (
                    <IndexTable.Cell>
                        <Badge progress='complete'>{has_order?.financial_status === 'paid' ? 'Paid' : ''}</Badge>
                    </IndexTable.Cell>
                ) :  has_order?.financial_status === 'refunded' ? (
                    <IndexTable.Cell className="unfulfilled" >
                        <Badge progress='complete'>{has_order?.financial_status === 'refunded' ? 'Refunded' : ''}</Badge>
                    </IndexTable.Cell>
                ) : has_order?.financial_status === 'voided' ? (
                    <IndexTable.Cell className="voided" >
                        <Badge progress='complete'>{has_order?.financial_status === 'voided' ? 'Voided' : ''}</Badge>
                    </IndexTable.Cell>
                ) :has_order?.financial_status === 'partially_paid' ? (
                        <IndexTable.Cell className="partially_paid" >
                            <Badge progress='complete'>{has_order?.financial_status === 'partially_paid' ? 'Partially paid' : ''}</Badge>
                        </IndexTable.Cell>
                    ) :
                    has_order?.financial_status === 'partially_refunded' ? (
                            <IndexTable.Cell className="partially_refunded" >
                                <Badge progress='complete'>{has_order?.financial_status === 'partially_refunded' ? 'Partially refunded' : ''}</Badge>
                            </IndexTable.Cell>
                        ):

                        (

                            <IndexTable.Cell className="payment_pending" >
                                <Badge progress='complete'>{has_order?.financial_status === 'pending' ? 'Payment Pending' : ''}</Badge>

                            </IndexTable.Cell>
                        )}



                {/*<IndexTable.Cell>*/}
                {/*    {refunded_admin_earning != null ? refunded_admin_earning : '---'}*/}
                {/*</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>*/}
                {/*    {vat_on_commission != null ? vat_on_commission : '---'}*/}
                {/*</IndexTable.Cell>*/}

            </IndexTable.Row>
        ),
    )  : <EmptySearchResult title={"No Commission Found"} withIllustration />

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Commission  Found'}
            withIllustration
        />
    );


    const handleClearStates = () => {
        setCustomers([])
        setPageCursorValue('')
        setNextPageCursor('')
        setPreviousPageCursor('')
    }


    const activator = (
        <Button onClick={toggleActive} disclosure>
            <Icon  source={HorizontalDotsMinor}></Icon>
        </Button>
    );

    const handleAddProduct = () => {
        navigate('/add-product')
    }
    // ---------------------Api Code starts Here----------------------

    const getCustomers = async () => {
        setCustomersLoading(true)
        try {

            const response = await axios.get(`${apiUrl}/api/shopify/customers?title=${queryValue}&${pageCursor}=${pageCursorValue}`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getCustomers response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let customers = response.data.data.body?.data?.customers;
                let customersArray = []
                let nextValue = ''

                if (customers?.edges?.length > 0) {
                    let previousValue = customers.edges[0]?.cursor;
                    customers?.edges?.map((item) => {
                        nextValue = item.cursor
                        customersArray.push({
                            id: item.node.id.replace('gid://shopify/Customer/', ''),
                            name: item.node.displayName,
                            email: item.node.email,
                            ordersCount: item.node.ordersCount,
                            totalSpent: item.node.totalSpent,
                            address: item.node.defaultAddress?.formattedArea,
                        })
                    })


                    setCustomers(customersArray)
                    setPageCursorValue('')
                    setNextPageCursor(nextValue)
                    setPreviousPageCursor(previousValue)
                    setHasNextPage(customers.pageInfo?.hasNextPage)
                    setHasPreviousPage(customers.pageInfo?.hasPreviousPage)
                }
                else {
                    handleClearStates()
                }
                setStoreUrl(response.data.user?.shopifyShopDomainName)
            }


            setLoading(false)
            setCustomersLoading(false)
            setToggleLoadData(false)


        } catch (error) {
            console.warn('getCustomers Api Error', error.response);
            setLoading(false)
            // setCustomersLoading(false)
            setToastMsg('Server Error')
            setToggleLoadData(false)
            setErrorToast(true)
            handleClearStates()
        }
    }

    // useEffect(() => {
    //     if (toggleLoadData) {
    //         // getCustomers()
    //     }
    //     // setLoading(false)
    //     setCustomersLoading(false)
    // }, [toggleLoadData])




    return (
        <div className='Products-Page IndexTable-Page Orders-page'>

            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForTable />
                </span> :

                <Page
                    fullWidth
                    title="Commissions"
                >
                    <Card>
                        <div className='Polaris-Table commission_page'>
                            <Card.Section>

                                <div>
                                    <Tabs
                                        tabs={tabs}
                                        selected={selected}
                                        onSelect={handleOrderFilter}
                                    ></Tabs>
                                </div>
                                <div className="commission_listing_search" style={{ padding: '16px', display: 'flex' }}>
                                    <div style={{ flex: '40%' }}>
                                        <TextField
                                            placeholder='Search'
                                            value={queryValue}
                                            onChange={handleFiltersQueryChange}
                                            clearButton
                                            onClearButtonClick={handleQueryValueRemove}
                                            autoComplete="off"
                                            prefix={<Icon source={SearchMinor} />}
                                        />
                                    </div>
                                    <div style={{ flex: '30%', padding: '0px',alignItems: 'center', justifyContent: 'flex-end' }}>

                                        <div style={{ flex: '1' }}>

                                            <div style={{ position: 'relative', width: 'auto', zIndex: 99999 }}>
                                                <ReactSelect
                                                    name='pushed_status'
                                                    options={sellerList}
                                                    placeholder="Select Seller"
                                                    value={selectedStatus}
                                                    onChange={(selectedOption) => handleSelectChange(selectedOption)}
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                                    }}
                                                />
                                            </div>

                                            {showClearButton && (
                                                <Button onClick={handleClearButtonClick} plain>
                                                    Clear
                                                </Button>
                                            )}
                                        </div>

                                    </div>

                                    <div style={{ flex: '30%', padding: '0px',alignItems: 'center', justifyContent: 'flex-end' }}>

                                        <div style={{ flex: '1' }}>

                                            <div style={{ position: 'relative', width: 'auto', zIndex: 99999 }}>
                                                <ReactSelect
                                                    name='pushed_status'
                                                    options={[
                                                        { value: 'all', label: 'All' },
                                                        { value: 'paid', label: 'Paid' },
                                                        { value: 'pending', label: 'Pending' },

                                                    ]}
                                                    placeholder="Select Payment Status"
                                                    value={selectedPaymentStatus}
                                                    onChange={(selectedOption) => handlePaymentSelectChange(selectedOption)}
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                                    }}
                                                />
                                            </div>

                                            {showPaymentClearButton && (
                                                <Button onClick={handleClearPaymentButtonClick} plain>
                                                    Clear
                                                </Button>
                                            )}
                                        </div>


                                    </div>


                                </div>

                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={commissions?.length}
                                    hasMoreItems
                                    selectable={false}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    loading={tableLoading}
                                    // emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: 'Order Id' },
                                        { title: 'Order Number' },
                                        { title: 'Date' },
                                        { title: 'Seller Store' },
                                        { title: 'Product Name' },
                                        { title: 'Quantity' },
                                        { title: 'Unit Price' },
                                        { title: 'Unit Payout' },
                                        { title: 'Subtotal Payout' },
                                        { title: 'Tax' },
                                        { title: 'Total Payout' },
                                        { title: 'Order Status' },
                                        { title: 'Payment Status' },
                                        // { title: 'Total Admin Earning' },
                                        // { title: 'Refunded Admin Earning' },
                                        // { title: 'VAT on Commission' },
                                    ]}
                                >
                                    {rowMarkup}
                                </IndexTable>

                            </Card.Section>


                            <Card.Section>
                                <div className='data-table-pagination'
                                     style={{
                                         display: "flex",
                                         justifyContent: "center",
                                         marginTop: "20px",
                                         paddingBottom: "20px",
                                     }}
                                >

                                    <Pagination
                                        hasPrevious={hasPreviousPage ? true : false}
                                        onPrevious={() => handlePagination("prev")}
                                        hasNext={hasNextPage ? true : false}
                                        onNext={() => handlePagination("next")}
                                    />
                                </div>
                            </Card.Section>

                        </div>

                    </Card>

                </Page>


            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

