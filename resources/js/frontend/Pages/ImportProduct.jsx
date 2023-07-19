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
    LegacyStack,
    Thumbnail,
    Tooltip,
    Button,
    LegacyCard,
    DropZone,
    Popover,
    ActionList,
    ButtonGroup,
    useIndexResourceState,
    Modal,
    Select
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor,DeleteMinor,HorizontalDotsMinor,NoteMinor } from '@shopify/polaris-icons';
import { AppContext } from '../components/providers/ContextProvider'
import { SkeltonPageForTable } from '../components/global/SkeltonPage'
import { CustomBadge } from '../components/Utils/CustomBadge'
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {InputField} from "../components/Utils";
import {getAccessToken} from "../assets/cookies";
// import dateFormat from "dateformat";




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
    //modal code
    const [modalReassign, setModalReassign] = useState(false);
    const [files, setFiles] = useState([]);
    const [importData, setImportData] = useState([])
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
    const [sellerMessage, setSellerMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});

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


    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => {
            setSelectedFile(acceptedFiles[0]);
            setFiles((files) => [...files, ...acceptedFiles]);
        },
        []
    );

    // ---------------------Tag/Filter Code Start Here----------------------

    const validImageTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const handleQueryValueRemove = () => {
        setPageCursorValue('')
        setQueryValue('')
        getData()
        setToggleLoadData(true)
    }
    const handleFiltersQueryChange = async (value)  => {
        setPageCursorValue('')
        setQueryValue(value)

        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/search-product?value=${value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
                setImportData(response?.data?.data)


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


    const assignProductToSeller = async () => {

        setBtnLoading(true)
        const sessionToken = getAccessToken();
        const errors = {};

        if (sellerEmail.trim() === '') {
            errors.sellerEmail = 'Email is required';
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setBtnLoading(true)
        let data = {
            id: uniqueId,
            email:sellerEmail
        }
        try {
            const response = await axios.post(`${apiUrl}/assign-import-products`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getData()
            setBtnLoading(false)

            setModalAssignProduct(false)
            setSellerEmail('')
            setToastMsg(response?.data?.message)
            setSucessToast(true)


        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

    }

    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value)
    }


    const getData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/import-products`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            console.log(response?.data?.data)
            setImportData(response?.data?.data)

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
        useIndexResourceState(importData);

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

    const rowMarkup = importData?.map(
        ({ id, product_shopify_id,title,vendor_name }, index) => (

            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
                onClick={() => handleRowClick(id)} // Add this line
            >
                <IndexTable.Cell className='Polaris-IndexTable-Product-Column'>

                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {product_shopify_id != null ? product_shopify_id : '---'}

                    </Text>

                </IndexTable.Cell>

                <IndexTable.Cell>
                    {title != null ? title : '---'}

                </IndexTable.Cell>

                <IndexTable.Cell className='Capitalize-Cell'>
                    {vendor_name != null ? vendor_name : '---'}
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
            title={'No Data Found'}
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

    const handleImportProductCloseAction = () => {
        setUniqueId();
        setSellerMessage("");
        setModalReassign(false);

    };

    const handleImportProduct=()=>{
        setModalReassign(true);
    };

    const importProducts = async () => {
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        const errors = {};

        if (sellerMessage.trim() === '') {
            errors.sellerMessage = 'Message is required';
        }
        if (Object.keys(errors).length > 0) {
            // setFormErrors(errors);
            setBtnLoading(false)
            return;
        }

        let data = {
            message: sellerMessage,
            id:sellerId
        }

        try {
            const response = await axios.post(`${apiUrl}/send-message`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setBtnLoading(false)
            setToastMsg('Message Send Successfully')
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            setBtnLoading(false)
            setToastMsg('Message Failed')
            setErrorToast(true)
        }

    }
    const uploadedFiles = files.length > 0 && (
        <LegacyStack vertical>
            {files.map((file, index) => (
                <LegacyStack alignment="center" key={index}>
                    <Thumbnail
                        size="small"
                        alt={file.name}
                        source={
                            validImageTypes.includes(file.type)
                                ? window.URL.createObjectURL(file)
                                : NoteMinor
                        }
                    />
                    <div>
                        {file.name}{' '}
                        <Text variant="bodySm" as="p">
                            {file.size} bytes
                        </Text>
                    </div>
                </LegacyStack>
            ))}
        </LegacyStack>
    );

    const fileUpload = !files.length && (
        <DropZone.FileUpload actionHint="Accepts .csv, .xlsx only" />
    );

    const handleLoadFile = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('csv_file', selectedFile);
            setBtnLoading(true);
            const sessionToken = getAccessToken();
            // Verify that the sessionToken is a valid JWT token with three segments
            const tokenSegments = sessionToken.split('.');
            // if (tokenSegments.length !== 3) {
            //     throw new Error('Invalid JWT token');
            // }
            // Create a headers object with the authorization bearer token
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionToken}`
            };
            try {
                const response = await axios.post('/api/import-csv', formData, { headers });
                if (response) {
                    setBtnLoading(false);
                    setToastMsg(response?.data?.message);
                    setSucessToast(true)
                    setSelectedFile(null)
                    // const data = response.data;
                    // Process the data returned from the API
                    // const newData = data.file; // Assuming the API response contains the file data in the "file" property
                    // Update the products state with the new data
                    // setProducts((prevProducts) => [...prevProducts, ...newData]);
                } else {
                    console.error('Failed to load file:');
                }
            } catch (error) {
                console.error('Error loading file:', error);
            }
        }
    };

    return (
        <div className='Products-Page IndexTable-Page Orders-page'>
            <Modal
                open={modalReassign}
                onClose={handleImportProductCloseAction}
                title="Import Products"
                loading={btnLoading}
                primaryAction={{
                    content: "Load FIle",
                    disabled: btnLoading,
                    onAction: handleLoadFile,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        disabled: btnLoading[2],
                        onAction: handleImportProductCloseAction,
                    },
                ]}
            >
                <Modal.Section>
                    <LegacyCard sectioned>
                        <DropZone onDrop={handleDropZoneDrop} variableHeight label="Upload File">
                            {uploadedFiles}
                            {fileUpload}
                        </DropZone>

                    </LegacyCard>

                </Modal.Section>
            </Modal>
            <Modal
                open={modalAssignProduct}
                onClose={handleAassignProductCloseAction}
                title="Assign Product To Seller"
                loading={btnLoading}
                primaryAction={{
                    content: 'Assign',
                    destructive: true,
                    disabled: btnLoading,
                    onAction: assignProductToSeller,
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
                    {/*    <Select*/}
                    {/*        label="Assign Product As*"*/}
                    {/*        options={assignProductOptions}*/}
                    {/*        onChange={handleAssignProduct}*/}
                    {/*        value={assignProduct}*/}
                    {/*    />*/}
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
                        onAction:  handleImportProduct,

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
                                    itemCount={importData.length}
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

