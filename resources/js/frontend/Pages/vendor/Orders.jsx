import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Card, Tabs, Link, TextField, IndexTable, Loading, Icon, Text, Avatar, Pagination,
    Badge, EmptySearchResult, Toast, Tooltip,Button, Popover,ActionList,ButtonGroup,useIndexResourceState,Modal,TextContainer
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor,DeleteMinor,HorizontalDotsMinor } from '@shopify/polaris-icons';
import { AppContext } from '../../components/providers/ContextProvider'
import { SkeltonPageForTable } from '../../components/global/SkeltonPage'
import { CustomBadge } from '../../components/Utils/CustomBadge'
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {InputField} from "../../components/Utils";
import {getAccessToken} from "../../assets/cookies";
// import dateFormat from "dateformat";


let data=[{
    id:1,
    order_id:'3232332',
    payment_mode:'Interac E-Transfer',
    payment_status:'Paid',
    order_status:'Unfulfilled',
    tracking_id:'N/A'
},
    {
        id:2,
        order_id:'3232332',
        payment_mode:'Interac E-Transfer',
        payment_status:'Paid',
        order_status:'Unfulfilled',
        tracking_id:'N/A'
    },
    {
        id:3,
        order_id:'3232332',
        payment_mode:'Interac E-Transfer',
        payment_status:'Paid',
        order_status:'Unfulfilled',
        tracking_id:'N/A'
    }

];


