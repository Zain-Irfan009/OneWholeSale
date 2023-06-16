import React, {
    useState,
    useCallback,
    useEffect,
    useContext,
    useMemo,
} from "react";
import {
    Page,
    Layout,
    Card,
    Modal,
    Text,
    Stack,
    ButtonGroup,
    Button,
    PageActions,
    Form,
    FormLayout,
    Toast,
    List,
    TextContainer,
    Banner,
    Loading,
    Scrollable,
    Avatar,
    EmptyState,
    TextField,
    Listbox,
    EmptySearchResult,
    AutoSelection,
    Tabs,
    Icon,
    Select,
    Tag,
    Autocomplete,
    LegacyStack,
    Checkbox,
    DropZone,
    Thumbnail,
    Combobox,
    Divider,
    ContextualSaveBar,
    Link,
    IndexTable, SkeletonBodyText,
} from "@shopify/polaris";
import {
    SearchMinor,
    ChevronDownMinor,
    ChevronUpMinor,
    DeleteMinor,
    MobilePlusMajor,
} from "@shopify/polaris-icons";
import { SkeltonPageForTable } from "../components/global/SkeltonPage";
import { InputField } from "../components/Utils/InputField";
import { CheckBox } from "../components/Utils/CheckBox";
import { AppContext } from "../components/providers/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import EmptyCheckBox from "../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../assets/icons/FillCheckBox.png";
import {getAccessToken} from "../assets/cookies";

