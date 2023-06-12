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
    Select
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor,DeleteMinor,HorizontalDotsMinor } from '@shopify/polaris-icons';
import { AppContext } from '../components/providers/ContextProvider'
import { SkeltonPageForTable } from '../components/global/SkeltonPage'
import { CustomBadge } from '../components/Utils/CustomBadge'
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {InputField} from "../components/Utils";
// import dateFormat from "dateformat";


let data=[{
    id:1,
    product_id:'3232332',
    product_name:'Leaf disposable lighter Box of 50 [XLC8025CAN]',
    vendor:'HIGH-END BRANDS GLASS',
},
    {
        id:2,
        product_id:'3232332',
        product_name:'Leaf disposable lighter Box of 50 [XLC8025CAN]',
        vendor:'HIGH-END BRANDS GLASS',

    },
    {
        id:3,
        product_id:'3232332',
        product_name:'Leaf disposable lighter Box of 50 [XLC8025CAN]',
        vendor:'HIGH-END BRANDS GLASS',
    }

];


export function ImportProduct() {
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

    const [customers, setCustomers] = useState(data)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const [uniqueId, setUniqueId] = useState()
    const [modalAssignProduct, setModalAssignProduct] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [sellerEmail, setSellerEmail] = useState('')
    const [assignProduct, setAssignProduct] = useState('normal');

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

        //Assign Seller Modal

    const handleAssignProductToSeller = (id) => {
        setUniqueId(id)
        setModalAssignProduct(true)
    }
    const handleAassignProductCloseAction=()=>{
        setUniqueId()
        // setSellerEmail('')
        setModalAssignProduct(false)
    }

    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value)
    }


    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(customers);

    const rowMarkup = customers?.map(
        ({ id, product_id,product_name,vendor }, index) => (

            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>

                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {product_id != null ? product_id : '---'}

                    </Text>

                </IndexTable.Cell>

                <IndexTable.Cell>
                    {product_name != null ? product_name : '---'}

                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {vendor != null ? vendor : '---'}
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
                                    content: 'Assign Product to Seller',
                                    onAction: ()=>handleAssignProductToSeller(id),
                                },

                            ]}
                        />
                    </Popover>
                </IndexTable.Cell>


            </IndexTable.Row>
        ),
    );

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Customers Found'}
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

    const handleAddSeller = () => {
        navigate('/add-seller')
    }

    const handleAssignProduct = useCallback((value) => setAssignProduct(value), []);

    const assignProductOptions=[
        {label: "Normal Product", value: "normal"},
    ];




    return (
        <div className='Products-Page IndexTable-Page Orders-page'>
            <Modal
                open={modalAssignProduct}
                onClose={handleAassignProductCloseAction}
                title="Assign Product To Seller"
                loading={btnLoading[2]}
                primaryAction={{
                    content: 'Assign',
                    destructive: true,
                    disabled: btnLoading[2],
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        disabled: btnLoading[2],
                        onAction: handleAassignProductCloseAction,
                    },
                ]}
            >
                <Modal.Section>
                    {/*<div className="label_editor">*/}
                        <Select
                            label="Assign Product As*"
                            options={assignProductOptions}
                            onChange={handleAssignProduct}
                            value={assignProduct}
                        />
                    {/*</div>*/}

                    <InputField
                        label='Seller Email *'
                        marginTop
                        type='text'
                        name='seller_email'
                        value={sellerEmail}
                        onChange={handleSellerEmail}
                    />
                </Modal.Section>
            </Modal>

            {!loading ?
                <span>
                    <Loading />
                    <SkeltonPageForTable />
                </span> :

                <Page
                    fullWidth
                    title="Import Products From Shopify"
                    primaryAction={{
                        content:  'Import Products',
                        onAction:  handleAddSeller,

                    }}
                    // secondaryActions={
                    //     <ButtonGroup>
                    //         <a href='https://help.checkify.pro/en/articles/4367163-general-customization-settings' target='_blank'>
                    //             <Button>Export </Button>
                    //         </a>
                    //     </ButtonGroup>
                    // }
                >

                    <Card>
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
                                    itemCount={customers.length}
                                    hasMoreItems
                                    selectable={true}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    loading={customersLoading}
                                    emptyState={emptyStateMarkup}
                                    headings={[
                                        { title: 'Id' },
                                        { title: 'Product Name' },
                                        { title: 'Vendor' },
                                        { title: 'Action' },
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