export function Orders() {
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

    const [orders, setOrders] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const [btnLoading, setBtnLoading] = useState(false)
    const [sellerEmail, setSellerEmail] = useState('')
    const [uniqueId, setUniqueId] = useState()


    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);

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

    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;


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


    // ---------------------Tag/Filter Code Start Here----------------------
    const handleQueryValueRemove = () => {
        setPageCursorValue('')
        getData()
        setQueryValue('')
        setToggleLoadData(true)
    }
    const handleFiltersQueryChange = async (value)  => {
        setPageCursorValue('')
        setQueryValue(value)

        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/seller/search-order?value=${value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setOrders(response?.data?.data)


        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

        setTimeout(() => {
            setToggleLoadData(true)
        }, 1000);
    }

    const handlePagination = (value) => {
        if (value == 'next') {
            setPageCursorValue(nextPageCursor)
        }
        else {
            setPageCursorValue(previousPageCursor)
        }
        setPageCursor(value)
        setToggleLoadData(true)
    }


    function handleRowClick(id) {
        const target = event.target;
        const isCheckbox = target.tagName === "INPUT" && target.type === "checkbox";

        if (!isCheckbox) {
            event.stopPropagation(); // Prevent row from being selected
        } else {
            // Toggle selection state of row
            const index = selectedResources.indexOf(id);
            if (index === -1) {
                handleSelectionChange([...selectedResources, id]);
            } else {
                handleSelectionChange(selectedResources.filter((item) => item !== id));
            }
        }
    }

    // ---------------------Index Table Code Start Here----------------------

    const [modalReassign, setModalReassign] = useState(false)

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



    const handleSendMessageAction = useCallback(
        () => console.log('View in Send message action'),
        [],
    );

    const handleReassignAction = (id) => {
        setUniqueId(id)
        setModalReassign(true)
    }

    const handleReassignCloseAction=()=>{
        setUniqueId()
        setSellerEmail('')
        setModalReassign(false)
    }
    const handleDeleteAction = useCallback(
        () => console.log('View in delete action'),
        [],
    );

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(orders);

    const rowMarkup = orders ? orders?.map(
        ({ id, order_number, gateway, financial_status,created_at,
             fulfillment_status,payment_status,order_status,tracking_id  }, index) => (

            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
                onClick={() => handleRowClick(id)} // Add this line
            >
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>

                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {id != null ? id : '---'}

                    </Text>
                </IndexTable.Cell>

                {/*<IndexTable.Cell>*/}
                {/*    { order_number != null ? order_number : '---'}*/}
                {/*</IndexTable.Cell>*/}
                <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>

                <IndexTable.Cell>
                    <CustomBadge value={financial_status=="paid" ? 'PAID' : financial_status} type="orders" variant={"financial"} />
                </IndexTable.Cell>

                {fulfillment_status === 'fulfilled' ? (
                    <IndexTable.Cell className="fulfilled">
                        {/*<CustomBadge value={fulfillment_status=='' ? 'UNFULFILLED' : fulfillment_status} type="orders" variant={"fulfillment"} />*/}
                        <Badge progress='complete'>{fulfillment_status === 'fulfilled' ? 'Fulfilled' : ''}</Badge>


                    </IndexTable.Cell>
                ) : fulfillment_status === 'partial' ? (
                    <IndexTable.Cell className="partial">
                        <Badge progress='complete'>{fulfillment_status === 'partial' ? 'Partially fulfilled' : ''}</Badge>
                    </IndexTable.Cell>
                ) : (
                    <IndexTable.Cell className="unfulfilled">
                        <Badge progress='complete'>{fulfillment_status==null ? 'Unfulfilled' : fulfillment_status}</Badge>

                    </IndexTable.Cell>
                )}

                <IndexTable.Cell>
                    <Popover
                        active={active[id]}
                        activator={<Button onClick={() => toggleActive(id)}  plain>
                            <Icon  source={HorizontalDotsMinor}></Icon>
                        </Button>}
                        autofocusTarget="first-node"
                        onClose={()=>setActive(false)}


                    >
                        <ActionList
                            actionRole="menuitem"
                            items={[
                                {
                                    content: 'View',
                                    onAction: ()=>handleViewAction(id),
                                },


                            ]}
                        />
                    </Popover>
                </IndexTable.Cell>


            </IndexTable.Row>
        ),
    ) : <EmptySearchResult title={"No Order Found"} withIllustration />

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Order Found'}
            withIllustration
        />
    );


    const handleClearStates = () => {
        setOrders([])
        setPageCursorValue('')
        setNextPageCursor('')
        setPreviousPageCursor('')
    }


    const activator = (
        <Button onClick={toggleActive} disclosure>
            <Icon  source={HorizontalDotsMinor}></Icon>
        </Button>
    );

    const handleExport = () => {
        navigate('#')
    }


    const handleExportOrder = async () => {
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        try {
            const response = await axios.get(`${apiUrl}/seller/export-order`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            const downloadLink = document.createElement('a');
            downloadLink.href = response?.data?.link; // Replace 'fileUrl' with the key containing the download link in the API response
            downloadLink.download =response?.data?.name; // Specify the desired filename and extension
            downloadLink.target = '_blank';
            downloadLink.click();
            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            setBtnLoading1(false)
            setToastMsg('Export Failed')
            setErrorToast(true)
        }

    }

    const getData = async () => {

        const sessionToken = getAccessToken();
        setLoading(true)
        try {

            const response = await axios.get(`${apiUrl}/seller/orders`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setOrders(response?.data?.orders)
            setLoading(false)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
            setLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    useEffect(() => {
        getData();
    }, [toggleLoadData1]);

    // // ---------------------Api Code starts Here----------------------
    //
    // const getCustomers = async () => {
    //     setCustomersLoading(true)
    //     try {
    //
    //         const response = await axios.get(`${apiUrl}/api/shopify/customers?title=${queryValue}&${pageCursor}=${pageCursorValue}`, {
    //             headers: { "Authorization": `Bearer ${getAccessToken()}` }
    //         })
    //
    //         // console.log('getCustomers response: ', response.data);
    //         if (response.data.errors) {
    //             setToastMsg(response.data.message)
    //             setErrorToast(true)
    //         }
    //         else {
    //             let customers = response.data.data.body?.data?.customers;
    //             let customersArray = []
    //             let nextValue = ''
    //
    //             if (orders?.edges?.length > 0) {
    //                 let previousValue = customers.edges[0]?.cursor;
    //                 orders?.edges?.map((item) => {
    //                     nextValue = item.cursor
    //                     customersArray.push({
    //                         id: item.node.id.replace('gid://shopify/Customer/', ''),
    //                         name: item.node.displayName,
    //                         email: item.node.email,
    //                         ordersCount: item.node.ordersCount,
    //                         totalSpent: item.node.totalSpent,
    //                         address: item.node.defaultAddress?.formattedArea,
    //                     })
    //                 })
    //
    //
    //                 setOrders(customersArray)
    //                 setPageCursorValue('')
    //                 setNextPageCursor(nextValue)
    //                 setPreviousPageCursor(previousValue)
    //                 setHasNextPage(customers.pageInfo?.hasNextPage)
    //                 setHasPreviousPage(customers.pageInfo?.hasPreviousPage)
    //             }
    //             else {
    //                 handleClearStates()
    //             }
    //             setStoreUrl(response.data.user?.shopifyShopDomainName)
    //         }
    //
    //
    //         setLoading(false)
    //         setCustomersLoading(false)
    //         setToggleLoadData(false)
    //
    //
    //     } catch (error) {
    //         console.warn('getCustomers Api Error', error.response);
    //         setLoading(false)
    //         // setCustomersLoading(false)
    //         setToastMsg('Server Error')
    //         setToggleLoadData(false)
    //         setErrorToast(true)
    //         handleClearStates()
    //     }
    // }

    useEffect(() => {
        if (toggleLoadData) {
            // getCustomers()
        }
        // setLoading(false)
        setCustomersLoading(false)
    }, [toggleLoadData])



    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value)
    }

    // ---------------------Tabs Code Start Here----------------------

    const handleTabChange = (selectedTabIndex) => {
        if (selected != selectedTabIndex) {
            setSelected(selectedTabIndex)
            if (selectedTabIndex == 0) {
                setOrderStatus('')
            }
            else if (selectedTabIndex == 1) {
                setOrderStatus('unfulfilled')
            }
            else if (selectedTabIndex == 2) {
                setOrderStatus('unpaid')
            }
            else if (selectedTabIndex == 3) {
                setOrderStatus('open')
            }
            else if (selectedTabIndex == 4) {
                setOrderStatus('closed')
            }
            setPageCursorValue('')
            setToggleLoadData(true)
        }
    }

    const [itemStrings, setItemStrings] = useState([
        "All",
        "Paid",
        "Pending",

    ]);


    const handleOrderFilter =async (value) =>  {
        setSelected(value)
        setLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/order-filter?status=${value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setOrders(response?.data?.orders)
            setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }
    // const tabs = [
    //     {
    //         id: 'all-orders',
    //         content: 'All',
    //         accessibilityLabel: 'All orders',
    //         panelID: 'all-orders-content',
    //     },
    //     {
    //         id: 'active-orders',
    //         content: 'Unfulfilled',
    //         panelID: 'active-orders-content',
    //     },
    //     {
    //         id: 'draft-orders',
    //         content: 'Unpaid',
    //         panelID: 'draft-orders-content',
    //     },
    //     {
    //         id: 'open-orders',
    //         content: 'Open',
    //         panelID: 'open-orders-content',
    //     },
    //     {
    //         id: 'closed-orders',
    //         content: 'Closed',
    //         panelID: 'closed-orders-content',
    //     },
    // ];

    const tabs = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => {},
        id: `${item}-${index}`,
        isLocked: index === 0,

    }));

    return (
        <div className='Products-Page IndexTable-Page Orders-page'>

            <Modal
                open={modalReassign}
                onClose={handleReassignCloseAction}
                title="Assign Product To Seller"
                loading={btnLoading[2]}
                primaryAction={{
                    content: 'Reassign',
                    destructive: true,
                    disabled: btnLoading[2],
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        disabled: btnLoading[2],
                        onAction: handleReassignCloseAction,
                    },
                ]}
            >
                <Modal.Section>
                    <InputField
                        label='Seller Email *'
                        type='text'
                        name='seller_email'
                        value={sellerEmail}
                        onChange={handleSellerEmail}
                    />
                </Modal.Section>
            </Modal>
            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForTable />
                </span> :

                <Page
                    fullWidth
                    title="All Orders"
                    primaryAction={{
                        content:  'Export',
                        onAction:  handleExportOrder,

                    }}

                >

                    <Card>
                        <Tabs
                            tabs={tabs}
                            selected={selected}
                            onSelect={handleOrderFilter}
                            disclosureText="More views"
                        >
                        <div className='Polaris-Table'>
                            <Card.Section>
                                <div style={{ padding: '16px', display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                        {/*<TextField*/}
                                        {/*    placeholder='Search Order'*/}
                                        {/*    value={queryValue}*/}
                                        {/*    onChange={handleFiltersQueryChange}*/}
                                        {/*    clearButton*/}
                                        {/*    onClearButtonClick={handleQueryValueRemove}*/}
                                        {/*    autoComplete="off"*/}
                                        {/*    prefix={<Icon source={SearchMinor} />}*/}
                                        {/*/>*/}
                                    </div>
                                </div>

                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={orders?.length}
                                    hasMoreItems
                                    selectable={true}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    loading={customersLoading}
                                    emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: 'Order Id' },
                                        // { title: 'Order Number' },
                                        { title: "Date" },
                                        { title: 'Payment Status' },
                                        { title: 'Order Status' },
                                        // { title: 'Tracking Id' },
                                        { title: 'Action' },
                                    ]}
                                >
                                    {rowMarkup}
                                </IndexTable>

                            </Card.Section>

                            {showPagination && (
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
                                        hasPrevious={pagination > 1}
                                        onPrevious={() => handlePaginationTabs(false, pagination - 1)}
                                        hasNext={pagination < paginationUrl.length}
                                        onNext={() => handlePaginationTabs(false, pagination + 1)}
                                    />
                                </div>
                            </Card.Section>
                            )}

                        </div>
                        </Tabs>
                    </Card>

                </Page>


            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