export function AddProduct() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [discountError, setDiscountError] = useState();
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [discardModal, setDiscardModal] = useState(false);
    const [trackQuantityIsChecked, setTrackQuantityIsChecked] = useState(false);
    const [status, setStatus] = useState('active');
    const [showSaveBar, setShowSaveBar] = useState(false);
    const [variantsMarkup, setVariantsMarkup] = useState([]);
    const [vendor, setVendor] = useState("");
    const [sellerEmail, setSellerEmail] = useState("");

    const CollectionsOptionsData = useMemo(
        () => [
            { value: "Catalogs", label: "catalog" },
            { value: "Zippo Display", label: "zippo" },
        ],
        []
    );

    const [collectionOptions, setCollectionOptions] = useState(
        []
    );

    const [collectionOptionsSelected, setCollectionOptionsSelected] =
        useState("");
    const [tagInputValue, setTagInputValue] = useState("");
    const [collectionInputValue, setCollectionInputValue] = useState("");
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [price, setPrice] = useState("");
    const [compareatPrice, setCompareatPrice] = useState("");
    const [chargeTaxChecked, setChargeTaxChecked] = useState(false);
    const [allowCustomer, setAllowCustomer] = useState(false);
    const [sku, setSku] = useState("");
    const [barcode, setBarcode] = useState("");
    const [quantity, setQuantity] = useState("");
    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [mediaFiles, setImageFiles] = useState([]);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    const hasImageError = rejectedFiles.length > 0;
    const [productHandle, setProductHandle] = useState("");
    const [titleMetafield, setTitleMetafield] = useState("");
    const [descriptionMetafield, setDescriptionMetafield] = useState("");

    const [productName, setProductName] = useState("");

    const [discount, setDiscount] = useState({
        code: "",
        title: "",
        name: "",
        email: "",
        appliesTo: "all",
        type: "percentage",
        value: "",
        minimumRequirement: "none",
        minimumValue: "",
        collections: null,
        products: null,
        variants: null,
        status: "",
    });

    // =================Products Modal Code Start Here================

    const deselectedOptions = useMemo(
        () => [
            { value: "rustic", label: "Rustic" },
            { value: "antique", label: "Antique" },
            { value: "vinyl", label: "Vinyl" },
            { value: "vintage", label: "Vintage" },
            { value: "refurbished", label: "Refurbished" },
        ],
        []
    );

    const [productsLoading, setProductsLoading] = useState(false);
    const [queryValue, setQueryValue] = useState("");
    const [toggleLoadProducts, setToggleLoadProducts] = useState(true);
    const [productTab, setProductTab] = useState(0);
    const [productsModal, setProductsModal] = useState(false);
    const [expandedProduct, setExpandedProduct] = useState([]);
    const [globalProducts, setGlobalProducts] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [nextPageCursor, setNextPageCursor] = useState("");
    const [selectedVariantProducts, setSelectedVariantProducts] = useState([]);
    const [checkedVariants, setCheckedVariants] = useState([]);
    const [previousCheckedVariants, setPreviousCheckedVariants] = useState([]);
    const [productType, setProductType] = useState("none");
    const [inventoryTrack, setInventoryTrack] = useState("not_track");
    const [descriptioncontent, setDescriptionContent] = useState("");
    const [costPerItem, setCostPerItem] = useState();
    const [unit, setUnit] = useState("");
    const [weight, setWeight] = useState('');
    const [pageTitle, setPageTitle] = useState("");
    const [pageDescription, setPageDescription] = useState("");
    const [newTags, setNewTags] = useState([]);
    const [pendingTag, setPendingTag] = useState("");
    const [categorySelect, setCategorySelect] = useState("today");
    const [vendorSelect, setVendorSelect] = useState("today");

    const [selectedOptions, setSelectedOptions] = useState(["rustic"]);
    const [inputValue, setInputValue] = useState("");
    const [autoOptions, setAutoOptions] = useState(deselectedOptions);
    const [inputFields, setInputFields] = useState([{ value: "" }]);
    const [inputFields2, setInputFields2] = useState([{ value: "" }]);
    const [inputFields3, setInputFields3] = useState([{ value: "" }]);
    const [variantOptions, setVariantOptions] = useState("");
    const [variantOptions2, setVariantOptions2] = useState("");
    const [variantOptions3, setVariantOptions3] = useState("");
    const [variantsInputFileds, setVariantsInputFileds] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const [variants, setVariants] = useState(0);
    const [optionsArray, setOptionsArray] = useState([]);






    const inputHandleChange = (index, val) => {

        let totalLength = inputFields.length;
        const newInputFields = [...inputFields];
        newInputFields[index].value = val;
        setInputFields(newInputFields);



        if (totalLength - 1 == index && val.length == 1) {
            handleAddField();
        }
    };



    const data_option = [
        {
            name: variantOptions,
            value: inputFields,
        },
        {
            name: variantOptions2,
            value:inputFields2,
        },
        {
            name: variantOptions3,
            value: inputFields3,
        },
    ];

    const transformedFormat = data_option.map(item => {
        return {
            ...item,
            value: item.value.map(valueObj => valueObj.value)
        };
    });



    const variantsInputFiledsHandler = (e, index, type, name) => {
        const { value } = e.target;
        console.log("value, index, type", value, index, type);

        setVariantsInputFileds((prevState) => {
            const updatedState = [...prevState];
            console.log("updatedState", updatedState);

            const updatedObject = { ...updatedState[index] };
            updatedObject.name = name;
            switch (type) {
                case "price":
                    updatedObject.price = value;
                    break;
                case "sku":
                    updatedObject.sku = value;
                    break;
                case "quantity":
                    updatedObject.quantity = value;
                    break;

                case "compare_at_price":
                    updatedObject.compare_at_price = value;
                    break;
            }
            updatedState[index] = updatedObject;

            return updatedState;
        });

        setRefresh((prevRefresh) => !prevRefresh);
    };

    const handleAddField = () => {
        setInputFields([...inputFields, { value: "" }]);
    };

    useEffect(() => {
        console.log('varinat',inputFields);
    }, [inputFields]);

    const handleRemoveField = (index) => {
        const newInputFields = [...inputFields];
        newInputFields.splice(index, 1);
        setInputFields(newInputFields);
    };
    const inputHandleChange2 = (index, val) => {
        let totalLength = inputFields2.length;

        const newInputFields = [...inputFields2];
        newInputFields[index].value = val;
        setInputFields2(newInputFields);
        if (totalLength - 1 == index && val.length == 1) {
            handleAddField2();
        }
    };

    const handleAddField2 = () => {
        setInputFields2([...inputFields2, { value: "" }]);
    };

    const handleRemoveField2 = (index) => {
        const newInputFields = [...inputFields2];
        newInputFields.splice(index, 1);
        setInputFields2(newInputFields);
    };
    const inputHandleChange3 = (index, val) => {
        let totalLength = inputFields3.length;

        const newInputFields = [...inputFields3];
        newInputFields[index].value = val;
        setInputFields3(newInputFields);
        if (totalLength - 1 == index && val.length == 1) {
            handleAddField3();
        }
    };

    const handleAddField3 = () => {
        setInputFields3([...inputFields3, { value: "" }]);
    };

    const handleRemoveField3 = (index) => {
        const newInputFields = [...inputFields3];
        newInputFields.splice(index, 1);
        setInputFields3(newInputFields);
    };


    const getCollectionData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/collections`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            let arr = response?.data.map(({title})=> ({value: title, label: title}))
            setCollectionOptions(arr)

            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }


    useEffect(() => {
        getCollectionData();

    }, []);




    const tagString = newTags.join(",");

    const handleChange = (value) => {
        const lastChar = value.charAt(value.length - 1);

        if (lastChar === "," || lastChar === " ") {
            return addNewTag(value.slice(0, -1));
        }

        setPendingTag(value);


    };
    const addNewTag = (tag) => {
        const tagsSet = new Set(newTags);
        const newTagsArray = [...tagsSet.add(tag)];
        setNewTags(newTagsArray);
        setPendingTag("");
    };

    const handleKeyPress = (event) => {
        const enterKeyPressed = event.keyCode === 13;
        if (enterKeyPressed) {
            event.preventDefault();
            addNewTag(pendingTag);
        }
    };

    const handleUnitChange = useCallback((value) => setUnit(value), []);

    const handleProductTabChange = useCallback(
        (selectedTabIndex) => setProductTab(selectedTabIndex),
        []
    );

    const productTypeOptions = [{ label: "Normal Product", value: "normal" }];
    const handleProductType = useCallback((value) => setProductType(value), []);

    const handleTrackInventory = useCallback(
        (value) => setInventoryTrack(value),
        []
    );
    const trackInventoryOptions = [
        { label: "Don't Track inventory", value: "not_track" },
        { label: "Track This Product's inventory", value: "track" },
    ];

    function handleDescription(event, editor) {
        const data = editor.getData();
        console.log(data);
        setDescriptionContent(data);
    }

    const handleProductsPagination = () => {
        if (hasNextPage) {
            setProductsLoading(true);
            setToggleLoadProducts(true);
        }
    };

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 0) {
                setShowSaveBar(true);
            } else {
                setShowSaveBar(false);
            }
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const LazyLoadingMarkup = productsLoading ? (
        <Listbox.Loading
            accessibilityLabel={`${
                queryValue ? "Filtering" : "Loading"
            } Products`}
        />
    ) : allProducts?.length > 0 && hasNextPage ? (
        <Button onClick={handleProductsPagination}>Load more...</Button>
    ) : null;

    const noResultsMarkup =
        !productsLoading && allProducts.length == 0 ? (
            <EmptySearchResult
                title="No product found"
                // description={`No product found`}
            />
        ) : null;

    const handleQueryChange = (query) => {
        setQueryValue(query);

        setProductsLoading(true);
        setNextPageCursor("");
        setProductsList([]);
        setAllProducts([]);
        setTimeout(() => {
            setToggleLoadProducts(true);
        }, 500);
    };

    const handleQueryClear = () => {
        handleQueryChange("");
    };

    const makeState = (num) => {
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr.push({
                name: "",
                sku: "",
                price: "",
                quantity: "",
                compare_at_price: "",
            });
        }

        setVariantsInputFileds(arr);
    };
    useEffect(() => {
        console.log('input',variantsInputFileds);
    }, [variantsInputFileds]);
    useEffect(() => {
        console.log(inputFields.length);
    }, [inputFields]);
    // =================Products Modal Code Ends Here================

    // =================Collections Modal Code Ends Here================

    let markup = [];



    useEffect(() => {
        const calculateMarkup = () => {
            let globalIndex = -1;
            let newMarkup = [];

            const createRow = (text, priceIndex, skuIndex) =>    {
                console.log("updatedState", variantsInputFileds);
                setVariantsInputFileds((prevState) => {
                    const updatedState = [...prevState];


                    const updatedObject = { ...updatedState[skuIndex] };
                    updatedObject.name = text;
                    updatedObject.price = price;



                    updatedState[skuIndex] = updatedObject;


                    return updatedState;
                });

                return(
                <>

                    <IndexTable.Row key={globalIndex} position={globalIndex}>
                        <IndexTable.Cell>
                            <Text variant="bodyMd" fontWeight="bold" as="span">
                                {text}
                            </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <InputField
                                type="text"

                                onChange={(e) =>
                                    variantsInputFiledsHandler(
                                        e,
                                        priceIndex,
                                        "price",
                                        text
                                    )
                                }
                                // prefix="$"
                                autoComplete="off"
                            />
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <InputField
                                type="text"
                                // value={variantsInputFileds[skuIndex]?.sku}
                                onChange={(value) =>
                                    variantsInputFiledsHandler(
                                        value,
                                        skuIndex,
                                        "quantity",
                                        text
                                    )
                                }
                                // prefix="$"
                                autoComplete="off"
                            />
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <InputField
                                type="text"
                                // value={variantsInputFileds[skuIndex]?.sku}
                                onChange={(value) =>
                                    variantsInputFiledsHandler(
                                        value,
                                        skuIndex,
                                        "sku",
                                        text
                                    )
                                }
                                // prefix="$"
                                autoComplete="off"
                            />
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <InputField
                                type="text"
                                // value={variantsInputFileds[skuIndex]?.sku}
                                onChange={(value) =>
                                    variantsInputFiledsHandler(
                                        value,
                                        skuIndex,
                                        "compare_at_price",
                                        text
                                    )
                                }
                                // prefix="$"
                                autoComplete="off"
                            />
                        </IndexTable.Cell>
                    </IndexTable.Row>
                </>
            ); }

            if (
                (variants === 1 || inputFields2[0].value.length === 0) &&
                inputFields[0].value.length > 0
            ) {
                console.log(1);
                makeState(inputFields.length - 1);
                newMarkup = inputFields.map((input, index) => {
                    if (input.value.length === 0) {
                        return null;
                    } else {
                        globalIndex++;
                        console.log("globalIndex", globalIndex);
                        return createRow(input.value, globalIndex, globalIndex);
                    }
                });
            } else if (
                (variants === 2 || inputFields3[0].value.length === 0) &&
                inputFields2[0].value.length > 0
            ) {
                makeState((inputFields2.length - 1) * (inputFields.length - 1));

                newMarkup = inputFields.flatMap((input, index) => {
                    return inputFields2.map((input2, index2) => {
                        if (
                            input2.value.length === 0 ||
                            input.value.length === 0
                        ) {
                            return null;
                        } else {
                            globalIndex++;
                            console.log(globalIndex);
                            return createRow(
                                `${input.value}/${input2.value}`,
                                globalIndex,
                                globalIndex
                            );
                        }
                    });
                });
            } else if (variants === 3 && inputFields3[0].value.length > 0) {
                makeState(
                    (inputFields3.length - 1) *
                        (inputFields2.length - 1) *
                        (inputFields.length - 1)
                );
                console.log(3);
                newMarkup = inputFields.flatMap((input, index) => {
                    return inputFields2.flatMap((input2, index2) => {
                        return inputFields3.map((input3, index3) => {
                            if (
                                input3.value.length === 0 ||
                                input2.value.length === 0 ||
                                input.value.length === 0
                            ) {
                                return null;
                            } else {
                                globalIndex++;
                                console.log(globalIndex);
                                return createRow(
                                    `${input.value}/${input2.value}/${input3.value}`,
                                    globalIndex,
                                    globalIndex
                                );
                            }
                        });
                    });
                });
            }

            return newMarkup;
        };

        const markup = calculateMarkup();
        setVariantsMarkup(markup);
    }, [inputFields, inputFields2, inputFields3]);

    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(
        () => setErrorToast((errorToast) => !errorToast),
        []
    );
    const toggleSuccessMsgActive = useCallback(
        () => setSucessToast((sucessToast) => !sucessToast),
        []
    );

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const handleDiscount = (e) => {
        setDiscount({ ...discount, [e.target.name]: e.target.value });
    };

    function convertBooleanToNumber(value) {
        let booleanValue;
        if (value === true) {
            booleanValue = 1;
        } else {
            booleanValue = 0;
        }

        return booleanValue;
    }

    const handleDiscardModal = () => {
        setDiscardModal(!discardModal);
    };

    const discardAddProduct = () => {
        navigate("/productslisting");
    };

    const handleCreateDiscount = () => {
        document.getElementById("createDiscountBtn").click();
    };

    // -------------------Tags------------------------

    const collectionUpdateText = useCallback(
        (value) => {
            setCollectionInputValue(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === "") {
                    setCollectionOptions(CollectionsOptionsData);
                    setOptionsLoading(false);
                    return;
                }

                const filterRegex = new RegExp(value, "i");
                const resultOptions = CollectionsOptionsData.filter((option) =>
                    option.label.match(filterRegex)
                );
                let endIndex = resultOptions.length - 1;
                if (resultOptions.length === 0) {
                    endIndex = 0;
                }
                setCollectionOptions(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [CollectionsOptionsData, optionsLoading, collectionOptionsSelected]
    );

    const handleChargeTax = useCallback(
        (newChecked) => setChargeTaxChecked(newChecked),
        []
    );
    const handleAllowCustomer = useCallback(
        (newChecked) => setAllowCustomer(newChecked),
        []
    );

    function tagTitleCase(string) {
        return string
            .toLowerCase()
            .split(" ")
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join("");
    }

    const removeCollection = useCallback(
        (collection) => () => {
            const collectionOptions = [...collectionOptionsSelected];
            collectionOptions.splice(collectionOptions.indexOf(collection), 1);
            setCollectionOptionsSelected(collectionOptions);
        },
        [collectionOptionsSelected]
    );

    const collectionsContentMarkup =
        collectionOptionsSelected.length > 0 ? (
            <div className="Product-Tags-Stack">
                <Stack spacing="extraTight" alignment="center">
                    {collectionOptionsSelected.map((option) => {
                        let tagLabel = "";
                        tagLabel = option.replace("_", " ");
                        tagLabel = tagTitleCase(tagLabel);
                        return (
                            <Tag
                                key={`option${option}`}
                                onRemove={removeCollection(option)}
                            >
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

    const handlePrice = (e) => setPrice(e.target.value);

    const handleSku = (e) => setSku(e.target.value);
    const handleBarcode = (e) => setBarcode(e.target.value);
    const handleWeight = (e) => setWeight(e.target.value);

    const handleQuantity = (e) => setQuantity(e.target.value);

    const handleCompareatPrice = (e) => setCompareatPrice(e.target.value);
    // --------------------Media Card -------------------
    const toggleOpenFileDialog = useCallback(
        () => setOpenFileDialog((openFileDialog) => !openFileDialog),
        []
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
        []
    );

    const fileUpload = (
        <DropZone.FileUpload
            actionTitle={"Add files"}
            actionHint="Accepts images, videos, or 3D models"
        />
    );

    const dropZone = !mediaFiles.length && (
        <Stack vertical>
            {imageErrorMessage}
            <DropZone
                accept="image/*, video/*"
                type="image,video"
                openFileDialog={openFileDialog}
                onDrop={handleDropZoneDrop}
                onFileDialogClose={toggleOpenFileDialog}
            >
                {fileUpload}
            </DropZone>
        </Stack>
    );
    useEffect(() => {
        console.log("mediaFiles", mediaFiles);
    }, [mediaFiles]);

    const addVariantHandler = () => {
        let variantcount = variants + 1;
        setVariants(variantcount);
    };

    const handleRemoveMedia = (index) => {
        let temp_array = mediaFiles.slice();
        temp_array.splice(index, 1);
        setImageFiles(temp_array);
    };

    const validImageTypes = [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/svg",
    ];
    const uploadedFiles = mediaFiles.length > 0 && (
        <Stack id="jjj">
            {mediaFiles.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <div className="Polaris-Product-Gallery">
                        <Thumbnail
                            size="large"
                            alt={file.name}
                            source={
                                validImageTypes.indexOf(file.type) > -1
                                    ? window.URL.createObjectURL(file)
                                    : NoteMinor
                            }
                        />
                        <span
                            className="media_hover"
                            onClick={() => handleRemoveMedia(index)}
                        >
                            <Icon source={DeleteMinor}> </Icon>
                        </span>
                    </div>
                </Stack>
            ))}

            <div className="Polaris-Product-DropZone">
                <Stack alignment="center">
                    <DropZone
                        accept="image/*, video/*"
                        type="image,video"
                        openFileDialog={openFileDialog}
                        onDrop={handleDropZoneDrop}
                        onFileDialogClose={toggleOpenFileDialog}
                    >
                        <DropZone.FileUpload actionTitle={"Add files"} />
                    </DropZone>
                </Stack>
            </div>
        </Stack>
    );

    const handleProductHandle = (e) => {
        setProductHandle(e.target.value);
    };

    const handleTitleMetafield = (e) => {
        setTitleMetafield(e.target.value);
    };
    const handleDescriptionMetafield = (e) => {
        setDescriptionMetafield(e.target.value);
    };

    // -------------------Product Tags------------------------

    const [selectedTags, setSelectedTags] = useState([]);
    const [value, setValue] = useState("");
    const [suggestion, setSuggestion] = useState("");

    const handleActiveOptionChange = useCallback(
        (activeOption) => {
            const activeOptionIsAction = activeOption === value;

            if (!activeOptionIsAction && !selectedTags.includes(activeOption)) {
                setSuggestion(activeOption);
            } else {
                setSuggestion("");
            }
        },
        [value, selectedTags]
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
            setValue("");
            setSuggestion("");
        },
        [selectedTags]
    );

    const removeTag = useCallback(
        (tag) => () => {
            updateSelection(tag);
        },
        [updateSelection]
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
            const highlight = option.slice(
                matchIndex,
                matchIndex + trimValue.length
            );
            const end = option.slice(
                matchIndex + trimValue.length,
                option.length
            );

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
        [value]
    );

    const categories = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 7 days", value: "lastWeek" },
    ];

    const options = useMemo(() => {
        let list;
        const allTags = getAllTags();
        const filterRegex = new RegExp(value, "i");

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
            ? options?.map((option) => {
                  return (
                      <Listbox.Option
                          key={option}
                          value={option}
                          selected={selectedTags.includes(option)}
                          accessibilityLabel={option}
                      >
                          <Listbox.TextOption
                              selected={selectedTags.includes(option)}
                          >
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

    const removeTag3 = useCallback(
        (tag) => () => {
            setNewTags((previousTags) =>
                previousTags.filter((previousTag) => previousTag !== tag)
            );
        },
        []
    );

    let tagsToAddMarkup = null;

    if (newTags.length > 0) {
        const tagsToAdd = newTags.map((tag) => (
            <Tag key={tag} onRemove={removeTag3(tag)}>
                {tag}
            </Tag>
        ));
        tagsToAddMarkup = <Stack>{tagsToAdd}</Stack>;
    }

    const updateText = useCallback(
        (value) => {
            setInputValue(value);

            if (value === "") {
                setAutoOptions(deselectedOptions);
                return;
            }

            const filterRegex = new RegExp(value, "i");
            const resultOptions = deselectedOptions.filter((option) =>
                option.label.match(filterRegex)
            );
            setAutoOptions(resultOptions);
        },
        [deselectedOptions]
    );

    const removeTag2 = useCallback(
        (tag) => () => {
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);
            setSelectedOptions(options);
        },
        [selectedOptions]
    );

    const verticalContentMarkup2 =
        selectedOptions.length > 0 ? (
            <LegacyStack spacing="extraTight" alignment="center">
                {selectedOptions.map((option) => {
                    let tagLabel = "";
                    tagLabel = option.replace("_", " ");
                    tagLabel = titleCase(tagLabel);
                    return (
                        <Tag
                            key={`option${option}`}
                            onRemove={removeTag2(option)}
                        >
                            {tagLabel}
                        </Tag>
                    );
                })}
            </LegacyStack>
        ) : null;

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label="Collections"
            value={inputValue}
            placeholder="Vintage, cotton, summer"
            verticalContent={verticalContentMarkup2}
            autoComplete="off"
        />
    );

    function titleCase(string) {
        return string
            .toLowerCase()
            .split(" ")
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join("");
    }


    //SUbmit Data
    const addProduct = async () => {

        setBtnLoading(true)
        const sessionToken = getAccessToken();
        let formData = new FormData();

        formData.append('product_name',productName);
        formData.append('description',descriptioncontent);
        formData.append('product_price',price);
        formData.append('product_compare_at_price',compareatPrice);
        formData.append('taxable',chargeTaxChecked);
        formData.append('inventory_management',trackQuantityIsChecked);
        formData.append('product_quantity',quantity);
        formData.append('inventory_policy',allowCustomer);
        mediaFiles.forEach((item, index) => {
            formData.append(`images[${index}]`, item);
        });
        formData.append('product_sku',sku);
        formData.append('barcode',barcode);
        formData.append('weight',weight);
        formData.append('weight_unit',unit);
        formData.append('search_engine_title',pageTitle);
        formData.append('search_engine_meta_description',pageDescription);
        formData.append('options',JSON.stringify(transformedFormat));
        formData.append('status',status);
        formData.append('variants',JSON.stringify(variantsInputFileds));
        formData.append('seller_email',sellerEmail);
        formData.append('tags',newTags);
        formData.append('product_type',productHandle);
        formData.append('vendor',vendor);
        formData.append('collections',collectionOptionsSelected);


        try {
            const response = await axios.post(`${apiUrl}/add-product`,formData,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
        console.log('res',response?.data?.message)
            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            console.log(error);
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }



    return (
        <div className="Discount-Detail-Page">
            <Modal
                open={discardModal}
                onClose={handleDiscardModal}
                title="Leave page with unsaved changes?"
                primaryAction={{
                    content: "Leave page",
                    destructive: true,
                    onAction: discardAddProduct,
                }}
                secondaryActions={[
                    {
                        content: "Stay",
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

            {showSaveBar && (
                <ContextualSaveBar
                    message="Unsaved changes"
                    saveAction={{
                        onAction: () => console.log("add form submit logic"),
                        loading: false,
                        disabled: false,
                    }}
                    discardAction={{
                        onAction: () => console.log("add clear form logic"),
                    }}
                />
            )}

            {loading ? (
                <span>
                    <Loading />
                    <SkeltonPageForProductDetail />
                </span>
            ) : (
                <Page
                    breadcrumbs={[
                        { content: "Discounts", onAction: handleDiscardModal },
                    ]}
                    title="Add Product"
                    fullWidth
                >
                    {discountError ? (
                        <Banner
                            title="There is 1 error with this discount:"
                            status="critical"
                        >
                            <List>
                                <List.Item>
                                    Specific {discountError} must be added
                                </List.Item>
                            </List>
                        </Banner>
                    ) : (
                        ""
                    )}

                    <Layout>
                        <Layout.Section>
                            <Form >
                                <FormLayout>
                                    <span className="VisuallyHidden">
                                        <Button submit id="createDiscountBtn">
                                            Submit
                                        </Button>
                                    </span>

                                    <Card sectioned title="Product Details">

                                        {/* <Text variant="bodyMd" as="p" fontWeight="regular">
                      {`Add product details here `}
                    </Text> */}

                                        {/* <div className="add_product_select">
                      <Select
                        label="Choose Product"
                        options={productTypeOptions}
                        onChange={handleProductType}
                        value={productType}
                      />
                    </div> */}

                                        <InputField
                                            label="Product Name*"
                                            placeholder="Enter Product Name Here"
                                            type="text"
                                            marginTop
                                            name="productName"
                                            value={productName}
                                            onChange={(e) =>setProductName(e.target.value)}

                                        />
                                        <div className="label_editor">
                                            <label>Description *</label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={descriptioncontent}
                                                onChange={handleDescription}
                                            />
                                        </div>
                                        {/* <div className="label_editor">
                      <label>Product Tags</label>
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
                    </div> */}

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
                                    {/*
                  <Card sectioned title="Shipping Details">
                    <div className="Type-Section">
                      <Text variant="bodyMd" as="p" fontWeight="regular">
                        {`Add shipping details here`}
                      </Text>
                    </div>
                  </Card> */}

                                    <Card sectioned title="Pricing Details">
                                        <p>
                                            View a summary of your online
                                            store’s performance.
                                        </p>

                                        <div className="Type-Section">
                                            <Text
                                                variant="bodyMd"
                                                as="p"
                                                fontWeight="regular"
                                            >
                                                {`Add pricing details here`}
                                            </Text>
                                            <FormLayout>
                                                <FormLayout.Group>
                                                    <InputField
                                                        label="Price*"
                                                        placeholder="Enter Price Here"
                                                        name="value"
                                                        type="number"
                                                        required
                                                        marginTop
                                                        prefix={`$`}
                                                        value={price}
                                                        onChange={handlePrice}
                                                    />

                                                    <InputField
                                                        label="Compare at Price"
                                                        placeholder="Enter Compare at Price Here"
                                                        name="value"
                                                        type="number"
                                                        required
                                                        marginTop
                                                        prefix={`$`}
                                                        value={compareatPrice}
                                                        onChange={
                                                            handleCompareatPrice
                                                        }
                                                    />
                                                </FormLayout.Group>
                                            </FormLayout>
                                            <div className="label_editor">
                                                <Checkbox
                                                    label="Charge Taxes on this Product"
                                                    checked={chargeTaxChecked}
                                                    onChange={handleChargeTax}
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card
                                        sectioned
                                        title="Inventory & Shipping Details"
                                    >
                                        <div className="Type-Section">
                                            <Text
                                                variant="bodyMd"
                                                as="p"
                                                fontWeight="regular"
                                            >
                                                {`Add inventory details here`}
                                            </Text>

                                            <div className="label_editor">
                                                <Checkbox
                                                    label="Track Quantity"
                                                    checked={
                                                        trackQuantityIsChecked
                                                    }
                                                    onChange={() =>
                                                        setTrackQuantityIsChecked(
                                                            !trackQuantityIsChecked
                                                        )
                                                    }
                                                />
                                                {/* <Select
                          label="Track Inventory"
                          options={trackInventoryOptions}
                          onChange={handleTrackInventory}
                          value={inventoryTrack}
                        /> */}
                                            </div>

                                            {trackQuantityIsChecked && (
                                                <>
                                                    <InputField
                                                        label="Quantity*"
                                                        placeholder="Enter Quantity Here"
                                                        name="value"
                                                        type="number"
                                                        required
                                                        marginTop
                                                        value={quantity}
                                                        onChange={
                                                            handleQuantity
                                                        }
                                                    />

                                                    <div className="label_editor">
                                                        <Checkbox
                                                            label="Allow Customers to Purchase this Product when it's Out of stock"
                                                            checked={
                                                                allowCustomer
                                                            }
                                                            onChange={
                                                                handleAllowCustomer
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <FormLayout>
                                                <FormLayout.Group>
                                                    <InputField
                                                        label="SKU"
                                                        placeholder="Enter Product SKU Here"
                                                        name="value"
                                                        type="text"
                                                        required
                                                        marginTop
                                                        value={sku}
                                                        onChange={handleSku}
                                                    />

                                                    <InputField
                                                        label="Barcode"
                                                        placeholder="Enter Product Barcode Here"
                                                        name="value"
                                                        type="text"
                                                        required
                                                        marginTop
                                                        value={barcode}
                                                        onChange={handleBarcode}
                                                    />
                                                </FormLayout.Group>

                                                <TextField
                                                    label="Weight"
                                                    placeholder="Enter Weight"
                                                    name="weigh"
                                                    type="text"
                                                    connectedRight={
                                                        <Select
                                                            id="weight"
                                                            //   label="Unit of measure"
                                                            //   placeholder="Select"
                                                            options={[
                                                                "oz",
                                                                "g",
                                                                "kg",
                                                                "lb",
                                                            ]}
                                                            value={unit}
                                                            onChange={
                                                                handleUnitChange
                                                            }
                                                            error={Boolean(
                                                                !unit && weight
                                                            )}
                                                        />
                                                    }
                                                    required
                                                    marginTop
                                                    value={weight}
                                                    onChange={(value) => setWeight(value)}
                                                />
                                            </FormLayout>
                                        </div>
                                    </Card>
                                    <Card
                                        sectioned
                                        title="Search engine listing"
                                    >
                                        <Text>
                                            Add a description to see how this
                                            product might appear in a search
                                            engine listing
                                        </Text>
                                        <div className="margin-top" />
                                        <div className="margin-bottom" />
                                        <Divider />

                                        <InputField
                                            label="Page Title"
                                            placeholder="Enter Page Title"
                                            name="pagetitle"
                                            type="text"
                                            required
                                            marginTop
                                            value={pageTitle}
                                            onChange={(e) =>
                                                setPageTitle(e.target.value)
                                            }
                                        />
                                        <InputField
                                            label="Meta Description"
                                            name="pageDescription"
                                            type="text"
                                            required
                                            multiline={3}
                                            marginTop
                                            value={pageDescription}
                                            onChange={(e) =>
                                                setPageDescription(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Card>
                                    <Card sectioned title="Variant Details">
                                        {variants > 0 && (
                                            <Card.Section>
                                                <div>
                                                    <TextField
                                                        label="Option Name"
                                                        type="text"
                                                        value={variantOptions}
                                                        onChange={(value) =>
                                                            setVariantOptions(
                                                                value
                                                            )
                                                        }
                                                    />
                                                    <p
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        Product Value
                                                    </p>
                                                    {inputFields.map(
                                                        (inputField, index) => (
                                                            <div key={index}>
                                                                <TextField
                                                                    value={
                                                                        inputField.value
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        inputHandleChange(
                                                                            index,
                                                                            value
                                                                        )
                                                                    }
                                                                    connectedRight={[
                                                                        // <Button primary onClick={handleAddField}>
                                                                        //   Add Field
                                                                        // </Button>,
                                                                        (inputField
                                                                            .value
                                                                            .length >
                                                                            0 ||
                                                                            inputFields.length -
                                                                                1 !=
                                                                                index) && (
                                                                            <Button
                                                                                plain
                                                                                icon={
                                                                                    DeleteMinor
                                                                                }
                                                                                onClick={() =>
                                                                                    handleRemoveField(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            />
                                                                        ),
                                                                    ]}
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </Card.Section>
                                        )}
                                        {variants > 1 && (
                                            <Card.Section>
                                                <div>
                                                    <TextField
                                                        label="Option Name"
                                                        type="text"
                                                        value={variantOptions2}
                                                        onChange={(value) =>
                                                            setVariantOptions2(
                                                                value
                                                            )
                                                        }
                                                    />
                                                    <p
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        Product Value
                                                    </p>
                                                    {inputFields2.map(
                                                        (inputField, index) => (
                                                            <div key={index}>
                                                                <TextField
                                                                    value={
                                                                        inputField.value
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        inputHandleChange2(
                                                                            index,
                                                                            value
                                                                        )
                                                                    }
                                                                    connectedRight={[
                                                                        (inputField
                                                                            .value
                                                                            .length >
                                                                            0 ||
                                                                            inputFields2.length -
                                                                                1 !=
                                                                                index) && (
                                                                            <Button
                                                                                plain
                                                                                icon={
                                                                                    DeleteMinor
                                                                                }
                                                                                onClick={() =>
                                                                                    handleRemoveField2(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            />
                                                                        ),
                                                                    ]}
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </Card.Section>
                                        )}
                                        {variants == 3 && (
                                            <Card.Section>
                                                <div>
                                                    <TextField
                                                        label="Option Name"
                                                        type="text"
                                                        value={variantOptions3}
                                                        onChange={(value) =>
                                                            setVariantOptions3(
                                                                value
                                                            )
                                                        }
                                                    />
                                                    <p
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        Product Value
                                                    </p>
                                                    {inputFields3.map(
                                                        (inputField, index) => (
                                                            <div key={index}>
                                                                <TextField
                                                                    value={
                                                                        inputField.value
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        inputHandleChange3(
                                                                            index,
                                                                            value
                                                                        )
                                                                    }
                                                                    connectedRight={[
                                                                        (inputField
                                                                            .value
                                                                            .length >
                                                                            0 ||
                                                                            inputFields3.length -
                                                                                1 !=
                                                                                index) && (
                                                                            <Button
                                                                                plain
                                                                                icon={
                                                                                    DeleteMinor
                                                                                }
                                                                                onClick={() =>
                                                                                    handleRemoveField3(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            />
                                                                        ),
                                                                    ]}
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </Card.Section>
                                        )}

                                        {!(variants > 2) && (
                                            <Card.Section>
                                                <div
                                                    className="variants-secton"
                                                    style={{
                                                        display: "flex",
                                                    }}
                                                >
                                                    <Icon
                                                        source={MobilePlusMajor}
                                                        color="base"
                                                    />
                                                    <Link
                                                        onClick={
                                                            addVariantHandler
                                                        }
                                                    >
                                                        Add another option
                                                    </Link>
                                                </div>
                                            </Card.Section>
                                        )}
                                        {/* <div className="Type-Section">
                      <Text variant="bodyMd" as="p" fontWeight="regular">
                        {`Add variant details here, if this product comes in multiple versions, like different sizes or colors.`}
                      </Text>
                    </div> */}
                                    </Card>
                                    {variants > 0 && (
                                        <Card title="Variants">
                                            <Card.Section>
                                                <div className="Product-Variants-Table">
                                                    <IndexTable
                                                        itemCount={
                                                            variantsMarkup?.length
                                                        }
                                                        headings={[
                                                            { title: "Name" },
                                                            { title: "Price" },
                                                            {
                                                                title: "Quantity",
                                                            },
                                                            { title: "Sku" },
                                                            {
                                                                title: "Compare At",
                                                            },
                                                        ]}
                                                        selectable={false}
                                                    >
                                                        {variantsMarkup}
                                                    </IndexTable>
                                                </div>
                                            </Card.Section>
                                        </Card>
                                    )}
                                </FormLayout>
                            </Form>
                        </Layout.Section>

                        <Layout.Section oneThird>
                            <div className="Discount-Summary">
                                <Card sectioned>
                                    <div className="Type-Section">
                                        <Select
                                            label="Status"
                                            options={[
                                                {
                                                    label: "Draft",
                                                    value: 'draft',
                                                },
                                                { label: "Active", value: 'active' },
                                            ]}
                                            onChange={() => setStatus(!status)}
                                            value={status ? 'active' : 'draft'}
                                        />
                                    </div>
                                </Card>
                                <Card sectioned title="Sellers">
                                    <div className="Type-Section">
                                        {/* <Text variant="bodyMd" as="p" fontWeight="regular">
                      {`Add this product to a collection so it’s easy to find in your store.`}
                    </Text> */}
                                        <div className="label_editor">
                                            <InputField
                                                label="Seller Email*"
                                                placeholder="Enter Seller Email Here"
                                                type="text"
                                                marginTop
                                                name="email"
                                                value={sellerEmail}
                                                onChange={(e) => setSellerEmail(e.target.value)}

                                            />
                                        </div>
                                    </div>
                                </Card>

                                <Card
                                    sectioned
                                    title="Product Categories and Tags"
                                >
                                    <div className="Type-Section">
                                        {/* <Text variant="bodyMd" as="p" fontWeight="regular">
                      {`You can add product handle and product's metafields from here.`}
                    </Text> */}
                                        <div className="margin-top" />
                                        <Autocomplete
                                            allowMultiple
                                            options={collectionOptions}
                                            selected={collectionOptionsSelected}
                                            textField={collectionTextField}
                                            loading={optionsLoading}
                                            onSelect={
                                                setCollectionOptionsSelected
                                            }
                                            listTitle="Collections"
                                        />
                                        {/* <Select
                      label="Categories"
                      options={categories}
                      onChange={(value) => setCategorySelect(value)}
                      value={categorySelect}
                    /> */}
                                        <div className="margin-top" />
                                        <div onKeyDown={handleKeyPress}>
                                            <TextField
                                                id="pendingTag"
                                                label="Tags"
                                                value={pendingTag}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>{tagsToAddMarkup}</div>
                                        <div className="label_editor">
                                            <InputField
                                                label="Product Type"
                                                placeholder="Enter Product Type"
                                                type="text"
                                                marginTop
                                                name="handle"
                                                value={productHandle}
                                                onChange={handleProductHandle}
                                            />
                                        </div>
                                        {/* <div className="label_editor">
                      <h2 class="Polaris-Text--root Polaris-Text--headingMd">
                        Product Meta Fields
                      </h2>
                    </div> */}
                                        {/* <InputField
                      label="Vendor"
                      placeholder="Enter Product's title meta field Here"
                      type="text"
                      marginTop
                      name="handle"
                      value={titleMetafield}
                      onChange={handleTitleMetafield}
                    /> */}
                                        <div className="margin-top" />
                                        <InputField
                                            label="Vendor"
                                            placeholder="Enter Vendor Name"
                                            type="text"
                                            marginTop
                                            name="vendor"
                                            value={vendor}
                                            onChange={(e) =>
                                                setVendor(e.target.value)
                                            }
                                        />
                                        {/* <Select
                      label="Vendor"
                      options={categories}
                      onChange={(value) => setVendorSelect(value)}
                      value={vendorSelect}
                    /> */}
                                        {/* <Autocomplete
                      allowMultiple
                      options={autoOptions}
                      selected={selectedOptions}
                      textField={textField}
                      onSelect={setSelectedOptions}
                      listTitle="Tags"
                    /> */}

                                        {/* <InputField
                      multiline={1}
                      label="Description tag meta field"
                      placeholder="Enter Product's description meta field Here"
                      type="text"
                      marginTop
                      name="handle"
                      value={descriptionMetafield}
                      onChange={handleDescriptionMetafield}
                    /> */}
                                    </div>
                                </Card>
                            </div>
                        </Layout.Section>
                    </Layout>

                    <div className="Polaris-Product-Actions">
                        <PageActions
                            primaryAction={{
                                content: "Save Changes",
                                onAction: addProduct,
                                loading: btnLoading,
                            }}
                            secondaryActions={[
                                {
                                    content: "Discard",
                                    onAction: handleDiscardModal,
                                },
                            ]}
                        />
                    </div>
                </Page>
            )}
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
