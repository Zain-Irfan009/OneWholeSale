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
import { useNavigate,useParams } from 'react-router-dom';
import {InputField} from "../components/Utils";
import {getAccessToken} from "../assets/cookies";
import ReactSelect from "react-select";
// import dateFormat from "dateformat";


export function SellerCommissionSetting() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const params = useParams();
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

    const [sellerCommission, setSellerCommission] = useState([])
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


    const [sellerList, setSellerList] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showSelect, setShowSelect] = useState(true);
    const [showClearButton, setShowClearButton] = useState(false);
    const toggleActive1 = useCallback(() => setActive((active) => !active), []);


    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);

    const [toggleLoadData1, setToggleLoadData1] = useState(true);
    const handlePaginationTabs = (active1, page) => {
        if (!active1) {
            setPagination(page);
            setToggleLoadData1(!toggleLoadData1);
        }
    };

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



    const handleSelectChange = async (selectedOption)  => {

        const sessionToken = getAccessToken();
        setLoading(true)

        setSelectedStatus(selectedOption)
        setShowClearButton(true)
        try {
            const response = await axios.get(`${apiUrl}/seller-commission-setting-filter?value=${selectedOption.value}&query_value=${queryValue}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

                console.log(response?.data)
            setSellerCommission(response?.data?.data?.data)

            setLoading(false)
            setCustomersLoading(false)
            setPaginationUrl(response?.data?.data?.links);
            if (
                response?.data?.data?.total >
                response?.data?.data?.per_page
            ) {
                setShowPagination(true);
            } else {
                setShowPagination(false);
            }


        } catch (error) {
        console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    };


    const handleClearButtonClick = () => {
        setLoading(true)
        setSelectedStatus('');
        setShowClearButton(false);
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
        getData()
        setQueryValue('')
        setToggleLoadData(true)
    }



    const getSellerCommissionData=async (id)=>{
        console.log(id)
    }

    useEffect(()=>{
        getSellerCommissionData(params.seller_commission_id)
    },[])

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

    const [modalReassign, setModalReassign] = useState(false)

    const resourceName = {
        singular: 'Customer',
        plural: 'Customers',
    };


    const handleEditAction = (id) => {
        navigate(`/edit-seller-commission/${id}`)
    }

    const handleDisableAction = useCallback(
        () => console.log('Exported action'),
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

    const deleteSellerCommission  = async (id) => {

        setBtnLoading(true)
        setLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.delete(`${apiUrl}/delete-seller-commission?id=${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getData();
            setLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setBtnLoading(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }

    }


    const getData = async () => {

        const sessionToken = getAccessToken();
        // setLoading(true)
        try {

            if (pageCursorValue != '') {

                var url = pageCursorValue;
            } else {
                var url = `${apiUrl}/seller-commission?${pageCursor}=${pageCursorValue}`;
            }

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
        console.log(response)
            setSellerCommission(response?.data?.data?.data)
            setLoading(false)
            let arr_seller = response?.data?.sellers?.map(({ id,name, email,seller_shopname}) => ({
                value: id,
                label: `${seller_shopname}`
            }));
            setSellerList(arr_seller)

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
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    useEffect(() => {
        getData();
    }, [toggleLoadData]);

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

    const handleFiltersQueryChange = async (value)  => {
        setPageCursorValue('')
        setQueryValue(value)

        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/search-seller-commission?query_value=${value}&value=${selectedStatus.value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            console.log(response?.data)
            setSellerCommission(response?.data?.data?.data)
            setLoading(false)


            setPaginationUrl(response?.data?.data?.links);
            if (
                response?.data?.data?.total >
                response?.data?.data?.per_page
            ) {
                setShowPagination(true);
            } else {
                setShowPagination(false);
            }


        } catch (error) {
            console.log(error)
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

        setTimeout(() => {
            setToggleLoadData(true)
        }, 1000);
    }

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(sellerCommission);

    const rowMarkup = sellerCommission ? sellerCommission?.map(
        ({ id, user_id,seller_name,store_name,seller_email,commission_type,first_commission,second_commission  }, index) => (

            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
                onClick={() => handleRowClick(id)} // Add this line
            >
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>

                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {user_id != null ? user_id : '---'}

                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {seller_name != null ? seller_name : '---'}

                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {store_name != null ? store_name : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {seller_email != null ? seller_email : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {commission_type != null ? commission_type : '---'}
                </IndexTable.Cell>

                <IndexTable.Cell>
                    {first_commission != null ? first_commission : '---'}
                </IndexTable.Cell>
                {/*<IndexTable.Cell>*/}
                {/*    {second_commission != null ? second_commission : '---'}*/}
                {/*</IndexTable.Cell>*/}

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
                                    content: 'Edit',
                                    onAction: ()=>handleEditAction(id),
                                },
                                {
                                    content: 'Delete',
                                    onAction: ()=>deleteSellerCommission(id),
                                },

                            ]}
                        />
                    </Popover>
                </IndexTable.Cell>


            </IndexTable.Row>
        ),
    )  : <EmptySearchResult title={"No Seller Commission Found"} withIllustration />

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Seller Commission Found'}
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

    const handleAddCommissionToSeller = () => {
        navigate('/add-seller-commission')
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
        // setLoading(false)
        setCustomersLoading(false)
    }, [toggleLoadData])



    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value)
    }

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
                    title="Commission Setting"
                    primaryAction={{
                        content:  'Add Commission to Seller',
                        onAction:  handleAddCommissionToSeller,
                    }}
                >
                    <Card>
                        <div className='Polaris-Table'>
                            <Card.Section>
                                <div className="seller_commission_listing_search" style={{ padding: '16px', display: 'flex' }}>
                                    <div style={{ flex: '70%' }}>
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
                                    <div style={{ flex: '30%', padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>

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
                                </div>

                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={sellerCommission?.length}
                                    hasMoreItems
                                    selectable={false}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    loading={customersLoading}
                                    // emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: 'Seller Id' },
                                        { title: 'Seller Name' },
                                        { title: 'Store Name' },
                                        { title: 'Email Id' },
                                        { title: 'Commission Type' },
                                        { title: 'First Commission' },
                                        // { title: 'Second Commission' },
                                        { title: 'Action' },
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

