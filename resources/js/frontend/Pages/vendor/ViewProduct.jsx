import React, { useState, useCallback, useEffect, useContext,useMemo } from 'react';
import {
    Page, Layout, Card, Modal, Text, Stack, ButtonGroup, Button, PageActions, Form, FormLayout,
    Toast, List, TextContainer, Banner, Loading, Scrollable, Avatar, EmptyState, TextField,
    Listbox, EmptySearchResult, AutoSelection, Tabs, Icon,Select,Tag,Autocomplete,LegacyStack,Checkbox,DropZone,Thumbnail,Combobox
} from '@shopify/polaris';
import {
    SearchMinor, ChevronDownMinor, ChevronUpMinor,DeleteMinor
} from '@shopify/polaris-icons';
import { SkeltonPageForTable } from '../../components/global/SkeltonPage'
import {  InputField } from '../../components/Utils/InputField'
import {  CheckBox } from '../../components/Utils/CheckBox'
import { AppContext } from '../../components/providers/ContextProvider'
import { useNavigate,useParams } from 'react-router-dom';
import axios from "axios";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import EmptyCheckBox from '../../assets/icons/EmptyCheckBox.png'
import FillCheckBox from '../../assets/icons/FillCheckBox.png'



export function ViewProduct() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const params = useParams();
    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [discountError, setDiscountError] = useState()
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [discardModal, setDiscardModal] = useState(false)


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
    const [productType, setProductType] = useState('none');
    const [inventoryTrack, setInventoryTrack] = useState('not_track');
    const [descriptioncontent, setDescriptionContent] = useState('');


    const handleProductTabChange = useCallback(
        (selectedTabIndex) => setProductTab(selectedTabIndex),
        [],
    );


    const productTypeOptions=[

        {label: 'Normal Product', value: 'normal'},
    ];
    const handleProductType = useCallback((value) => setProductType(value), []);


    const handleTrackInventory = useCallback((value) => setInventoryTrack(value), []);
    const trackInventoryOptions=[

        {label: "Don't Track inventory", value: "not_track"},
        {label: "Track This Product's inventory", value: "track"},
    ];

    function handleDescription(event, editor) {
        const data = editor.getData();
        console.log(data)
        setDescriptionContent(data);
    }

    const getProductData=async (id)=>{
        console.log(id)
    }

    useEffect(()=>{
        getProductData(params.view_product_id)

    },[])

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



    function convertBooleanToNumber(value) {
        let booleanValue;
        if (value === true) {
            booleanValue = 1;
        }
        else {
            booleanValue = 0;
        }

        return booleanValue;
    }

    const handleDiscardModal = () => {
     navigate('/vendor/products')
    }



    const handleCreateDiscount = () => {
        document.getElementById('createDiscountBtn').click();
    }



    // -------------------Tags------------------------


    const collectionUpdateText = useCallback(
        (value) => {
            setCollectionInputValue(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === '') {
                    setCollectionOptions(CollectionsOptionsData);
                    setOptionsLoading(false);
                    return;
                }

                const filterRegex = new RegExp(value, 'i');
                const resultOptions = CollectionsOptionsData.filter((option) =>
                    option.label.match(filterRegex),
                );
                let endIndex = resultOptions.length - 1;
                if (resultOptions.length === 0) {
                    endIndex = 0;
                }
                setCollectionOptions(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [CollectionsOptionsData, optionsLoading, collectionOptionsSelected],
    );


    const CollectionsOptionsData = useMemo(
        () => [
            { value: 'Catalogs', label: 'catalog' },
            { value: 'Zippo Display', label: 'zippo' },

        ],
        [],
    );


    const [collectionOptions, setCollectionOptions] = useState(CollectionsOptionsData);

    const [collectionOptionsSelected, setCollectionOptionsSelected] = useState('');
    const [tagInputValue, setTagInputValue] = useState('');
    const [collectionInputValue, setCollectionInputValue] = useState('');
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [price, setPrice] = useState();
    const [compareatPrice, setCompareatPrice] = useState();
    const [chargeTaxChecked, setChargeTaxChecked] = useState(false);
    const [allowCustomer, setAllowCustomer] = useState(false);
    const [sku, setSku] = useState();
    const [barcode, setBarcode] = useState();
    const [quantity, setQuantity] = useState();
    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [mediaFiles, setImageFiles] = useState([]);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    const hasImageError = rejectedFiles.length > 0;
    const [productHandle, setProductHandle] = useState('');
    const [titleMetafield, setTitleMetafield] = useState('');
    const [descriptionMetafield, setDescriptionMetafield] = useState('');

    const handleChargeTax = useCallback(
        (newChecked) => setChargeTaxChecked(newChecked),
        [],
    );
    const handleAllowCustomer = useCallback(
        (newChecked) => setAllowCustomer(newChecked),
        [],
    );


    function tagTitleCase(string) {
        return string
            .toLowerCase()
            .split(' ')
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join('');
    }




    const removeCollection = useCallback(
        (collection) => () => {
            const collectionOptions = [...collectionOptionsSelected];
            collectionOptions.splice(collectionOptions.indexOf(collection), 1);
            setCollectionOptionsSelected(collectionOptions);
        },
        [collectionOptionsSelected],
    );




    const collectionsContentMarkup = collectionOptionsSelected.length > 0 ? (
        <div className='Product-Tags-Stack'>
            <Stack spacing="extraTight" alignment="center">
                {collectionOptionsSelected.map((option) => {
                    let tagLabel = '';
                    tagLabel = option.replace('_', ' ');
                    tagLabel = tagTitleCase(tagLabel);
                    return (
                        <Tag key={`option${option}`} onRemove={removeCollection(option)}>
                            {tagLabel}
                        </Tag>
                    );
                })}
            </Stack>
        </div>
    ) : null;



    const collectionTextField = (
        <Autocomplete.TextField
            onChange={collectionUpdateText}
            label="Collections"
            value={collectionInputValue}
            placeholder="Select some options"
            verticalContent={collectionsContentMarkup}
        />
    );

    const handlePrice = useCallback(
        (value) => setPrice(value),
        [],
    );

    const handleSku = useCallback(
        (value) => setSku(value),
        [],
    );
    const handleBarcode = useCallback(
        (value) => setBarcode(value),
        [],
    );

    const handleQuantity = useCallback(
        (value) => setQuantity(value),
        [],
    );

    const handleCompareatPrice = useCallback(
        (value) => setCompareatPrice(value),
        [],
    );
    // --------------------Media Card -------------------
    const toggleOpenFileDialog = useCallback(
        () => setOpenFileDialog((openFileDialog) => !openFileDialog),
        [],
    );

    const imageErrorMessage = hasImageError && (
        <Banner
            title="The following images couldn’t be uploaded:"
            status="critical"
        >
            <List type="bullet">
                {rejectedFiles.map((file, index) => (
                    <List.Item key={index}>
                        {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
                    </List.Item>
                ))}
            </List>
        </Banner>
    );

    const handleDropZoneDrop = useCallback(
        (_droppedFiles, acceptedFiles, rejectedFiles) => {
            setImageFiles((mediaFiles) => [...mediaFiles, ...acceptedFiles]);
            setRejectedFiles(rejectedFiles);
        },
        [],
    );


    const fileUpload = (
        <DropZone.FileUpload
            actionTitle={'Add files'}
            actionHint="Accepts images, videos, or 3D models"
        />
    );


    const dropZone = !mediaFiles.length && (
        <Stack vertical>
            {imageErrorMessage}
            <DropZone accept="image/*, video/*" type="image,video"
                      openFileDialog={openFileDialog}
                      onDrop={handleDropZoneDrop}
                      onFileDialogClose={toggleOpenFileDialog}
            >
                {fileUpload}
            </DropZone>

        </Stack>
    )
    useEffect(()=>{
        console.log('mediaFiles',mediaFiles)
    },[mediaFiles])

    const handleRemoveMedia = (index) => {
        let temp_array=mediaFiles.slice()
        temp_array.splice(index,1)
        setImageFiles(temp_array)
    }


    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/svg'];
    const uploadedFiles = mediaFiles.length > 0 && (
        <Stack id='jjj'>
            {mediaFiles.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <div className='Polaris-Product-Gallery'>
                        <Thumbnail
                            size="large"
                            alt={file.name}
                            source={
                                validImageTypes.indexOf(file.type) > -1
                                    ? window.URL.createObjectURL(file)
                                    : NoteMinor
                            }
                        />
                        <span className="media_hover" onClick={()=>handleRemoveMedia(index)}>
                        <Icon source={DeleteMinor}> </Icon>
    </span>
                    </div>
                </Stack>
            ))}

            <div className='Polaris-Product-DropZone'>
                <Stack alignment="center">
                    <DropZone accept="image/*, video/*" type="image,video"
                              openFileDialog={openFileDialog}
                              onDrop={handleDropZoneDrop}
                              onFileDialogClose={toggleOpenFileDialog}
                    >
                        <DropZone.FileUpload
                            actionTitle={'Add files'}
                        />
                    </DropZone>
                </Stack>
            </div>
        </Stack>
    );


    const handleProductHandle = (e) => {
        setProductHandle(e.target.value)
    }

    const handleTitleMetafield = (e) => {
        setTitleMetafield(e.target.value)
    }
    const handleDescriptionMetafield = (e) => {
        setDescriptionMetafield(e.target.value)
    }

    // -------------------Product Tags------------------------

    const [selectedTags, setSelectedTags] = useState([]);
    const [value, setValue] = useState('');
    const [suggestion, setSuggestion] = useState('');

    const handleActiveOptionChange = useCallback(
        (activeOption) => {
            const activeOptionIsAction = activeOption === value;

            if (!activeOptionIsAction && !selectedTags.includes(activeOption)) {
                setSuggestion(activeOption);
            } else {
                setSuggestion('');
            }
        },
        [value, selectedTags],
    );

    const updateSelection = useCallback(
        (selected) => {
            const nextSelectedTags = new Set([...selectedTags]);

            if (nextSelectedTags.has(selected)) {
                nextSelectedTags.delete(selected);
            } else {
                nextSelectedTags.add(selected);
            }
            setSelectedTags([...nextSelectedTags]);
            setValue('');
            setSuggestion('');
        },
        [selectedTags],
    );


    const removeTag = useCallback(
        (tag) => () => {
            updateSelection(tag);
        },
        [updateSelection],
    );

    const getAllTags = useCallback(() => {
        const savedTags = [];
        return [...new Set([...savedTags, ...selectedTags].sort())];
    }, [selectedTags]);

    const formatOptionText = useCallback(
        (option) => {
            const trimValue = value.trim().toLocaleLowerCase();
            const matchIndex = option.toLocaleLowerCase().indexOf(trimValue);

            if (!value || matchIndex === -1) return option;

            const start = option.slice(0, matchIndex);
            const highlight = option.slice(matchIndex, matchIndex + trimValue.length);
            const end = option.slice(matchIndex + trimValue.length, option.length);

            return (
                <p>
                    {start}
                    <Text fontWeight="bold" as="span">
                        {highlight}
                    </Text>
                    {end}
                </p>
            );
        },
        [value],
    );

    const options = useMemo(() => {
        let list;
        const allTags = getAllTags();
        const filterRegex = new RegExp(value, 'i');

        if (value) {
            list = allTags.filter((tag) => tag.match(filterRegex));
        } else {
            list = allTags;
        }

        return [...list];
    }, [value, getAllTags]);

    const verticalContentMarkup =
        selectedTags.length > 0 ? (
            <LegacyStack spacing="extraTight" alignment="center">
                {selectedTags.map((tag) => (
                    <Tag key={`option-${tag}`} onRemove={removeTag(tag)}>
                        {tag}
                    </Tag>
                ))}
            </LegacyStack>
        ) : null;

    const optionMarkup =
        options.length > 0
            ? options.map((option) => {
                return (
                    <Listbox.Option
                        key={option}
                        value={option}
                        selected={selectedTags.includes(option)}
                        accessibilityLabel={option}
                    >
                        <Listbox.TextOption selected={selectedTags.includes(option)}>
                            {formatOptionText(option)}
                        </Listbox.TextOption>
                    </Listbox.Option>
                );
            })
            : null;

    const noResults = value && !getAllTags().includes(value);
    const actionMarkup = noResults ? (
        <Listbox.Action value={value}>{`Add "${value}"`}</Listbox.Action>
    ) : null;

    const emptyStateMarkup = optionMarkup ? null : (
        <EmptySearchResult
            title=""
            description={`No tags found matching "${value}"`}
        />
    );

    const listboxMarkup =
        optionMarkup || actionMarkup || emptyStateMarkup ? (
            <Listbox
                autoSelection={AutoSelection.None}
                onSelect={updateSelection}
                onActiveOptionChange={handleActiveOptionChange}
            >
                {actionMarkup}
                {optionMarkup}
            </Listbox>
        ) : null;

    return (
        <div className='Discount-Detail-Page'>



            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForProductDetail />
                </span>
                :
                <Page
                    breadcrumbs={[{ content: 'Discounts', onAction: handleDiscardModal }]}
                    title="View Product"

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

                    <Layout>
                        <Layout.Section>
                            <Form onSubmit>
                                <FormLayout>
                                    <span className='VisuallyHidden'>
                                        <Button submit id='createDiscountBtn'>Submit</Button>
                                    </span>

                                    <Card sectioned title='Product Details'>
                                        <Text variant="bodyMd" as="p" fontWeight="regular">
                                            {`Add product details here `}
                                        </Text>

                                        <div className="add_product_select">
                                            <Select
                                                label="Choose Product"
                                                options={productTypeOptions}
                                                onChange={handleProductType}
                                                value={productType}
                                            />
                                        </div>


                                        <InputField
                                            label='Product Name*'
                                            type='text'
                                            marginTop
                                            name='title'
                                            // value={discount.title}
                                            value='Dark glitter'
                                            onChange={handleDiscount}
                                        />
                                        <div className='label_editor'>
                                            <label >Description *</label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={descriptioncontent}
                                                onChange={handleDescription}
                                            />
                                        </div>
                                        <div className='label_editor'>
                                            <label >Product Tags</label>
                                            <Combobox
                                                allowMultiple
                                                activator={
                                                    <Combobox.TextField
                                                        autoComplete="off"
                                                        label="Search tags"
                                                        labelHidden
                                                        value={value}
                                                        suggestion={suggestion}
                                                        placeholder="Search tags"
                                                        verticalContent={verticalContentMarkup}
                                                        onChange={setValue}
                                                    />
                                                }
                                            >
                                                {listboxMarkup}
                                            </Combobox>
                                        </div>

                                    </Card>

                                    <Card
                                        sectioned
                                        title="Media"
                                        actions={[
                                            {
                                                onAction: toggleOpenFileDialog,
                                            },
                                        ]}
                                    >


                                        {dropZone}
                                        {uploadedFiles}
                                    </Card>

                                    <Card sectioned title='Shipping Details'>
                                        <div className='Type-Section'>
                                            <Text variant="bodyMd" as="p" fontWeight="regular">
                                                {`Add shipping details here`}
                                            </Text>
                                        </div>
                                    </Card>

                                    <Card sectioned title='Pricing Details'>
                                        <div className='Type-Section'>
                                            <Text variant="bodyMd" as="p" fontWeight="regular">
                                                {`Add pricing details here`}
                                            </Text>

                                            <InputField
                                                label='Price*'
                                                name='value'
                                                type='number'
                                                required
                                                marginTop
                                                prefix={`$`}
                                                value={price}
                                                onChange={handlePrice}
                                            />

                                            <InputField
                                                label='Compare at Price'
                                                placeholder='Enter Compare at Price Here'
                                                name='value'
                                                type='number'
                                                required
                                                marginTop
                                                prefix={`$`}
                                                value={compareatPrice}
                                                onChange={handleCompareatPrice}
                                            />
                                            <div className="label_editor">
                                                <Checkbox
                                                    label="Charge Taxes on this Product"
                                                    checked={chargeTaxChecked}
                                                    onChange={handleChargeTax}
                                                />
                                            </div>

                                        </div>
                                    </Card>

                                    <Card sectioned title='Inventory Details'>
                                        <div className='Type-Section'>
                                            <Text variant="bodyMd" as="p" fontWeight="regular">
                                                {`Add inventory details here`}
                                            </Text>

                                            <InputField
                                                label='SKU'
                                                placeholder='Enter Product SKU Here'
                                                name='value'
                                                type='text'
                                                required
                                                marginTop
                                                value={sku}
                                                onChange={handleSku}
                                            />

                                            <InputField
                                                label='Barcode'
                                                placeholder='Enter Product Barcode Here'
                                                name='value'
                                                type='text'
                                                required
                                                marginTop
                                                value={barcode}
                                                onChange={handleBarcode}
                                            />
                                            <div className="label_editor">
                                                <Select
                                                    label="Track Inventory"
                                                    options={trackInventoryOptions}
                                                    onChange={handleTrackInventory}
                                                    value={inventoryTrack}
                                                />
                                            </div>

                                            {inventoryTrack == 'track' &&
                                                <>
                                                    <InputField
                                                        label='Quantity*'
                                                        placeholder='Enter Quantity Here'
                                                        name='value'
                                                        type='number'
                                                        required
                                                        marginTop
                                                        value={quantity}
                                                        onChange={handleQuantity}
                                                    />

                                                    <div className="label_editor">
                                                        <Checkbox
                                                            label="Allow Customers to Purchase this Product when it's Out of stock"
                                                            checked={allowCustomer}
                                                            onChange={handleAllowCustomer}
                                                        />
                                                    </div>
                                                </>
                                            }


                                        </div>
                                    </Card>
                                    <Card sectioned title='Variant Details'>
                                        <div className='Type-Section'>
                                            <Text variant="bodyMd" as="p" fontWeight="regular">
                                                {`Add variant details here, if this product comes in multiple versions, like different sizes or colors.`}
                                            </Text>

                                        </div>
                                    </Card>


                                </FormLayout>
                            </Form>
                        </Layout.Section>

                        <Layout.Section oneThird>
                            <div className='Discount-Summary'>
                                <Card sectioned title='Collections'>
                                    <div className='Type-Section'>
                                        <Text variant="bodyMd" as="p" fontWeight="regular">
                                            {`Add this product to a collection so it’s easy to find in your store.`}
                                        </Text>
                                        <div className='label_editor'>
                                            <Autocomplete
                                                allowMultiple
                                                options={collectionOptions}
                                                selected={collectionOptionsSelected}
                                                textField={collectionTextField}
                                                loading={optionsLoading}
                                                onSelect={setCollectionOptionsSelected}
                                                listTitle="Collections"
                                            />
                                        </div>

                                    </div>
                                </Card>

                                <Card sectioned title='PRODUCT HANDLE AND METAFIELDS'>
                                    <div className='Type-Section'>
                                        <Text variant="bodyMd" as="p" fontWeight="regular">
                                            {`You can add product handle and product's metafields from here.`}
                                        </Text>
                                        <div className='label_editor'>
                                            <InputField
                                                label='Product Handle'
                                                placeholder="Enter Product's Handle Here"
                                                type='text'
                                                marginTop
                                                name='handle'
                                                value={productHandle}
                                                onChange={handleProductHandle}
                                            />
                                        </div>
                                        <div className='label_editor'>
                                            <h2 class="Polaris-Text--root Polaris-Text--headingMd">Product Meta Fields</h2>
                                        </div>

                                        <InputField
                                            label='Title tag meta field'
                                            placeholder="Enter Product's title meta field Here"
                                            type='text'
                                            marginTop
                                            name='handle'
                                            value={titleMetafield}
                                            onChange={handleTitleMetafield}
                                        />

                                        <InputField
                                            multiline={1}
                                            label='Description tag meta field'
                                            placeholder="Enter Product's description meta field Here"
                                            type='text'
                                            marginTop
                                            name='handle'
                                            value={descriptionMetafield}
                                            onChange={handleDescriptionMetafield}
                                        />


                                    </div>
                                </Card>
                            </div>


                        </Layout.Section>

                    </Layout>

                    {/*<div className='Polaris-Product-Actions'>*/}
                    {/*    <PageActions*/}
                    {/*        primaryAction={{*/}
                    {/*            content: 'Save Changes',*/}
                    {/*            onAction: handleCreateDiscount,*/}
                    {/*            loading: btnLoading[1]*/}
                    {/*        }}*/}
                    {/*        secondaryActions={[*/}
                    {/*            {*/}
                    {/*                content: 'Discard',*/}
                    {/*                onAction: handleDiscardModal,*/}
                    {/*            },*/}
                    {/*        ]}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </Page >
            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
