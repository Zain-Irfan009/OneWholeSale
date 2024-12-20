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
    product_id:'3232332',
    image:'https://cdn.shopify.com/s/files/1/0060/5582/1381/products/ihumolighterbestAMZ2Final.webp?v=1678989366',
    product_name:'iHumo | 2 in 1 Grinder & USB Lighter, 4 Parts (60mm)',
    type:'normal',
    price:'$13.00',
    quantity:'14 Pcs.',
    status:'Approved'

},
    {
        id:2,
        product_id:'3232332',
        image:'https://cdn.shopify.com/s/files/1/0060/5582/1381/products/ihumolighterbestAMZ2Final.webp?v=1678989366',
        product_name:'iHumo | 2 in 1 Grinder & USB Lighter, 4 Parts (60mm)',
        type:'normal',
        price:'$13.00',
        quantity:'14 Pcs.',
        status:'Approved'

    },
    {
        id:3,
        product_id:'3232332',
        image:'https://cdn.shopify.com/s/files/1/0060/5582/1381/products/ihumolighterbestAMZ2Final.webp?v=1678989366',
        product_name:'iHumo | 2 in 1 Grinder & USB Lighter, 4 Parts (60mm)',
        type:'normal',
        price:'$13.00',
        quantity:'14 Pcs.',
        status:'Approved'

    }

];


