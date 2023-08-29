import React, {useState, useCallback, useEffect, useContext, useMemo} from "react";
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
    Select, Autocomplete, Tag,
} from "@shopify/polaris";
import {
  SearchMinor,
  ChevronDownMinor,
  ChevronUpMinor,
} from "@shopify/polaris-icons";
import { SkeltonPageForTable } from "../components/global/SkeltonPage";
import { InputField } from "../components/Utils/InputField";
import { CheckBox } from "../components/Utils/CheckBox";
import { AppContext } from "../components/providers/ContextProvider";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmptyCheckBox from "../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../assets/icons/FillCheckBox.png";
import {getAccessToken} from "../assets/cookies";

export function AddSellerCommission() {
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
  const [storeDescriptioncontent, setStoreDescriptionContent] = useState("");
  const [sellerDescriptioncontent, setSellerDescriptionContent] = useState("");
  const [sellerPolicycontent, setSellerPolicyContent] = useState("");


    const [sellerEmailList, setSellerEmailList] = useState(
        []
    );

    const [sellerEmailListSelected, setSellerListSelected] =
        useState("");


    // =================Products Modal Code Start Here================
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
  const [sellerEmail, setSellerEmail] = useState("");

  const handleProductTabChange = useCallback(
    (selectedTabIndex) => setProductTab(selectedTabIndex),
    []
  );


  const [discount, setDiscount] = useState({
    code: "",
    title: "",
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

  const handleDiscardModal = () => {
    setDiscardModal(!discardModal);
  };

  const discardAddSeller = () => {
    navigate("/seller-commission-setting");
  };
  const handleProductsSaveModal = () => {
    setProductsModal(false);
    setPreviousCheckedVariants(checkedVariants);
  };



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

  // =================Products Modal Code Ends Here================

  // =================Collections Modal Code Start Here================
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionQueryValue, setCollectionQueryValue] = useState("");
  const [toggleLoadCollections, setToggleLoadCollections] = useState(true);
  const [collectionTab, setCollectionTab] = useState(0);
  const [collectionModal, setCollectionModal] = useState(false);
  const [expandedCollection, setExpandedCollection] = useState([]);
  const [globalCollections, setGlobalCollections] = useState([]);
  const [collectionsList, setCollectionsList] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [hasNextPageCollection, setHasNextPageCollection] = useState(false);
  const [nextPageCursorCollection, setNextPageCursorCollection] = useState("");
  const [selectedVariantCollections, setSelectedVariantCollections] = useState(
    []
  );
  const [checkedVariantsCollections, setCheckedVariantsCollections] = useState(
    []
  );
  const [
    previousCheckedVariantsCollections,
    setPreviousCheckedVariantsCollections,
  ] = useState([]);
  const [commissionType, setCommissionType] = useState("%");
  const [firstCommission, setFirstCommission] = useState();
  const [secondCommission, setSecondCommission] = useState();

  const handleCollectionTabChange = useCallback(
    (selectedTabIndex) => setCollectionTab(selectedTabIndex),
    []
  );

  const collectionModalTabs = [
    {
      id: "all-collections",
      content: "All Collections",
    },
    {
      id: "selected-collections",
      content: "Selected Collections",
    },
  ];

  const handleSelectCollectionsModal = () => {
    setCollectionModal(true);
  };


    const getCollectionData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/get-seller-list`,
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


    const handleCollectionsCancelModal = () => {
    setCollectionModal(false);
    setCheckedVariantsCollections(previousCheckedVariantsCollections);
  };

  const handleCollectionsSaveModal = () => {
    setCollectionModal(false);
    setPreviousCheckedVariantsCollections(checkedVariantsCollections);
  };

    const [sellerEmailInputValue, setSellerEmailInputValue] = useState("");
    const [optionsLoading, setOptionsLoading] = useState(false);

    const CollectionsOptionsData = useMemo(
        () => [
            { value: "Catalogs", label: "catalog" },
            { value: "Zippo Display", label: "zippo" },
        ],
        []
    );

    const sellerUpdateText = useCallback(
        (value) => {


            setSellerEmailInputValue(value);

            if (!optionsLoading) {
                setOptionsLoading(true);
            }

            setTimeout(() => {
                if (value === "") {
                    setSellerEmailList(CollectionsOptionsData);
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
                setSellerEmailList(resultOptions);
                setOptionsLoading(false);
            }, 300);
        },
        [CollectionsOptionsData, optionsLoading, sellerEmailListSelected]
    );
    function tagTitleCase(string) {
        return string
            .toLowerCase()
            .split(" ")
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join("");
    }

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
            label="Seller Shop*"
            value={sellerEmailInputValue}
            placeholder="Select Seller"
            verticalContent={sellerContentMarkup}
        />
    );

  const collectionsModalClose = () => {
    setCollectionModal(false);
    setCheckedVariantsCollections([]);
    setPreviousCheckedVariantsCollections([]);
    setCollectionsLoading(false);
    setToggleLoadCollections(false);
    setCollectionTab(0);
    setCollectionQueryValue("");
    setExpandedCollection([]);
    let list = [];
    let all = [];
    globalCollections?.slice(0, 20).map((item) => {
      list.push(item);
    });
    globalCollections?.slice(0, 20).map((item) => {
      all.push(item);
    });
    setCollectionsList(list);
    setAllCollections(all);
    setGlobalCollections(all);
    setSelectedVariantCollections([]);
  };

  function SetCustomVariantsSelectedCollection(checked, type) {
    if (type == "all") {
      let array1 = [];
      checkedVariantsCollections?.map((item) => {
        let value1 = allCollections.find((item2) => item2.id == item);
        if (value1) {
          array1.push(value1.id);
        }
      });
      let array2 = checkedVariantsCollections.filter(function (item) {
        return !array1.includes(item);
      });
      let array3 = checked.concat(array2);
      array3 = [...new Set(array3)];

      setCheckedVariantsCollections(array3);
    } else if (type == "selected") {
      setCheckedVariantsCollections(checked);
    }
  }

  useEffect(() => {
    // console.log('checkedVariantsCollections: ', checkedVariantsCollections)
    // console.log('previousCheckedVariantsCollections: ', previousCheckedVariantsCollections)

    let nodes = groupCollectionNodes(allCollections);
    setCollectionsList(nodes);

    let selectedNodes = [];
    checkedVariantsCollections?.map((item) => {
      let value2 = globalCollections.find((item4) => item4.id == item);
      if (value2) {
        selectedNodes.push(value2);
      }
    });

    if (checkedVariantsCollections?.length < 1) {
      setDiscount({
        ...discount,
        collections: null,
      });
    } else {
      setDiscount({
        ...discount,
        collections: checkedVariantsCollections,
      });
    }

    selectedNodes = selectedNodes.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );
    setSelectedVariantCollections(groupCollectionNodes(selectedNodes));
  }, [checkedVariantsCollections]);

  useEffect(() => {
    // console.log('collectionsList: ', collectionsList)
    // console.log('globalCollections: ', globalCollections);
    // console.log('allCollections: ', allCollections)
    // console.log('selectedVariantCollections: ', selectedVariantCollections)
  }, [
    collectionsList,
    allCollections,
    globalCollections,
    selectedVariantCollections,
  ]);

  function groupCollectionNodes(data) {
    let arr = [];
    data?.map((item) => {
      arr.push({
        value: item.id,
        label: (
          <>
            <span className="Product-Avatar">
              <Avatar size="extraSmall" name={item.title} source={item.image} />
              <span>{item.title}</span>
            </span>
            <span>{`${item.productsCount} products`}</span>
          </>
        ),
        // children: [],
      });
    });

    return arr;
  }

  function CollectionsArraySet(collections, type, value) {
    let nextValue = "";
    let collectionsArray = [];
    if (type == "get") {
      collections?.edges?.map((item) => {
        nextValue = item.cursor;
        collectionsArray.push({
          id: item.node.id.replace("gid://shopify/Collection/", ""),
          title: item.node.title,
          productsCount: item.node.productsCount,
          image: item.node.image?.transformedSrc,
        });
      });
      if (value == "collection") {
        return collectionsArray;
      } else if (value == "nextPage") {
        return nextValue;
      }
    }
  }

  const handleCollectionsPagination = () => {
    if (hasNextPageCollection) {
      setCollectionsLoading(true);
      setToggleLoadCollections(true);
    }
  };


  // =================Collections Modal Code Ends Here================

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

  const handleCreateDiscount = () => {
    document.getElementById("createDiscountBtn").click();
  };

  const handleDiscount = (e) => {
    setDiscount({ ...discount, [e.target.name]: e.target.value });
  };

  const handleSellerEmail = (e) => {
    setSellerEmail(e.target.value);
  };

  const handleFirstCommission = (e) => {
    setFirstCommission(e.target.value);
  };

  const handleSecondCommission = (e) => {
    setSecondCommission(e.target.value);
  };

  const commissionTypeOptions = [
    { label: "%", value: "%" },
    { label: "FIXED", value: "fixed" },
    // { label: "% + FIXED", value: "%_fixed" },
  ];

  const handleCommissionType = useCallback(
    (value) => setCommissionType(value),
    []
  );


    //SUbmit Data
    const submitData = async () => {

        setBtnLoading(true)
        setLoading(true)
        const sessionToken = getAccessToken();


        let data = {
            store_name:sellerEmailListSelected,
            commission_type:commissionType,
            first_commission:firstCommission,
            second_commission:secondCommission,
        };

        try {
            const response = await axios.post(`${apiUrl}/seller-commission-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setLoading(false)
            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)


        } catch (error) {
            setBtnLoading(false)
            setLoading(false)
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
          onAction: discardAddSeller,
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
            <p>Leaving this page will delete all unsaved changes.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>

        {loading ?
            <span>
                    <Loading/>
                    <SkeltonPageForTable/>
                </span>
            :

            <Page
                breadcrumbs={[{content: "Discounts", onAction: handleDiscardModal}]}
                title="Add Seller Commission"
            >


                <Form>
                    <FormLayout>
                        <Card sectioned title="ADD COMMISSION">
                            <Text variant="bodyMd" as="p" fontWeight="regular">
                                {`Enter Commission Details You Want To add. `}
                            </Text>

                            <div className="seller-list">
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

                                {/*<InputField*/}
                                {/*    marginTop*/}
                                {/*    label="Seller Email*"*/}
                                {/*    placeholder="Enter Seller Email Here"*/}
                                {/*    type="email"*/}
                                {/*    required*/}
                                {/*    name="code"*/}
                                {/*    value={sellerEmail}*/}
                                {/*    onChange={handleSellerEmail}*/}
                                {/*/>*/}

                                <div className="add_product_select">
                                    <Select
                                        label="Commission Type"
                                        options={commissionTypeOptions}
                                        onChange={handleCommissionType}
                                        value={commissionType}
                                    />
                                </div>

                                <InputField
                                    label="First Commission*"
                                    name="value"
                                    type="number"
                                    required
                                    marginTop
                                    suffix={`%`}
                                    value={firstCommission}
                                    onChange={handleFirstCommission}
                                />

                                {commissionType == "%_fixed" && (
                                    <>
                                        <InputField
                                            label="Second Commission*"
                                            name="value"
                                            type="number"
                                            required
                                            marginTop
                                            suffix={`FIXED`}
                                            value={secondCommission}
                                            onChange={handleSecondCommission}
                                        />
                                    </>
                                )}
                            </div>
                        </Card>
                    </FormLayout>
                </Form>

                <div className="Polaris-Product-Actions">
                    <PageActions
                        primaryAction={{
                            content: "Save",
                            onAction: submitData,
                            loading: btnLoading,
                        }}
                        // secondaryActions={[
                        //     {
                        //         content: "Cancel",
                        //         onAction: handleDiscardModal,
                        //     },
                        // ]}
                    />
                </div>
            </Page>
        }
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
