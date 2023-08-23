import React, {useState, useCallback, useEffect, useContext, useMemo} from "react";
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
    Select,
    Checkbox,
    useSetIndexFiltersMode,
    ChoiceList,
    SkeletonPage,
    RangeSlider,
    IndexFilters, SkeletonBodyText, Autocomplete, Stack, Tag,
} from "@shopify/polaris";
import { Frame, ContextualSaveBar } from "@shopify/polaris";
import {
  SearchMinor,
  ExternalMinor,
  DeleteMinor,
  HorizontalDotsMinor,
} from "@shopify/polaris-icons";
import { AppContext } from "../components/providers/ContextProvider";
import { SkeltonPageForTable } from "../components/global/SkeltonPage";
import { CustomBadge } from "../components/Utils/CustomBadge";
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/Utils";
import {getAccessToken} from "../assets/cookies";
import ReactSelect from "react-select";
// import dateFormat from "dateformat";

export function ProductsListing() {
  const { apiUrl } = useContext(AppContext);
  // const { user } = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [active, setActive] = useState(false);

    const [sellerList, setSellerList] = useState([]);

    const [skeleton, setSkeleton] = useState(false)

    const [sellerEmailList, setSellerEmailList] = useState(
        []
    );

    const [sellerEmailListSelected, setSellerListSelected] =
        useState("");
    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);

  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageCursor, setPageCursor] = useState("next");
  const [pageCursorValue, setPageCursorValue] = useState("");
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [previousPageCursor, setPreviousPageCursor] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

    const [sellerEmailInputValue, setSellerEmailInputValue] = useState("");
    const [optionsLoading, setOptionsLoading] = useState(false);
    const CollectionsOptionsData = useMemo(
        () => [
            { value: "Catalogs", label: "catalog" },
            { value: "Zippo Display", label: "zippo" },
        ],
        []
    );

    const [collectionOptionsSelected, setCollectionOptionsSelected] =
        useState("");
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

    const removeSellerEmail = useCallback(
        (collection) => () => {
            const collectionOptions = [...sellerEmailListSelected];
            collectionOptions.splice(collectionOptions.indexOf(collection), 1);
            setSellerListSelected(collectionOptions);
        },
        [collectionOptionsSelected]
    );

    function tagTitleCase(string) {
        return string
            .toLowerCase()
            .split(" ")
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join("");
    }
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
            // onChange={sellerUpdateText}
            label="Seller Email*"
            value={sellerEmailInputValue}
            placeholder="Select Seller"
            verticalContent={sellerContentMarkup}
        />
    );
  //modal code
  const [modalReassign, setModalReassign] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [uniqueId, setUniqueId] = useState();
  const [btnLoading, setBtnLoading] = useState(false);
  const [sellerMessage, setSellerMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSaveBar, setShowSaveBar] = useState(false);
  const [selected2, setSelected2] = useState("today");
  const [disableModal, setDisableModal] = useState(false);
  const [deleteSellerModal, setDeleteSellerModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [sellerEmail, setSellerEmail] = useState("");
    const [toggleLoadData1, setToggleLoadData1] = useState(true);
    const [formErrors, setFormErrors] = useState({});




    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showSelect, setShowSelect] = useState(true);
    const [showClearButton, setShowClearButton] = useState(false);
    const toggleActive1 = useCallback(() => setActive((active) => !active), []);

  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  const deleteSellerModalHandler = () => {
    setDeleteSellerModal(true);
  };

  const deleteModalCloseHandler = () => {
    setDeleteSellerModal(false);
  };



  const handleReassignAction = (id) => {
    setUniqueId(id);
      setSellerListSelected([])
    setModalReassign(true);
  };

  const handleSelectChange2 = useCallback((value) => setSelected2(value), []);

  const options = [
    { label: "New", value: "new" },
    { label: "Old", value: "old" },
  ];

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const handleSendMessageCloseAction = () => {
    setUniqueId();
    setSellerMessage("");
    setModalReassign(false);
  };


    const handleSelectChange = async (selectedOption)  => {

        const sessionToken = getAccessToken();
        setLoading(true)

setSelectedStatus(selectedOption)
        setShowClearButton(true)
        try {
            const response = await axios.get(`${apiUrl}/search-seller-product?value=${selectedOption.value}&product_name=${queryValue}&status=${selected}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            console.log(response?.data)
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

            setLoading(false)


        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    };


  const handleChangePasswordCloseAction = () => {
    setUniqueId();
    setPassword("");
    setConfirmPassword("");
    setModalChangePassword(false);
  };

  const handleSellerMessage = (e) => {
    setSellerMessage(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleActive = (id) => {
    setActive((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });
  };



    const handlePaginationTabs = (active1, page) => {
        if (!active1) {
            setPagination(page);
            setToggleLoadData1(!toggleLoadData1);
        }
    };

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

  // ---------------------Tag/Filter Code Start Here----------------------
  const handleQueryValueRemove = () => {
    setPageCursorValue("");
      getData()
    setQueryValue("");
    setToggleLoadData(true);
  };

    const handleClearButtonClick = () => {
        setLoading(true)
        setSelectedStatus('');
        setShowClearButton(false);
        getData();

    };

  let timeoutId = null;


    const handleFilterClick = (type) => {
        setFilterType(type);
        setSelectedStatus('');
        setSelectedBrand('');
        setSelectedCategory('');
        setShowSelect(true);
        setShowClearButton(true);
    };

    const handleFiltersQueryChange = async (value)  => {
        setTableLoading(true)
        setPageCursorValue('')

        setQueryValue(value)

        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/search-product?value=${value}&seller=${selectedStatus.value}&status=${selected}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setProducts(response?.data?.data)
            setTableLoading(false)


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
        console.log("value", value, nextPageCursor)
        if (value == "next") {
            setPageCursorValue(nextPageCursor);
        } else {
            setPageCursorValue(previousPageCursor);
        }
        setPageCursor(value);
        setToggleLoadData(!toggleLoadData);
    };


    const getData = async () => {

        const sessionToken = getAccessToken();
        try {

            if (pageCursorValue != '') {

                var url = pageCursorValue;
            } else {
                var url = `${apiUrl}/products?${pageCursor}=${pageCursorValue}`;
            }
            console.log(pageCursorValue)

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            console.log(response?.data)
            setProducts(response?.data?.products?.data)
            let arr_seller = response?.data?.sellers.map(({ name, email }) => ({
                value: email,
                label: `${name} (${email})`
            }));
            setSellerList(arr_seller)
            setSellerEmailList(arr_seller)
            setCurrency(response?.data?.currency)

            setNextPageCursor(response?.data?.products?.next_page_url)
            setPreviousPageCursor(response?.data?.products?.prev_page_url)
            if (response?.data?.products?.next_page_url) {
                setHasNextPage(true)
            } else {
                setHasNextPage(false)
            }
            if (response?.data?.products?.prev_page_url) {
                setHasPreviousPage(true)
            } else {
                setHasPreviousPage(false)
            }

            // setPaginationUrl(response?.data?.products?.links);
            // if (
            //     response?.data?.products?.total >
            //     response?.data?.products?.per_page
            // ) {
            //     setShowPagination(true);
            // } else {
            //     setShowPagination(false);
            // }
            setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }



  // ---------------------Index Table Code Start Here----------------------

  const resourceName = {
    singular: "Customer",
    plural: "Customers",
  };

  const handleEditAction = (id) => {
    navigate(`/edit-product/${id}`);
  };


    const handleEnableAction=async (id) => {
        setSkeleton(true)
        setLoading(true)
        const sessionToken = getAccessToken();

        try {
            const response = await axios.get(`${apiUrl}/update-product-status?id=${id}&product_status=Approved`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setDisableModal(false);
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            getData()
            setLoading(false)
            setSkeleton(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }
    }

    const deleteProduct  = async (id) => {

        setSkeleton(true)
        setLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.delete(`${apiUrl}/delete-product?id=${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getData();
            setLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setSkeleton(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }

    }


    const handleDisableAction = async(id) => {

        setSkeleton(true)
        setLoading(true)
        const sessionToken = getAccessToken();
        try {
            const response = await axios.get(`${apiUrl}/update-product-status?id=${id}&product_status=Disabled`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setToastMsg(response?.data?.message)
            setSucessToast(true)
            getData()
            setLoading(false)
            setSkeleton(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }
    };

  const handleViewinStoreAction = useCallback(
    () => console.log("View in Store action"),
    []
  );

  const handleSendMessageAction = (id) => {
    setUniqueId(id);
    setModalReassign(true);
  };

  const handleChangePasswordAction = (id) => {
    setUniqueId(id);
    setModalChangePassword(true);
  };

  const handleDeleteSellerAction = useCallback(
    () => console.log("View in delete action"),
    []
  );

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  useEffect(() => {
    console.log(selectedResources, "eqeeeqeqeq");
  }, [selectedResources]);

  const allResourcesSelect = products?.every(({ id }) =>
    selectedResources.includes(id)
  );

    useEffect(() => {
        getData()
    }, [toggleLoadData]);


    const bulkActions = [
    {
      content: selectedResources.length > 0 && "Disable",
      onAction: () => {
        const newSelection = selectedResources.filter(
          (id) => !customers.find((customer) => customer.id === id)
        );
        handleSelectionChange(newSelection);
      },
    },
    {
      content: allResourcesSelect ? "Disable all" : "Enable all",
      onAction: () => {
        const newSelection = allResourcesSelect
          ? []
          : customers.filter((o) => o.id);
        handleSelectionChange(newSelection);
      },
    },
  ];

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

  const rowMarkup =products ? products?.map(
    (
      {
        id,
        product_id,
          featured_image,
        product_name,
        seller_name,
        type,
        price,
        quantity,
        product_status,
      },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
        onClick={() => handleRowClick(id)} // Add this line
      >
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {id != null ? id : "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Avatar size="small" shape="square" name="title" source={featured_image} />
        </IndexTable.Cell>

        <IndexTable.Cell className="Capitalize-Cell">
          {product_name != null ? product_name : "---"}
        </IndexTable.Cell>

        <IndexTable.Cell>{seller_name != null ? seller_name : "---"}</IndexTable.Cell>

        <IndexTable.Cell>
          <CustomBadge value={"NORMAL"} type="products" />
        </IndexTable.Cell>

          <IndexTable.Cell>{price != null ? `${currency} ${price.toFixed(2)}` : '---'}</IndexTable.Cell>
        <IndexTable.Cell>{quantity != null ? quantity : "---"}</IndexTable.Cell>

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
        <IndexTable.Cell>
          <Popover
            active={active[id]}
            activator={
              <Button onClick={() => toggleActive(id)} plain>
                <Icon source={HorizontalDotsMinor}></Icon>
              </Button>
            }
            autofocusTarget="first-node"
            onClose={() => setActive(false)}
          >
            <ActionList
              actionRole="menuitem"
              items={[
                {
                  content: "Edit",
                  onAction: () => handleEditAction(id),
                },
                // {
                //   content: "View in Store",
                //   onAction: handleViewinStoreAction,
                // },
                {
                  content: "Reassign",
                  onAction: () => handleReassignAction(id),
                },

                {
                    content: product_status=='Approval Pending' ?"Enable" : product_status=='Approved' ? "Disable" :  product_status=='Disabled' ? "Enable" : '' ,
                    onAction: () =>  product_status=='Approval Pending' ?  handleEnableAction(id) : product_status=='Approved' ? handleDisableAction(id) :product_status=='Disabled' ? handleEnableAction(id) : '',
                },


                {
                  content: "Delete",
                    onAction: ()=>deleteProduct(id),
                },
              ]}
            />
          </Popover>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  ) : <EmptySearchResult title={"No Product Found"} withIllustration />

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Product Found"} withIllustration />
  );

  const handleClearStates = () => {
    setCustomers([]);
    setPageCursorValue("");
    setNextPageCursor("");
    setPreviousPageCursor("");
  };

  const activator = (
    <Button onClick={toggleActive} disclosure>
      <Icon source={HorizontalDotsMinor}></Icon>
    </Button>
  );

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  // ---------------------New Table Code----------------------
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };
  const [moneySpent, setMoneySpent] = useState(undefined);
  const [taggedWith, setTaggedWith] = useState("");
  // const [queryValue, setQueryValue] = useState("");

  const handleAccountStatusChange = useCallback(
    (value) => setAccountStatus(value),
    []
  );
  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  // const handleFiltersQueryChange = useCallback(
  //   (value) => setQueryValue(value),
  //   []
  // );
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    []
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );

  const [itemStrings, setItemStrings] = useState([
    "All",
    "Approval Pending",
    "Approved",
    "Disabled",
  ]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const [accountStatus, setAccountStatus] = useState(undefined);

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const filters = [
    {
      key: "accountStatus",
      label: "Account status",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: "Enabled", value: "enabled" },
            { label: "Not invited", value: "not invited" },
            { label: "Invited", value: "invited" },
            { label: "Declined", value: "declined" },
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: "moneySpent",
      label: "Money spent",
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent || [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
    },
  ];
  const appliedFilters = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = "accountStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = "moneySpent";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
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

  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  // const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);
  const tabs = itemStrings?.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,

  }));
  const primaryAction =
    selected === 0
      ? {

          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };

  const sortOptions = [
    { label: "Order", value: "order asc", directionLabel: "Ascending" },
    { label: "Order", value: "order desc", directionLabel: "Descending" },
    { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
    { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
    { label: "Date", value: "date asc", directionLabel: "A-Z" },
    { label: "Date", value: "date desc", directionLabel: "Z-A" },
    { label: "Total", value: "total asc", directionLabel: "Ascending" },
    { label: "Total", value: "total desc", directionLabel: "Descending" },
  ];

  const [sortSelected, setSortSelected] = useState(["order asc"]);

  // ---------------------New Table Code Ends----------------------

  // ---------------------Api Code starts Here----------------------

  const getCustomers = async () => {
    setCustomersLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/shopify/customers?title=${queryValue}&${pageCursor}=${pageCursorValue}`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('getCustomers response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        let customers = response.data.data.body?.data?.customers;
        let customersArray = [];
        let nextValue = "";

        if (customers?.edges?.length > 0) {
          let previousValue = customers.edges[0]?.cursor;
          customers?.edges?.map((item) => {
            nextValue = item.cursor;
            customersArray.push({
              id: item.node.id.replace("gid://shopify/Customer/", ""),
              name: item.node.displayName,
              email: item.node.email,
              ordersCount: item.node.ordersCount,
              totalSpent: item.node.totalSpent,
              address: item.node.defaultAddress?.formattedArea,
            });
          });

          setCustomers(customersArray);
          setPageCursorValue("");
          setNextPageCursor(nextValue);
          setPreviousPageCursor(previousValue);
          setHasNextPage(customers.pageInfo?.hasNextPage);
          setHasPreviousPage(customers.pageInfo?.hasPreviousPage);
        } else {
          handleClearStates();
        }
        setStoreUrl(response.data.user?.shopifyShopDomainName);
      }

      setLoading(false);
      setCustomersLoading(false);
      setToggleLoadData(false);
    } catch (error) {
      console.warn("getCustomers Api Error", error.response);
      setLoading(false);
      // setCustomersLoading(false)
      setToastMsg("Server Error");
      setToggleLoadData(false);
      setErrorToast(true);
      handleClearStates();
    }
  };

  const closeDisableModal = () => {
    setDisableModal(false);
  };

  useEffect(() => {
    if (toggleLoadData) {
      // getCustomers()
    }

    setCustomersLoading(false);
  }, [toggleLoadData]);

  const handleReassignCloseAction = () => {
    setUniqueId();
    setSellerEmail("");
    setModalReassign(false);
  };
  const handleSellerEmail = (e) => {
    setSellerEmail(e.target.value);
  };

    const assignProductToSeller = async () => {

        const sessionToken = getAccessToken();
        const errors = {};


        setBtnLoading(true)
        let data = {
            id: uniqueId,
            email:sellerEmailListSelected
        }
        try {
            const response = await axios.post(`${apiUrl}/reassign-seller`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            getData()
            handleReassignCloseAction()


        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

    }

    const handleProductFilter =async (value) =>  {
        setSelected(value)
        setLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/product-filter?status=${value}&value=${queryValue}&seller=${selectedStatus.value}&page=${pagination}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setProducts(response?.data?.products)
            setLoading(false)



        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    const handleExportProduct = async () => {
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        try {
            const response = await axios.get(`${apiUrl}/export-product`,
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
    return (
    <div className="Products-Page IndexTable-Page Orders-page">
      <Modal
        open={modalReassign}
        onClose={handleReassignCloseAction}
        title="Assign Product To Seller"
        primaryAction={{
          content: "Reassign",
          destructive: true,
            onAction: assignProductToSeller,
            loading:btnLoading
        }}
        secondaryActions={[
          {
            content: "Cancel",

            onAction: handleReassignCloseAction,
          },
        ]}
      >
        <Modal.Section>
          {/*<InputField*/}
          {/*  label="Seller Email *"*/}
          {/*  type="text"*/}
          {/*  name="seller_email"*/}
          {/*  value={sellerEmail}*/}
          {/*  onChange={handleSellerEmail}*/}
          {/*  error={formErrors.sellerEmail}*/}
          {/*/>*/}

            <Autocomplete

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
      <Modal
        open={deleteSellerModal}
        onClose={deleteModalCloseHandler}
        title="Delete Seller"
        primaryAction={{
          content: "Delete Seller",
          destructive: true,
          style: { backgroundColor: "red" },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: deleteModalCloseHandler,
          },
        ]}
      >
        <Modal.Section>
          <Text>Do you want to delete seller permanently?</Text>
          <div className="margin-top" />
          <Checkbox
            label="Delete Products from Shopify"
            checked={checked}
            onChange={handleChange}
          />
          <div className="margin-top" />
          <br />
          <div className="margin-top" />
          <b style={{ fontSize: "20px", color: "red", marginTop: "20px" }}>
            Note :
          </b>

          <br />
          <div className="margin-top" />
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
            fugiat alias voluptas non! Ipsum commodi nihil tempora dolorem autem
            quisquam modi ducimus, delectus, quidem ipsam, possimus voluptatibus
            cumque tenetur ea.
          </Text>
        </Modal.Section>
      </Modal>
      <Modal
        open={disableModal}
        onClose={closeDisableModal}
        title="Send Message to Seller"
        primaryAction={{
          content: "Disable",
          destructive: true,
          disabled: btnLoading,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: closeDisableModal,
          },
        ]}
      >
        <Modal.Section>
          <Text>Are You sure you want to Disable ?</Text>
        </Modal.Section>
      </Modal>

      <Modal
        open={modalChangePassword}
        onClose={handleChangePasswordCloseAction}
        title="Reset Password For Seller"
        loading={btnLoading[2]}
        primaryAction={{
          content: "Change",
          destructive: true,
          disabled: btnLoading[2],
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading[2],
            onAction: handleChangePasswordCloseAction,
          },
        ]}
      >
        <Modal.Section>
          <InputField
            label="Password*"
            placeholder="Enter Password"
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
          />

          <InputField
            marginTop
            label="Confirm Password*"
            placeholder="Enter Password again"
            type="password"
            name="confirm_password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
          />
        </Modal.Section>
      </Modal>

      {loading ? (
        <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
      ) : (
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
            <div className="Polaris-Table product_listing">
                {skeleton ? <SkeletonBodyText/> :
                    <>
              <Card.Section fullWidth subdued hasPaddingTop={false}>

                {/*<IndexFilters*/}
                {/*  // sortOptions={sortOptions}*/}
                {/*  // sortSelected={sortSelected}*/}
                {/*  // queryValue={queryValue}*/}
                {/*  // queryPlaceholder="Searching in all"*/}
                {/*  // onQueryChange={handleFiltersQueryChange}*/}
                {/*  // onQueryClear={() => {}}*/}
                {/*  onSort={setSortSelected}*/}
                {/*  primaryAction={primaryAction}*/}
                {/*  cancelAction={{*/}
                {/*    onAction: () => {},*/}
                {/*    disabled: false,*/}
                {/*    loading: false,*/}
                {/*  }}*/}
                {/*  tabs={tabs}*/}
                {/*  selected={selected}*/}
                {/*  onSelect={handleProductFilter}*/}
                {/*  canCreateNewView*/}
                {/*  onCreateNewView={onCreateNewView}*/}
                {/*  filters={filters}*/}
                {/*  // appliedFilters={appliedFilters}*/}
                {/*  // onClearAll={handleFiltersClearAll}*/}
                {/*  mode={mode}*/}
                {/*  // setMode={setMode}*/}
                {/*/>*/}

                  <div>
                      <Tabs
                          tabs={tabs}
                          selected={selected}
                          onSelect={handleProductFilter}
                      ></Tabs>
                  </div>
                  <div className="product_listing_search" style={{ padding: '16px', display: 'flex' }}>
                      <div style={{ flex: '70%' }}>
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
                  itemCount={products?.length}
                  loading={tableLoading}
                  hasMoreItems
                  selectable={false}
                  selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}

                  emptyState={emptyStateMarkup}
                  headings={[
                    { title: "Product Id" },
                    { title: "Image" },
                    { title: "Product Name" },
                    { title: "Seller" },
                    { title: "Type" },
                    { title: "Price" },
                    { title: "Quantity" },
                    { title: "Status" },
                    { title: "Action" },
                  ]}
                  bulkActions={bulkActions}
                >

                  {rowMarkup}

                    </IndexTable>

              </Card.Section>
                    </>
                }

              <Card.Section>
                <div
                  className="data-table-pagination"
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
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return value?.map((val) => `Customer ${val}`).join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
