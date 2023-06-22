import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Layout, Card, Modal, Text, Stack, ButtonGroup, Button, PageActions, Form, FormLayout,
    Toast, List, TextContainer, Banner, Loading, Scrollable, Avatar, EmptyState, TextField,
    Listbox, EmptySearchResult, AutoSelection, Tabs, Icon, Select, SkeletonBodyText
} from '@shopify/polaris';
import {
    SearchMinor, ChevronDownMinor, ChevronUpMinor,
} from '@shopify/polaris-icons';
import { SkeltonPageForTable } from '../components/global/SkeltonPage'
import {  InputField } from '../components/Utils/InputField'
import {  CheckBox } from '../components/Utils/CheckBox'
import { AppContext } from '../components/providers/ContextProvider'

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import EmptyCheckBox from '../assets/icons/EmptyCheckBox.png'
import FillCheckBox from '../assets/icons/FillCheckBox.png'
import {getAccessToken} from "../assets/cookies";


export function MailSmtp() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [discountError, setDiscountError] = useState()
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [discardModal, setDiscardModal] = useState(false)
    const [storeDescriptioncontent, setStoreDescriptionContent] = useState('');
    const [sellerDescriptioncontent, setSellerDescriptionContent] = useState('');
    const [sellerPolicycontent, setSellerPolicyContent] = useState('');
    const [skeleton, setSkeleton] = useState(false)





    // =================Products Modal Code Start Here================
    const [productsLoading, setProductsLoading] = useState(false)
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadProducts, setToggleLoadProducts] = useState(true)
    const [productTab, setProductTab] = useState(0);
    const [productsModal, setProductsModal] = useState(false)
    const [expandedProduct, setExpandedProduct] = useState([])
    const [globalProducts, setGlobalProducts] = useState([])
    const [productsList, setProductsList] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [selectedVariantProducts, setSelectedVariantProducts] = useState([])
    const [checkedVariants, setCheckedVariants] = useState([])
    const [previousCheckedVariants, setPreviousCheckedVariants] = useState([])
    const [smtpType, setSmtpType] = useState('tls');

    const handleProductTabChange = useCallback(
        (selectedTabIndex) => setProductTab(selectedTabIndex),
        [],
    );

    const productModalTabs = [
        {
            id: 'all-products',
            content: 'All products',
        },
        {
            id: 'selected-products',
            content: 'Selected products',
        },
    ];

    const handleSelectProductsModal = () => {
        setProductsModal(true)
    }

    const handleProductsCancelModal = () => {
        setProductsModal(false)
        setCheckedVariants(previousCheckedVariants)
    }


    const [discount, setDiscount] = useState({
        code: '',
        title: '',
        appliesTo: 'all',
        type: 'percentage',
        value: '',
        minimumRequirement: 'none',
        minimumValue: '',
        collections: null,
        products: null,
        variants: null,
        status: '',
    })



    const handleDiscardModal = () => {
        setDiscardModal(!discardModal)
    }

    const discardAddSeller = () => {
        navigate('/sellerslisting')
    }
    const handleProductsSaveModal = () => {
        setProductsModal(false)
        setPreviousCheckedVariants(checkedVariants)
    }

    function handleStoreDescription(event, editor) {
        const data = editor.getData();
        console.log(data)
        setStoreDescriptionContent(data);
    }

    function handleSellerDescription(event, editor) {
        const data = editor.getData();
        console.log(data)
        setSellerDescriptionContent(data);
    }
    function handleSellerPolicy(event, editor) {
        const data = editor.getData();
        console.log(data)
        setSellerPolicyContent(data);
    }


    const productsModalClose = () => {
        setProductsModal(false)
        setCheckedVariants([])
        setPreviousCheckedVariants([])
        setProductsLoading(false)
        setToggleLoadProducts(false)
        setProductTab(0)
        setQueryValue('')
        setExpandedProduct([])
        let list = []
        let all = []
        globalProducts?.slice(0, 20).map((item) => {
            list.push(item)
        })
        globalProducts?.slice(0, 20).map((item) => {
            all.push(item)
        })
        setProductsList(list)
        setAllProducts(all)
        setGlobalProducts(all)
        setSelectedVariantProducts([])
    }

    function SetCustomVariantsSelected(checked, type) {
        if (type == 'all') {
            let array1 = []
            checkedVariants?.map((item) => {
                allProducts?.map((item1) => {
                    let value1 = item1.variants.find(item2 => item2.id == item)
                    if (value1) {
                        array1.push(value1.id)
                    }
                })
            })
            let array2 = checkedVariants.filter(function (item) {
                return !array1.includes(item);
            })
            let array3 = checked.concat(array2);
            array3 = [...new Set(array3)];

            setCheckedVariants(array3)
        }
        else if (type == 'selected') {
            setCheckedVariants(checked)
        }
    }

    useEffect(() => {
        // console.log('checkedVariants: ', checkedVariants)
        // console.log('previousCheckedVariants: ', previousCheckedVariants)

        let nodes = groupProductNodes(allProducts)
        setProductsList(nodes)

        let selectedNodes = []
        let products = []
        checkedVariants?.map((item) => {
            globalProducts?.map((item2) => {
                if (item2?.variants?.length > 0) {
                    let value2 = item2.variants.find(item4 => item4.id == item)
                    if (value2) {
                        products.push(item2.id)
                        selectedNodes.push(item2)
                    }
                }
            })
        })

        let filtered = [...new Set(products)];
        if (checkedVariants?.length < 1) {
            setDiscount({
                ...discount,
                variants: null,
                products: null
            })
        }
        else {
            setDiscount({
                ...discount,
                variants: checkedVariants,
                products: filtered
            })
        }





        selectedNodes = selectedNodes.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.id === value.id
                ))
        )
        setSelectedVariantProducts(groupProductNodes(selectedNodes))

    }, [checkedVariants])



    function getSelectedVariantsLength(product) {
        let number = 0
        allProducts?.map((item) => {
            if (item.id == product) {
                item.variants?.map((item2) => {
                    if (checkedVariants?.find(obj => obj == item2.id)) {
                        number = number + 1
                    }
                })
            }
        })
        return number;
    }

    function groupProductNodes(data) {
        let arr = []
        data?.map((item) => {
            let variants = []
            if (item.variants?.length > 0) {
                item.variants?.map((item2) => {
                    variants.push({
                        value: item2.id,
                        label: <>
                            <span>{item2.title}</span>
                            <span>
                                ${item2.price}
                            </span>
                        </>,
                    })
                })
            }
            arr.push({
                value: item.id,
                label: <>
                    <span className='Product-Avatar'>
                        <Avatar
                            size="extraSmall"
                            name={item.title}
                            source={item.image}
                        />
                        <span>{item.title}</span>
                    </span>
                    <span>
                        {`${getSelectedVariantsLength(item.id)}/${item.totalVariants} selected`}
                    </span>
                </>,
                children: variants,
            })
        })

        return arr;
    }

    function variantsArraySet(variants, type) {
        let arr = []
        if (type == 'get') {
            if (variants?.edges?.length > 0) {
                variants?.edges?.map((item) => {
                    arr.push({
                        id: item.node.id.replace('gid://shopify/ProductVariant/', ''),
                        title: item.node.title,
                        price: item.node.price,
                        productId: item.node.product.id.replace('gid://shopify/Product/', ''),
                    })
                })
            }
        }
        else if (type == 'set') {
            if (variants?.length > 0) {
                variants?.map((item) => {
                    arr.push({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        productId: item.product_id,
                    })
                })
            }
        }
        return arr;
    }

    function productsArraySet(products, type, value) {
        let nextValue = ''
        let productsArray = []
        if (type == 'get') {
            products?.edges?.map((item) => {
                nextValue = item.cursor
                productsArray.push({
                    id: item.node.id.replace('gid://shopify/Product/', ''),
                    title: item.node.title,
                    status: item.node.status,
                    totalVariants: item.node.totalVariants,
                    variants: variantsArraySet(item.node.variants, 'get'),
                    image: item.node.featuredImage?.transformedSrc,
                })
            })
            if (value == 'products') {
                return productsArray;
            }
            else if (value == 'nextPage') {
                return nextValue;
            }
        }

        else if (type == 'set') {
            products?.map((item) => {
                productsArray.push({
                    id: item.id.toString(),
                    title: item.title,
                    status: item.status,
                    totalVariants: item.variants?.length ? item.variants?.length : 0,
                    variants: variantsArraySet(item.variants, 'set'),
                    image: item.image?.src,
                })
            })
            if (value == 'products') {
                return productsArray;
            }
        }

    }



    const handleProductsPagination = () => {
        if (hasNextPage) {
            setProductsLoading(true);
            setToggleLoadProducts(true)
        }
    };

    const LazyLoadingMarkup = productsLoading ? (
        <Listbox.Loading
            accessibilityLabel={`${queryValue ? 'Filtering' : 'Loading'
            } Products`}
        />
    ) : allProducts?.length > 0 && hasNextPage ? <Button onClick={handleProductsPagination}>Load more...</Button> : null;

    const noResultsMarkup =
        !productsLoading && allProducts.length == 0 ? (
            <EmptySearchResult
                title="No product found"
                // description={`No product found`}
            />
        ) : null;


    const listboxMarkup = (
        <div >
            <Listbox
                enableKeyboardControl
                autoSelection={AutoSelection.FirstSelected}
            >
                {LazyLoadingMarkup}
                {noResultsMarkup}
            </Listbox>
        </div>
    );

    const handleQueryChange = (query) => {
        setQueryValue(query);

        setProductsLoading(true)
        setNextPageCursor('')
        setProductsList([])
        setAllProducts([])
        setTimeout(() => {
            setToggleLoadProducts(true)
        }, 500);


    };

    const handleQueryClear = () => {
        handleQueryChange('');
    };

    // =================Products Modal Code Ends Here================


    // =================Collections Modal Code Start Here================
    const [collectionsLoading, setCollectionsLoading] = useState(false)
    const [collectionQueryValue, setCollectionQueryValue] = useState('');
    const [toggleLoadCollections, setToggleLoadCollections] = useState(true)
    const [collectionTab, setCollectionTab] = useState(0);
    const [collectionModal, setCollectionModal] = useState(false)
    const [expandedCollection, setExpandedCollection] = useState([])
    const [globalCollections, setGlobalCollections] = useState([])
    const [collectionsList, setCollectionsList] = useState([])
    const [allCollections, setAllCollections] = useState([])
    const [hasNextPageCollection, setHasNextPageCollection] = useState(false)
    const [nextPageCursorCollection, setNextPageCursorCollection] = useState('')
    const [selectedVariantCollections, setSelectedVariantCollections] = useState([])
    const [checkedVariantsCollections, setCheckedVariantsCollections] = useState([])
    const [previousCheckedVariantsCollections, setPreviousCheckedVariantsCollections] = useState([])



    const [smtpHost, setSmtpHost] = useState('')
    const [smtpUsername, setSmtpUsername] = useState('')
    const [smtpPassword, setSmtpPassword] = useState('')
    const [smtpEmail, setSmtpEmail] = useState('')
    const [smtpFromName, setSmtpFromName] = useState('')
    const [smtpReplyTo, setSmtpReplyTo] = useState('')
    const [smtpPort, setSmtpPort] = useState('')


    const handleCollectionTabChange = useCallback(
        (selectedTabIndex) => setCollectionTab(selectedTabIndex),
        [],
    );

    const collectionModalTabs = [
        {
            id: 'all-collections',
            content: 'All Collections',
        },
        {
            id: 'selected-collections',
            content: 'Selected Collections',
        },
    ];




    const handleCollectionsPagination = () => {
        if (hasNextPageCollection) {
            setCollectionsLoading(true);
            setToggleLoadCollections(true)
        }
    };

    const LazyLoadingMarkupCollection = collectionsLoading ? (
        <Listbox.Loading
            accessibilityLabel={`${collectionQueryValue ? 'Filtering' : 'Loading'
            } Products`}
        />
    ) : allCollections?.length > 0 && hasNextPageCollection ? <Button onClick={handleCollectionsPagination}>Load more...</Button> : null;

    const noResultsMarkupCollection =
        !collectionsLoading && allCollections.length == 0 ? (
            <EmptySearchResult
                title="No Collection found"
            />
        ) : null;


    const listboxMarkupCollection = (
        <div >
            <Listbox
                enableKeyboardControl
                autoSelection={AutoSelection.FirstSelected}
            >
                {LazyLoadingMarkupCollection}
                {noResultsMarkupCollection}
            </Listbox>
        </div>
    );

    const handleQueryChangeCollection = (query) => {
        setCollectionQueryValue(query);

        setCollectionsLoading(true)
        setNextPageCursorCollection('')
        setCollectionsList([])
        setAllCollections([])
        setTimeout(() => {
            setToggleLoadCollections(true)
        }, 500);


    };

    const handleQueryClearCollection = () => {
        handleQueryChangeCollection('');
    };



    // =================Collections Modal Code Ends Here================



    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;




    const handleDiscount = (e) => {
        setDiscount({ ...discount, [e.target.name]: e.target.value })
    }


    const handleSmtpHost = (e) => {
        setSmtpHost(e.target.value)
    }
    const handleSmtpUsername = (e) => {
        setSmtpUsername(e.target.value)
    }
    const handleSmtpPassword = (e) => {
        setSmtpPassword(e.target.value)
    }
    const handleSmtpEmail = (e) => {
        setSmtpEmail(e.target.value)
    }
    const handleSmtpFromName = (e) => {
        setSmtpFromName(e.target.value)
    }
    const handleSmtpReplyTo = (e) => {
        setSmtpReplyTo(e.target.value)
    }

   const handleSmtpPort = (e) => {
        setSmtpPort(e.target.value)
    }



    const getMailSmtpData = async () => {

        setSkeleton(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/mail-smtp-setting`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setSmtpHost(response?.data?.data?.smtp_host)
            setSmtpUsername(response?.data?.data?.smtp_username)
            setSmtpPassword(response?.data?.data?.smtp_password)
            setSmtpEmail(response?.data?.data?.email_from)
            setSmtpFromName(response?.data?.data?.from_name)
            setSmtpReplyTo(response?.data?.data?.reply_to)
            setSmtpType(response?.data?.data?.smtp_type)
            setSmtpPort(response?.data?.data?.smtp_port)

            setSkeleton(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    const mailSmtpDataSave = async () => {

        setSkeleton(true)
        setBtnLoading(true)
        console.log('smtpType',smtpType)
        const sessionToken = getAccessToken();
        try {

            let data = {
                smtp_host: smtpHost,
                smtp_username: smtpUsername,
                smtp_password: smtpPassword,
                email_from: smtpEmail,
                from_name: smtpFromName,
                reply_to:smtpReplyTo,
                smtp_type:smtpType,
                smtp_port:smtpPort,
            }

            const response = await axios.post(`${apiUrl}/mail-smtp-setting-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setSkeleton(false)
            setBtnLoading(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };


    useEffect(() => {
        getMailSmtpData();
    }, []);


    const smtpTypeOptions=[

        {label: "TLS", value: "tls"},
        {label: "SSL", value: "ssl"},
        {label: "STARTTLS", value: "start_tls"},
    ];

    const handleSmtpType = useCallback((value) => setSmtpType(value), []);
    return (
        <div className='Discount-Detail-Page'>



            <Modal
                open={discardModal}
                onClose={handleDiscardModal}
                title="Leave page with unsaved changes?"
                primaryAction={{
                    content: 'Leave page',
                    destructive: true,
                    onAction: discardAddSeller,
                }}
                secondaryActions={[
                    {
                        content: 'Stay',
                        onAction: handleDiscardModal,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>
                            Leaving this page will delete all unsaved changes.
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>

            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForProductDetail />
                </span>
                :
                <Page
                    breadcrumbs={[{ content: 'Discounts', onAction: handleDiscardModal }]}
                    title="Mail SMTP Setting"
                >
                    {discountError ?
                        <Banner
                            title="There is 1 error with this discount:"
                            status="critical"
                        >
                            <List>
                                <List.Item>
                                    Specific {discountError} must be added
                                </List.Item>
                            </List>
                        </Banner> : ''
                    }

                    <Form >
                        <FormLayout>
                            <Card sectioned title='Mail SMTP Setting'>

                                {skeleton ? <SkeletonBodyText/> :
                                    <>
                                <Text variant="bodyMd" as="p" fontWeight="regular">
                                    {`Here you can set up mail smtp settings. `}
                                </Text>

                                <div >
                                    <InputField

                                        label='SMTP Host*'
                                        type='text'
                                        marginTop
                                        required
                                        name='code'
                                        value={smtpHost}
                                        onChange={handleSmtpHost}
                                        helpText="Enter Host name of Mail SMTP"
                                    />
                                </div>

                                <InputField

                                    label='SMTP Username*'
                                    type='text'
                                    marginTop
                                    required
                                    name='code'
                                    value={smtpUsername}
                                    onChange={handleSmtpUsername}
                                    helpText="Enter Username of Mail SMTP"
                                />
                                <InputField

                                    label='Password*'
                                    type='password'
                                    marginTop
                                    required
                                    name='code'
                                    value={smtpPassword}
                                    onChange={handleSmtpPassword}
                                    helpText="Enter Password  of Mail SMTP"
                                />

                                <InputField

                                    label='Email From*'
                                    type='email'
                                    marginTop
                                    required
                                    name='code'
                                    value={smtpEmail}
                                    onChange={handleSmtpEmail}
                                    helpText="Enter Email ID of sender"
                                />
                                <InputField

                                    label='From Name*'
                                    type='text'
                                    marginTop
                                    required
                                    name='code'
                                    value={smtpFromName}
                                    onChange={handleSmtpFromName}
                                    helpText="Enter Name of sender"
                                />
                                <InputField

                                    label='Reply TO*'
                                    type='text'
                                    marginTop
                                    required
                                    name='code'
                                    value={smtpReplyTo}
                                    onChange={handleSmtpReplyTo}
                                    helpText="Enter Email ID where recipient can revert back."
                                />

                                <div className="label_editor">
                                    <Select
                                        label="SMTP Type"
                                        options={smtpTypeOptions}
                                        onChange={handleSmtpType}
                                        value={smtpType}
                                    />
                                </div>

                                <InputField

                                    label='SMTP Port*'
                                    type='text'
                                    marginTop
                                    required
                                    name='code'
                                    value={smtpPort}
                                    onChange={handleSmtpPort}
                                    helpText="Enter your SMTP port number."
                                />
                                    </>
                                }
                            </Card>


                        </FormLayout>
                    </Form>


                    <div className='Polaris-Product-Actions'>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: mailSmtpDataSave,
                                loading: btnLoading
                            }}

                        />
                    </div>
                </Page >
            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
