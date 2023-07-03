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
    date:'Mar 23, 2023',
    seller_name:'Sagar Patel',
    product_name:'10" RM decal Glow in the dark glass water bong 10"',
    quantity:1,
    price:'$22.00',
    unit_product_commission:'$5.50',
    total_product_commission:'$5.50',
    total_admin_earning:'$15.50',
    refunded_admin_earning:'$0.00',
    vat_on_commission:'$0.00',

},
    {
        id:2,
        order_id:'3232332',
        date:'Mar 23, 2023',
        seller_name:'Sagar Patel',
        product_name:'10" RM decal Glow in the dark glass water bong 10"',
        quantity:1,
        price:'$22.00',
        unit_product_commission:'$5.50',
        total_product_commission:'$5.50',
        total_admin_earning:'$15.50',
        refunded_admin_earning:'$0.00',
        vat_on_commission:'$0.00',
    },
    {
        id:3,
        order_id:'3232332',
        date:'Mar 23, 2023',
        seller_name:'Sagar Patel',
        product_name:'10" RM decal Glow in the dark glass water bong 10"',
        quantity:1,
        price:'$22.00',
        unit_product_commission:'$5.50',
        total_product_commission:'$5.50',
        total_admin_earning:'$15.50',
        refunded_admin_earning:'$0.00',
        vat_on_commission:'$0.00',
    }

];


export function Commissions() {
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

    const [commissions, setCommissions] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')


    const [uniqueId, setUniqueId] = useState()

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
        setToggleLoadData(true)
    }
    const handleFiltersQueryChange = (value) => {
        setPageCursorValue('')
        setQueryValue(value)
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

    // ---------------------Index Table Code Start Here----------------------



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

    const formatDate=(created_at)=>{
        const date = new Date(created_at);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formatedDate = `${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}-${year}`;
        return formatedDate;
    }


    const getData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/commission-listing`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            console.log(response?.data?.data)
            setCommissions(response?.data?.data)

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
    }, []);

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(commissions);

    const rowMarkup = commissions?.map(
        ({ id, order_id,created_at,seller_name,product_name,quantity,price,unit_product_commission,total_product_commission ,total_admin_earning,refunded_admin_earning,vat_on_commission }, index) => (

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
                <IndexTable.Cell className='Capitalize-Cell'>
                    {created_at != null ? formatDate(created_at) : "---"}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {seller_name != null ? seller_name : '---'}

                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {product_name != null ? product_name : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {quantity != null ? quantity : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {price != null ? price : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {unit_product_commission != null ? unit_product_commission : '---'}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {total_product_commission != null ? total_product_commission : '---'}
                </IndexTable.Cell>


            </IndexTable.Row>
        ),
    );

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

    useEffect(() => {
        if (toggleLoadData) {
            // getCustomers()
        }
        setLoading(false)
        setCustomersLoading(false)
    }, [toggleLoadData])




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
                        <div className='Polaris-Table'>
                            <Card.Section>
                                <div style={{ padding: '16px', display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
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
                                </div>

                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={commissions.length}
                                    hasMoreItems
                                    selectable={false}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    loading={customersLoading}
                                    emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: 'Order Id' },
                                        { title: 'Date' },
                                        { title: 'Seller Name' },
                                        { title: 'Product Name' },
                                        { title: 'Quantity' },
                                        { title: 'Price' },
                                        { title: 'Unit Product Commission' },
                                        { title: 'Total Product Commission' },
                                    ]}
                                >
                                    {rowMarkup}
                                </IndexTable>

                            </Card.Section>


                            <Card.Section>
                                <div className='data-table-pagination'>

                                    <Pagination
                                        hasPrevious={hasPreviousPage ? true : false}
                                        onPrevious={() => handlePagination('prev')}
                                        hasNext={hasNextPage ? true : false}
                                        onNext={() => handlePagination('next')}
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

