import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react';
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
    Select, Autocomplete, Stack, Tag
} from '@shopify/polaris';
import { SearchMinor, ExternalMinor,DeleteMinor,HorizontalDotsMinor,NoteMinor,EditMinor } from '@shopify/polaris-icons';
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

    const [sellerEmailInputValue, setSellerEmailInputValue] = useState("");

    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);

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

    const [orignalSellerEmailList, setOrignalSellerEmailList] = useState(
        []
    );



    const [sellerEmailList, setSellerEmailList] = useState(
        []
    );

    const [sellerEmailListSelected, setSellerListSelected] =
        useState("");

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


    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => {
            setSelectedFile(acceptedFiles[0]);
            setFiles((files) => [...files, ...acceptedFiles]);
        },
        []
    );

    // ---------------------Tag/Filter Code Start Here----------------------

    const [optionsLoading, setOptionsLoading] = useState(false);
    const CollectionsOptionsData = useMemo(
        () => [
            { value: "Catalogs", label: "catalog" },
            { value: "Zippo Display", label: "zippo" },
        ],
        []
    );
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
            const response = await axios.get(`${apiUrl}/search-import-product?value=${value}`,
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

    const handleAssignProductToSeller = (id,seller_email,vendor_store_name) => {
console.log('seller_email',seller_email)
        setUniqueId(id)
        setSellerListSelected([vendor_store_name]);

        // setSellerListSelected([])
        setModalAssignProduct(true)
    }
    const handleAassignProductCloseAction=()=>{
        setUniqueId()
        // setSellerEmail('')
        setSellerEmailInputValue('')
        setSellerEmailList(orignalSellerEmailList)
        setModalAssignProduct(false)
    }


    const assignProductToSeller = async () => {

        setBtnLoading(true)
        const sessionToken = getAccessToken();
        const errors = {};
        console.log('selectedResources',selectedResources)
        console.log('sellerEmailListSelected',sellerEmailListSelected)

        // if (sellerEmail.trim() === '') {
        //     errors.sellerEmail = 'Email is required';
        // }
        // if (Object.keys(errors).length > 0) {
        //     setFormErrors(errors);
        //     return;
        // }
        setBtnLoading(true)


        try {
            if (selectedResources.length === 0) {

                let data = {
                    id: uniqueId,
                    email:sellerEmailListSelected,
                }
                var url = `${apiUrl}/assign-import-products`
                const response = await axios.post(url,data,
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
            }else{
                let data1 = {
                    email:sellerEmailListSelected,
                    selected:selectedResources
                }
                var url=`${apiUrl}/assign-multiple-import-products`
                const response = await axios.post(url,data1,
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
            }



        } catch (error) {
            console.log(error)
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

            const response = await axios.get(`${apiUrl}/import-products?page=${pagination}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
        console.log(response)
            setPaginationUrl(response?.data?.data?.links);
            if (
                response?.data?.data?.total >
                response?.data?.data?.per_page
            ) {
                setShowPagination(true);
            } else {
                setShowPagination(false);
            }

            setImportData(response?.data?.data?.data)

            setLoading(false)

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
    }, [toggleLoadData1]);

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

    function tagTitleCase(string) {
        return string
            .toLowerCase()
            .split(" ")
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join("");
    }


    const sellerUpdateText = useCallback(
        (value) => {


            setSellerEmailInputValue(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === "") {
                    setSellerEmailList(orignalSellerEmailList);
                    setOptionsLoading(false);
                    return;
                }

                const filterRegex = new RegExp(value, "i");
                const resultOptions = sellerEmailList.filter((option) =>
                    option.label.match(filterRegex)
                );
                let endIndex = resultOptions.length - 1;
                if (resultOptions.length === 0) {
                    endIndex = 0;
                }
                setSellerEmailList(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [sellerEmailList, optionsLoading, sellerEmailListSelected]
    );


    const [collectionOptionsSelected, setCollectionOptionsSelected] =
        useState("");
    const removeSellerEmail = useCallback(
        (collection) => () => {
            const collectionOptions = [...sellerEmailListSelected];
            collectionOptions.splice(collectionOptions.indexOf(collection), 1);
            setSellerListSelected(collectionOptions);
        },
        [collectionOptionsSelected]
    );

    const sellerContentMarkup =
        sellerEmailListSelected.length > 0 ? (
            <div className="Product-Tags-Stack">
                <Stack spacing="extraTight" alignment="center">
                    {sellerEmailListSelected.map((option) => {
                        let tagLabel = "";
                        tagLabel = option.replace("_", " ");
                        tagLabel = tagTitleCase(tagLabel);
                        return (
                            <Tag
                                key={`option${option}`}
                                onRemove={removeSellerEmail(option)}
                            >
                                {tagLabel}
                            </Tag>
                        );
                    })}
                </Stack>
            </div>
        ) : null;

    const sellerEmailTextField = (
        <Autocomplete.TextField
            onChange={sellerUpdateText}
            label="Seller Email*"
            value={sellerEmailInputValue}
            placeholder="Select Seller"
            verticalContent={sellerContentMarkup}
        />
    );


    const getCollectionData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/collections`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            console.log('response',response?.data)

            let arr_seller = response?.data?.sellers.map(({ name, email,seller_shopname }) => ({
                value: seller_shopname,
                label: `${seller_shopname}`
            }));
            setSellerEmailList(arr_seller)
            setOrignalSellerEmailList(arr_seller)
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
        getCollectionData();

    }, []);

    const handleMultipleReassign = async () => {

        setModalAssignProduct(true);
    }
    const promotedBulkActions = [
        {
            content: 'Select',
        },
    ];

    const bulkActions = [


        {

            content:  "Reassign" ,
            onAction: () => handleMultipleReassign(),
        },


    ];




    const rowMarkup = importData?.map(
        ({ id, product_shopify_id,title,vendor_name,seller_email,vendor_store_name }, index) => (

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

                {/*<IndexTable.Cell>*/}
                {/*    <Popover*/}
                {/*        active={active[id]}*/}
                {/*        activator={<Button onClick={() => toggleActive(id)}  plain>*/}
                {/*            <Icon  source={HorizontalDotsMinor}></Icon>*/}
                {/*        </Button>}*/}
                {/*        autofocusTarget="first-node"*/}
                {/*        onClose={()=>setActive(false)}*/}

                {/*    >*/}
                {/*        <ActionList*/}
                {/*            actionRole="menuitem"*/}
                {/*            items={[*/}
                {/*                {*/}
                {/*                    content: 'Assign Product to Seller',*/}
                {/*                    onAction: ()=>handleAssignProductToSeller(id),*/}
                {/*                },*/}

                {/*            ]}*/}
                {/*        />*/}
                {/*    </Popover>*/}
                {/*</IndexTable.Cell>*/}

                <IndexTable.Cell>
                    <Tooltip content="Assign Product to Seller">
                        <Button size="micro" onClick={() => handleAssignProductToSeller( id,seller_email,vendor_store_name )}>
                            <Icon source={EditMinor}></Icon>
                        </Button>
                    </Tooltip>
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
                    setModalReassign(false);
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

                    {/*<InputField*/}
                    {/*    label='Seller Email *'*/}
                    {/*    marginTop*/}
                    {/*    type='text'*/}
                    {/*    name='seller_email'*/}
                    {/*    value={sellerEmail}*/}
                    {/*    onChange={handleSellerEmail}*/}

                    {/*/>*/}

                    <Autocomplete
                        marginTop
                        options={sellerEmailList}
                        selected={sellerEmailListSelected}
                        textField={sellerEmailTextField}
                        loading={optionsLoading}
                        onSelect={
                            setSellerListSelected
                        }
                        listTitle="Sellers"
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
                                        { title: 'Seller' },
                                        { title: 'Action' },
                                    ]}
                                    bulkActions={bulkActions}
                                    promotedBulkActions={promotedBulkActions}
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

                    </Card>

                </Page>

            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

