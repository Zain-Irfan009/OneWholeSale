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
    Layout,
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
    TextContainer,
    DropZone, PageActions
} from '@shopify/polaris';
import {SearchMinor, ExternalMinor, DeleteMinor, HorizontalDotsMinor, NoteMinor} from '@shopify/polaris-icons';
import { AppContext } from '../../components/providers/ContextProvider'
import { SkeltonPageForTable } from '../../components/global/SkeltonPage'
import { CustomBadge } from '../../components/Utils/CustomBadge'
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {InputField} from "../../components/Utils";
import {getAccessToken} from "../../assets/cookies";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import dateFormat from "dateformat";



export function Profile() {
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


    const [file3, setFile3] = useState();
    const [file4, setFile4] = useState();
    const [file5, setFile5] = useState();


    const [fileUrl3, setFileUrl3] = useState();
    const [fileUrl4, setFileUrl4] = useState();
    const [fileUrl5, setFileUrl5] = useState();

    const [name, setName] = useState("");
    const [shopName, setShopName] = useState("");
    const [email, setEmail] = useState("");
    const [storeAddress, setStoreAddress] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [contact, setcontact] = useState("");
    const [storeDescription, setDescription] = useState("");
    const [sellerDescription, setSellerDescription] = useState("");
    const [sellerPolicy, setSellerPolicy] = useState("");
    const [handle, setHandle] = useState("");

    const [commissions, setCommissions] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)
    const [pageCursor, setPageCursor] = useState('next')
    const [pageCursorValue, setPageCursorValue] = useState('')
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [previousPageCursor, setPreviousPageCursor] = useState('')
    const [orderStatus, setOrderStatus] = useState('')

    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);
    const [currency, setCurrency] = useState('');

    const [storeDescriptioncontent, setStoreDescriptionContent] = useState("");
    const [sellerDescriptioncontent, setSellerDescriptionContent] = useState("");
    const [sellerPolicycontent, setSellerPolicyContent] = useState("");


    const [toggleLoadData1, setToggleLoadData1] = useState(true);

    const handlePaginationTabs = (active1, page) => {
        if (!active1) {
            setPagination(page);
            setToggleLoadData1(!toggleLoadData1);
        }
    };

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


    function handleStoreDescription(event, editor) {
        const data = editor.getData();
        console.log(data);
        setStoreDescriptionContent(data);
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
        setPageCursorValue('')
        setQueryValue(value)

        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/seller/search-commission?value=${value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setCommissions(response?.data?.data)


        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

        setTimeout(() => {
            setToggleLoadData(true)
        }, 1000);
    }


    function handleSellerDescription(event, editor) {
        const data = editor.getData();
        console.log(data);
        setSellerDescriptionContent(data);
    }
    function handleSellerPolicy(event, editor) {
        const data = editor.getData();
        console.log(data);
        setSellerPolicyContent(data);
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
    const validImageTypes = [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/svg",
    ];

    const handleDropZoneDrop3 = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFile3((file3) => acceptedFiles[0]),
        []

    );

    const handleDropZoneDrop4 = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFile4((file4) => acceptedFiles[0]),
        []
    );
    const handleDropZoneDrop5 = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFile5((file5) => acceptedFiles[0]),
        []
    );


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


    const handleBannerRemove1 = (type) => {
        if (type == "favicons") {
            setFileUrl5();
        }
    };
    const handleBannerRemove = (type) => {
        if (type == "favicons") {
            setFile5();
        }
    };

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

        const sessionToken = getAccessToken();
        setLoading(true)
        try {

            const response = await axios.get(`${apiUrl}/seller/seller-profile`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setName(response?.data?.name)
            setShopName(response?.data?.seller_shopname)
            setEmail(response?.data?.email)
            setStoreAddress(response?.data?.seller_store_address)
            setZipcode(response?.data?.seller_zipcode)
            setcontact(response?.data?.seller_contact)
            setStoreDescriptionContent(response?.data?.seller_store_description)
            setSellerDescriptionContent(response?.data?.seller_description)
            setSellerPolicyContent(response?.data?.seller_policy)
            setFileUrl5(response?.data?.store_banner_image)
            setFileUrl3(response?.data?.seller_image)
            setFileUrl4(response?.data?.seller_shop_image)
            setHandle(response?.data?.collection_handle)
setLoading(false)


        } catch (error) {
            console.log(error)
            setLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }


    useEffect(() => {
        getData();
    }, [toggleLoadData1]);

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(commissions);


    const handleRemoveImage = (type) => {
        if (type == "favicons") {
            setFile3();
        }
    };

    const handleRemoveImage1 = (type) => {
        if (type == "favicons") {
            setFileUrl3();
        }
    };
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
        // setLoading(false)
        // c(false)
    }, [toggleLoadData])

    const handleRemoveShopImage1 = (type) => {
        if (type == "favicons") {
            setFileUrl4();
        }
    };

    const handleRemoveShopImage = (type) => {
        if (type == "favicons") {
            setFile4();
        }
    };

    return (
        <div className="Customization-Page">
            <Page fullWidth title="Profile">

                    {loading ? (
                        <span>
              <Loading />
              <SkeltonPageForTable />
            </span>
                    ) : (
                        <>
                            <div className="Profile-Tab">
                                <Layout>
                                    <Layout.Section secondary>
                                        <Text variant="headingMd" as="h6">
                                          Seller Information
                                        </Text>
                                        <Text variant="bodyMd" as="p">
                                           You can edit your information and store Information
                                        </Text>
                                        <Text variant="bodyMd" as="p">
                                           Email will not be changed
                                        </Text>
                                    </Layout.Section>

                                    <Layout.Section>
                                        <Card sectioned>
                                            <InputField
                                                type="text"
                                                label="Name"
                                                name="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                // error={formErrors.name}
                                                autoComplete="off"
                                                placeholder="Enter First Name"
                                            />
                                            <InputField
                                                marginTop
                                                type="email"
                                                label="Email"
                                                name="email"
                                                value={email}
                                                // onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="off"
                                                readOnly
                                                placeholder="Enter Email Address"
                                            />
                                            <InputField
                                                marginTop
                                                type="number"
                                                label="Contact Number"
                                                name="number"
                                                value={contact}
                                                onChange={(e) => setcontact(e.target.value)}
                                                autoComplete="off"
                                                placeholder="Enter Contact Number"
                                            />
                                            <InputField
                                                marginTop
                                                type="text"
                                                label="Zipcode"
                                                name="zipcode"
                                                value={zipcode}
                                                onChange={(e) => setZipcode(e.target.value)}
                                                autoComplete="off"
                                                placeholder="Enter Zipcode"
                                            />

                                            <div className="label_editor">
                                                <label>Seller Description *</label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={sellerDescriptioncontent}
                                                    onChange={handleSellerDescription}
                                                />
                                            </div>

                                            <div className="label_editor">
                                                <label>Seller Policy *</label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={sellerPolicycontent}
                                                    onChange={handleSellerPolicy}
                                                />
                                            </div>




                                            <div>

                                                <div className="margin-top">
                                                    <label>Image</label>
                                                    {!file3 && !fileUrl3 && (
                                                        <DropZone
                                                            allowMultiple={false}
                                                            onDrop={handleDropZoneDrop3}
                                                            accept="image/*"
                                                            type="image"
                                                        >

                                                            {!file3 && !fileUrl3 && (
                                                                <DropZone.FileUpload actionTitle={"Add Image"} />
                                                            )}

                                                        </DropZone>
                                                    )}
                                                    {file3 &&  (
                                                        <img
                                                            style={{ maxWidth: "300px", maxHeight: "200px" }}
                                                            src={
                                                                validImageTypes.includes(file3.type)
                                                                    ? window.URL.createObjectURL(file3)
                                                                    : NoteMinor
                                                            }
                                                        />
                                                    )}
                                                    {fileUrl3 && fileUrl3 != 'null' && !file3 &&
                                                        <img
                                                            style={{ maxWidth: "600px", maxHeight: "200px" }}
                                                            src={`${fileUrl3}`}
                                                        />

                                                    }
                                                </div>
                                                {file3 ? (
                                                    <span className="Image-Remove">
                          <Button
                              plain
                              onClick={() => handleRemoveImage("favicons")}
                          >
                            Remove
                          </Button>
                        </span>
                                                ) : (
                                                    ""
                                                )}

                                                {fileUrl3 ? (
                                                    <span className="Image-Remove">
                        <Button
                            plain
                            onClick={() => handleRemoveImage1("favicons")}
                        >
                          Remove
                        </Button>
                      </span>
                                                ) :  (
                                                    ""
                                                )}
                                            </div>


                                            <br />

                                        </Card>
                                    </Layout.Section>
                                </Layout>


                                <div className="margin-top">
                                <Layout >
                                    <Layout.Section secondary>
                                        <Text variant="headingMd" as="h6">
                                            Store Information
                                        </Text>
                                        {/*<Text variant="bodyMd" as="p">*/}
                                        {/*    Set timezone so you can plan marketing activities*/}
                                        {/*    according to your customers' daily schedule. If*/}
                                        {/*    you are selling on a foreign market, you should*/}
                                        {/*    select timezone of your customers.*/}
                                        {/*</Text>*/}
                                    </Layout.Section>

                                    <Layout.Section>
                                        <Card sectioned>
                                            <div className="TimeZone-Section">

                                                <InputField
                                                    label="Shop Name *"
                                                    placeholder="Enter Seller Shop Name Here"
                                                    type="text"
                                                    marginTop
                                                    name="title"
                                                    value={shopName}
                                                    onChange={(e) => setShopName(e.target.value)}
                                                    // error={formErrors.shopName}
                                                />

                                                <InputField
                                                    multiline={1}
                                                    label="Store Address *"
                                                    placeholder="Enter Seller's Store Physical Address"
                                                    type="text"
                                                    marginTop
                                                    name="title"
                                                    value={storeAddress}
                                                    onChange={(e) => setStoreAddress(e.target.value)}
                                                    // error={formErrors.storeAddress}
                                                />

                                                <div className="label_editor">
                                                    <label>Store Description *</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={storeDescriptioncontent}
                                                        onChange={handleStoreDescription}
                                                    />
                                                </div>

                                                <label> Upload Banner here</label>
                                                <div className="margin-top" />
                                                <div>
                                                    {!file5 && !fileUrl5 && (
                                                        <DropZone
                                                            allowMultiple={false}
                                                            onDrop={handleDropZoneDrop5}
                                                            accept="image/*"
                                                            type="image"
                                                        >

                                                            {!file5 && !fileUrl5 && (
                                                                <DropZone.FileUpload actionTitle={"Add Image"} />
                                                            )}
                                                        </DropZone>
                                                    )}
                                                    {file5 && (
                                                        <img
                                                            style={{ maxWidth: "600px", maxHeight: "200px" }}
                                                            src={
                                                                validImageTypes.includes(file5.type)
                                                                    ? window.URL.createObjectURL(file5)
                                                                    : NoteMinor
                                                            }
                                                        />
                                                        //   <Thumbnail
                                                        //     size="large"
                                                        //     alt={file5.name}
                                                        //     source={
                                                        //       validImageTypes.includes(file5.type)
                                                        //         ? window.URL.createObjectURL(file5)
                                                        //         : NoteMinor
                                                        //     }
                                                        //   />
                                                    )}

                                                    {fileUrl5 && fileUrl5 != 'null' && !file5 &&
                                                        <img
                                                            style={{ maxWidth: "600px", maxHeight: "200px" }}
                                                            src={`${fileUrl5}`}
                                                        />

                                                    }
                                                </div>
                                                <div className="margin-top" />
                                                {file5 ? (
                                                    <span className="Image-Remove">
                        <Button
                            plain
                            onClick={() => handleBannerRemove("favicons")}
                        >
                          Remove
                        </Button>
                      </span>
                                                ) :  (
                                                    ""
                                                )}

                                                {fileUrl5 ? (
                                                    <span className="Image-Remove">
                        <Button
                            plain
                            onClick={() => handleBannerRemove1("favicons")}
                        >
                          Remove
                        </Button>
                      </span>
                                                ) :  (
                                                    ""
                                                )}

                                                <div>
                                                    <div>
                                                        <label> Upload Store logo here</label>
                                                        {!file4 && !fileUrl4 && (
                                                            <DropZone
                                                                allowMultiple={false}
                                                                onDrop={handleDropZoneDrop4}
                                                                accept="image/*"
                                                                type="image"
                                                            >
                                                                {!file4 && !fileUrl4 && (
                                                                    <DropZone.FileUpload actionTitle={"Add Image"} />
                                                                )}





                                                            </DropZone>
                                                        )}
                                                        {file4 && (
                                                            <img
                                                                style={{ maxWidth: "600px", maxHeight: "200px" }}
                                                                src={
                                                                    validImageTypes.includes(file4.type)
                                                                        ? window.URL.createObjectURL(file4)
                                                                        : NoteMinor
                                                                }
                                                            />
                                                        )}

                                                        {fileUrl4 && fileUrl4 != 'null' && !file4 &&
                                                            <img
                                                                style={{ maxWidth: "600px", maxHeight: "200px" }}
                                                                src={`${fileUrl4}`}
                                                            />

                                                        }
                                                    </div>
                                                    {file4 ? (
                                                        <span className="Image-Remove">
                          <Button
                              plain
                              onClick={() => handleRemoveShopImage("favicons")}
                          >
                            Remove
                          </Button>
                        </span>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {fileUrl4 ? (
                                                        <span className="Image-Remove">
                          <Button
                              plain
                              onClick={() => handleRemoveShopImage1("favicons")}
                          >
                            Remove
                          </Button>
                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </Layout.Section>
                                </Layout>
                                </div>
                                <div className="Polaris-Product-Actions">
                                    <PageActions
                                        primaryAction={{
                                            content: "Update",
                                            // onAction: submitData,
                                            // loading: btnLoading,
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

            </Page>

            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}