export function Products() {
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

    const [products, setProducts] = useState([])
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

    const [toggleLoadData1, setToggleLoadData1] = useState(true);
    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);

    const [deleteProductModal, setDeleteProductModal] = useState(false);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

    const handleEditAction = (id) => {
        navigate(`/edit-product/${id}`);
    };


    const handlePaginationTabs = (active1, page) => {
        if (!active1) {
            setPagination(page);
            setToggleLoadData1(!toggleLoadData1);
        }
    };


    const [currency, setCurrency] = useState('');

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
        getData()
        setQueryValue('')
        setToggleLoadData(true)
    }
    const handleFiltersQueryChange = async (value)  => {
        setCustomersLoading(true)
        setPageCursorValue('')
        setQueryValue(value)

        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/seller/search-product?query_value=${value}&status=${selected}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setProducts(response?.data?.data)
            setCustomersLoading(false)

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

    // ---------------------Index Table Code Start Here----------------------

    const [modalReassign, setModalReassign] = useState(false)

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };


    const handleViewAction = (id) => {
        navigate(`/view-product/${id}`)
    }




    const handleSendMessageAction = useCallback(
        () => console.log('View in Send message action'),
        [],
    );





    const handleReassignCloseAction=()=>{
        setUniqueId()
        setSellerEmail('')
        setModalReassign(false)
    }


    const deleteProductModalHandler = (id) => {
        setUniqueId(id)
        setDeleteProductModal(true);
    };

    const deleteModalCloseHandler = () => {
        setDeleteProductModal(false);
    };

    const handleArchiveProducts=async () => {


        setLoading(true)
        setBtnLoading(true)
        const sessionToken = getAccessToken();

        try {
            const response = await axios.get(`${apiUrl}/seller/archive-products?ids=${selectedResources}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getData()
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setBtnLoading(false)

            setLoading(false)


        } catch (error) {
            console.log('error',error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }
    }

    const handleUnArchiveProducts=async () => {


        setLoading(true)
        setBtnLoading(true)
        const sessionToken = getAccessToken();

        try {
            const response = await axios.get(`${apiUrl}/seller/unarchive-products?ids=${selectedResources}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getData()
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setBtnLoading(false)

            setLoading(false)


        } catch (error) {
            console.log('error',error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }
    }
    const bulkActions = [
        {

            content:  "Archive Products" ,
            onAction: () => handleArchiveProducts(),
        },

        {

            content:  "Un-Archive Products" ,
            onAction: () => handleUnArchiveProducts(),
        },

    ];

    const deleteProduct  = async () => {
        setDeleteBtnLoading(true)
        // setSkeleton(true)
        // setLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.delete(`${apiUrl}/seller/product-delete?id=${uniqueId}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getData();
            // setLoading(false)
            setDeleteProductModal(false);
            setDeleteBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            setLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }

    }


    const getData = async () => {

        const sessionToken = getAccessToken();
        setLoading(true)
        console.log('session',sessionToken)
        try {

            const response = await axios.get(`${apiUrl}/seller/products?page=${pagination}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })


            setProducts(response?.data?.products?.data)
            setPaginationUrl(response?.data?.products?.links);
            if (
                response?.data?.products?.total >
                response?.data?.products?.per_page
            ) {
                setShowPagination(true);
            } else {
                setShowPagination(false);
            }
            setCurrency(response?.data?.currency)

            setLoading(false)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
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
    useEffect(() => {
        getData();
    }, [toggleLoadData1]);


    const handleExportProduct = async () => {
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        try {
            const response = await axios.get(`${apiUrl}/seller/export-product`,
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
            setBtnLoading(false)
            setToastMsg('Export Failed')
            setErrorToast(true)
        }

    }

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(products);

    const rowMarkup = products ? products?.map(
        ({ id, product_id,featured_image,product_status,product_name,type,price,quantity,status,has_variants_count,archived  }, index) => (

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

                <IndexTable.Cell>
                    <Avatar size="small" shape="square" name='title' source={featured_image} />
                </IndexTable.Cell>

                <IndexTable.Cell className="Capitalize-Cell">
                    {product_name != null ? product_name.substring(0, 40) : "---"}
                </IndexTable.Cell>


                <IndexTable.Cell>
                    <CustomBadge  value={"NORMAL"}  type='products' />
                </IndexTable.Cell>

                <IndexTable.Cell>{price != null ? `${currency} ${price.toFixed(2)}` : '---'}</IndexTable.Cell>
                <IndexTable.Cell>
                    {has_variants_count &&
                    has_variants_count?.length > 0 &&
                    has_variants_count[0].total_quantity !== 0
                        ? has_variants_count[0].total_quantity
                        : 0}
                </IndexTable.Cell>
                {product_status === 'Approved' ? (
                    <IndexTable.Cell className="approved">
                        <CustomBadge  value={product_status}  type="products" />
                    </IndexTable.Cell>
                ) : product_status === 'Approval Pending' ? (
                    <IndexTable.Cell className="approval_pending">
                        <CustomBadge  value={product_status}  type="products" />
                    </IndexTable.Cell>
                ) : (

                    <IndexTable.Cell className="disabled">
                        <CustomBadge  value={product_status}  type="products" />
                    </IndexTable.Cell>

                )}



                <IndexTable.Cell className="approved">
                    {archived == 1 && (
                        <CustomBadge value="Archived" type="products" />
                    )}
                </IndexTable.Cell>




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
                                    content: "Edit",
                                    onAction: () => handleEditAction(id),
                                },
                                // {
                                //     content: 'View',
                                //     onAction: ()=>handleViewAction(id),
                                // },

                                // {
                                //     content: 'Delete',
                                //     // onAction: ()=>deleteProduct(id),
                                //     onAction: () =>deleteProductModalHandler(id),
                                // },
                            ]}
                        />
                    </Popover>
                </IndexTable.Cell>


            </IndexTable.Row>
        ),
    ) : <EmptySearchResult title={"No Product Found"} withIllustration />

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Products Found'}
            withIllustration
        />
    );


    const handleClearStates = () => {
        setProducts([])
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
        navigate("/add-product");
    }


    useEffect(() => {
        if (toggleLoadData) {
            // getCustomers()
        }
        // setLoading(false)
        // setCustomersLoading(false)
    }, [toggleLoadData])



    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value)
    }

    // ---------------------Tabs Code Start Here----------------------

    const handleTabChange = async (selectedTabIndex) => {

        setSelected(selectedTabIndex)

        setCustomersLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/seller/product-filter?status=${selectedTabIndex}&query_value=${queryValue}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setProducts(response?.data?.products)
            setCustomersLoading(false)


            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
            setLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
        setTimeout(() => {
            setToggleLoadData(true)
        }, 1000);
    }

    const tabs = [
        {
            id: 'all-products',
            content: 'All',
            accessibilityLabel: 'All products',
            panelID: 'all-products-content',
        },
        {
            id: 'active-products',
            content: 'Approval Pending',
            panelID: 'active-products-content',
        },
        {
            id: 'draft-products',
            content: 'Approved',
            panelID: 'draft-products-content',
        },
        {
            id: 'archived-products',
            content: 'Disabled',
            panelID: 'archived-products-content',
        },
    ];


    return (
        <div className='Products-Page IndexTable-Page Orders-page'>


            <Modal
                open={deleteProductModal}
                onClose={deleteModalCloseHandler}
                title="Delete Product"
                primaryAction={{
                    content: "Delete Product",
                    destructive: true,
                    style: { backgroundColor: "red" },
                    onAction: deleteProduct,
                    loading: deleteBtnLoading,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: deleteModalCloseHandler,
                    },
                ]}
            >
                <Modal.Section>

                    <div className="margin-top" />

                </Modal.Section>
            </Modal>

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
                    title="Products"
                    primaryAction={{
                        content: "Add Product",
                        onAction: handleAddProduct,
                    }}
                    secondaryActions={
                        <ButtonGroup>

                            <Button onClick={handleExportProduct} loading={btnLoading}>Export </Button>

                        </ButtonGroup>
                    }
                >

                    <Card>
                        <Tabs
                            tabs={tabs}
                            selected={selected}
                            onSelect={handleTabChange}
                            disclosureText="More views"
                        >
                        <div className='Polaris-Table'>
                            <Card.Section>
                                <div style={{ padding: '16px', display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            placeholder='Search Product'
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
                                    itemCount={products?.length}
                                    hasMoreItems
                                    selectable={true}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources?.length
                                    }
                                    bulkActions={bulkActions}
                                    onSelectionChange={handleSelectionChange}
                                    loading={customersLoading}
                                    // emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: 'Product Id' },
                                        { title: 'Image' },
                                        { title: 'Product Name' },
                                        { title: 'Type' },
                                        { title: 'Price' },
                                        { title: 'Quantity' },
                                        { title: 'Status' },
                                        { title: 'Archived' },
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

