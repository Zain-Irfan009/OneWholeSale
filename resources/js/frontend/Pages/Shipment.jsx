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
// import { useAuthState } from '../components/providers/AuthProvider'
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import { InputField } from "../components/Utils";
import {getAccessToken} from "../assets/cookies";
import ReactSelect from "react-select";
// import dateFormat from "dateformat";

export function Shipment() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page')) || 1;
    const search_value = (queryParams.get('search')) || "";

    const [loading, setLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState(search_value);
    const [toggleLoadData, setToggleLoadData] = useState(true);
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [storeUrl, setStoreUrl] = useState("");
    const [active, setActive] = useState(false);



    const [sellerList, setSellerList] = useState([]);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
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

    const [shipments, setShipments] = useState([]);
    const [currency, setCurrency] = useState('');
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [pageCursor, setPageCursor] = useState("next");
    const [pageCursorValue, setPageCursorValue] = useState("");
    const [nextPageCursor, setNextPageCursor] = useState("");
    const [previousPageCursor, setPreviousPageCursor] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [orignalSellerEmailList, setOrignalSellerEmailList] = useState(
        []
    );

    const [sellerEmailInputValue, setSellerEmailInputValue] = useState("");
    const [optionsLoading, setOptionsLoading] = useState(false);


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
            onChange={sellerUpdateText}
            label="Seller Shop*"
            error={formErrors.sellerEmail}
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

    const [activeState, setActiveState] = useState(false);





    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSeller, setSelectedSeller] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showSelect, setShowSelect] = useState(true);
    const [showClearButton, setShowClearButton] = useState(false);
    const toggleActive1 = useCallback(() => setActive((active) => !active), []);

    const [deleteProductModal, setDeleteProductModal] = useState(false);

    const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

    const deleteSellerModalHandler = () => {
        setDeleteSellerModal(true);
    };



    const handleMultipleReassign = async () => {

        setModalReassign(true);
    }


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

    };

    const handleSellerSelectChange = async (selectedOption)  => {

        const sessionToken = getAccessToken();
        setLoading(true)

        setSelectedSeller(selectedOption)

        setShowClearButton(true)

    };


    const handleSelectStatus = async (selectedOption)  => {

        setSelectedStatus(selectedOption)

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


    const handleChangeStatus = (id) => {
        setUniqueId(id);
        setSellerListSelected([])
        setModalReassign(true);
    };


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
        setSelectedSeller('');
        setShowClearButton(false);
        getData();

    };

    let timeoutId = null;


    const handleFilterClick = (type) => {
        setFilterType(type);
        setSelectedStatus('');
        setSelectedSeller('');
        setSelectedBrand('');
        setSelectedCategory('');
        setShowSelect(true);
        setShowClearButton(true);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (activeState) {
            params.set('search', queryValue);
            navigate(`/shipment?${params.toString()}`);
        }

    }, [queryValue]);

    const handleFiltersQueryChange = async (value)  => {

        setPageCursorValue('')
        setQueryValue(value)
        setActiveState(true)

        const sessionToken = getAccessToken();

    }



    const handlePagination = (value) => {
        console.log("value", value, nextPageCursor)
        if (value == "next") {

            const nextPage = currentPage + 1;
            queryParams.set('page', nextPage.toString());
            navigate(`/shipments?${queryParams.toString()}`);

            setPageCursorValue(nextPageCursor);
        } else {
            const prevPage = currentPage - 1;
            queryParams.set('page', prevPage.toString());
            navigate(`/shipments?${queryParams.toString()}`);

            setPageCursorValue(previousPageCursor);
        }
        setPageCursor(value);
        setToggleLoadData(!toggleLoadData);
    };


    const getData = async () => {

        const sessionToken = getAccessToken();
        setTableLoading(true)
        console.log('selectedStatus',selectedStatus.value)
        try {

            if (pageCursorValue != '') {
                var status = encodeURIComponent(selectedStatus.value);
                var seller = encodeURIComponent(selectedSeller.value);
                var url = pageCursorValue+ '&value=' + queryValue +'&status=' +status+'&seller='+seller ;
            } else {
                var status = encodeURIComponent(selectedStatus.value);
                var seller = encodeURIComponent(selectedSeller.value);
                var url = `${apiUrl}/shipment?page=${currentPage}&${pageCursor}=${pageCursorValue}&value=${queryValue}&status=${status}&seller=${seller}`;
            }
            console.log(pageCursorValue)

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            if(location.state?.customText) {
                setToastMsg(location.state?.customText)
                setSucessToast(true)
            }

            console.log(response?.data)
            setShipments(response?.data?.shipments?.data)

            let arr_seller = response?.data?.sellers.map(({ id,name,seller_shopname, email }) => ({
                value: id,
                // label: `${name} (${email})`
                label: `${seller_shopname}`
            }));
            setSellerList(arr_seller)


            setNextPageCursor(response?.data?.shipments?.next_page_url)
            setPreviousPageCursor(response?.data?.shipments?.prev_page_url)
            if (response?.data?.shipments?.next_page_url) {
                setHasNextPage(true)
            } else {
                setHasNextPage(false)
            }
            if (response?.data?.shipments?.prev_page_url) {
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
            setTableLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
            console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setLoading(false)
            setTableLoading(false)
        }
    }



    // ---------------------Index Table Code Start Here----------------------

    const resourceName = {
        singular: "shipment",
        plural: "shipments",
    };

    const handleEditAction = (id) => {
        navigate(`/edit-shipment/${id}`);
    };





    const deleteProductModalHandler = (id) => {
        setUniqueId(id)
        setDeleteProductModal(true);
    };

    const deleteModalCloseHandler = () => {
        setDeleteProductModal(false);
    };










    const handleDeleteSellerAction = useCallback(
        () => console.log("View in delete action"),
        []
    );

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(shipments);




    useEffect(() => {
        console.log(selectedResources, "eqeeeqeqeq");
        console.log(allResourcesSelected, "allResourcesSelected");
    }, [selectedResources,allResourcesSelected]);

    const allResourcesSelect = shipments?.every(({ id }) =>
        selectedResources.includes(id)
    );

    useEffect(() => {

        getData()
    }, [toggleLoadData,queryValue,selectedStatus.value,selected,selectedSeller.value]);


    const promotedBulkActions = [
        {
            content: 'Select',

        },
    ];





    //   const bulkActions = [
    //   {
    //     content: selectedResources.length > 0 && "Disable",
    //     onAction: () => {
    //       const newSelection = selectedResources.filter(
    //         (id) => !customers.find((customer) => customer.id === id)
    //       );
    //       handleSelectionChange(newSelection);
    //     },
    //   },
    //   {
    //     content: allResourcesSelect ? "Disable all" : "Enable all",
    //     onAction: () => {
    //       const newSelection = allResourcesSelect
    //         ? []
    //         : customers.filter((o) => o.id);
    //       handleSelectionChange(newSelection);
    //     },
    //   },
    // ];

    const bulkActions = [
        // {
        //   content: selectedResources.length > 0 && "Disable",
        //   // content: selectedResources.length > 0 && "Enable all",
        //   onAction: () => {
        //     const newSelection = selectedResources.filter(
        //       (id) => !customers?.find((customer) => customer.id === id)
        //     );
        //     handleSelectionChange(newSelection);
        //   },
        // },

        {

            content:  "Reassign" ,
            onAction: () => handleMultipleReassign(),
        },
        {
            // content: allResourcesSelect ? "Disable all" : "Enable all",
            content:  "Enable all" ,
            onAction: () => handleMultipleStatusEnableAll(),
        },
        {
            // content: allResourcesSelect ? "Disable all" : "Enable all",
            content:  "Disable all",
            // onAction: () => {
            //   const newSelection = allResourcesSelect
            //     ? []
            //     : customers.filter((o) => o.id);
            //   handleSelectionChange(newSelection);
            // },
            onAction: () => handleMultipleStatusDisableAll(),
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

    const rowMarkup =shipments ? shipments?.map(
        (
            {
                id,
                created_at,
                seller_name,
                courier_name,
                comment,
                tracking_number,
                status,
                file
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

                <IndexTable.Cell className="Capitalize-Cell">
                {seller_name != null ? seller_name : "---"}
            </IndexTable.Cell>
                <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>

                <IndexTable.Cell className="Capitalize-Cell">
                    {courier_name != null ? courier_name : "---"}
                </IndexTable.Cell>

                <IndexTable.Cell>{tracking_number != null ? tracking_number : "---"}</IndexTable.Cell>
                <IndexTable.Cell className="fulfilled">
                <Badge progress='complete'>{status != null ? status : "---"}</Badge>
                </IndexTable.Cell>

                <IndexTable.Cell>{file != null ? 'Yes' : "No"}</IndexTable.Cell>


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
                                    content: "Change Status",
                                    onAction: () => handleChangeStatus(id),
                                },


                            ]}
                        />
                    </Popover>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    ) : <EmptySearchResult title={"No Shipment Found"} withIllustration />

    const emptyStateMarkup = (
        <EmptySearchResult title={"No Shipment Found"} withIllustration />
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

    const handleAddShipment = () => {
        navigate("/add-shipment");
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
        // "Approval Pending",
        // "Approved",
        // "Disabled",
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
        setSellerEmailInputValue('')
        setSellerEmailList(orignalSellerEmailList)
        setSellerEmail("");
        setModalReassign(false);
    };
    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value);
    };

    const assignProductToSeller = async () => {

        const sessionToken = getAccessToken();
        const errors = {};
        console.log('selectedResources',selectedResources)
        console.log('sellerEmailListSelected',sellerEmailListSelected)

        setBtnLoading(true)

        try {


            if (selectedResources.length === 0) {

                var url = `${apiUrl}/change-status-shipment?id=${uniqueId}&status=${selectedStatus}`
            }else{
                var encodedEmail = encodeURIComponent(sellerEmailListSelected);
                var url=`${apiUrl}/change-status-shipment?ids=${selectedResources}&status=${selectedStatus}`
            }
            const response = await axios.get(url,
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
            console.log(error)
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

    }

    const handleProductFilter =async (value) =>  {
        setSelected(value)
        setLoading(true)
        const sessionToken = getAccessToken();

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
                title="Change Shipment Status"
                primaryAction={{
                    content: "Update",
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

                    <Select
                        name='pushed_status'
                        options={[
                            { value: 'Updated', label: 'Updated' },
                            { value: 'Received', label: 'Received' },
                        ]}
                        placeholder="Select Status"
                        value={selectedStatus}
                        onChange={(selectedOption) => handleSelectStatus(selectedOption)}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                        }}
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
                    title="Shipments"



                >
                    <Card>
                        <div className="Polaris-Table product_listing">
                            {skeleton ? <SkeletonBodyText/> :
                                <>
                                    <Card.Section fullWidth subdued hasPaddingTop={false}>


                                        <div>
                                            <Tabs
                                                tabs={tabs}
                                                selected={selected}
                                                onSelect={handleProductFilter}
                                            ></Tabs>
                                        </div>
                                        <div className="product_listing_search" style={{ padding: '16px', display: 'flex' }}>
                                            <div style={{ flex: '40%' }}>
                                                <TextField
                                                    placeholder='Search Shipment'
                                                    value={queryValue}
                                                    onChange={handleFiltersQueryChange}
                                                    clearButton
                                                    onClearButtonClick={handleQueryValueRemove}
                                                    autoComplete="off"
                                                    prefix={<Icon source={SearchMinor} />}
                                                />
                                            </div>
                                            <div style={{ flex: '30%', padding: '0px',alignItems: 'center', justifyContent: 'flex-end' }}>

                                                <div style={{ flex: '1' }}>

                                                    <div style={{ position: 'relative', width: 'auto', zIndex: 99999 }}>
                                                        <ReactSelect
                                                            name='pushed_status'
                                                            options={sellerList}
                                                            placeholder="Select Seller"
                                                            value={selectedSeller}
                                                            onChange={(selectedOption) => handleSellerSelectChange(selectedOption)}
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


                                            <div style={{ flex: '30%', padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>

                                                <div style={{ flex: '1' }}>

                                                    <div style={{ position: 'relative', width: 'auto', zIndex: 99999 }}>
                                                        <ReactSelect
                                                            name='pushed_status'
                                                            options={[
                                                                { value: 'In-transit', label: 'In-transit' },
                                                                { value: 'Updated', label: 'Updated' },
                                                                { value: 'Received', label: 'Received' },
                                                            ]}
                                                            placeholder="Select Status"
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
                                            itemCount={shipments?.length}
                                            loading={tableLoading}

                                            selectable={false}


                                            onSelectionChange={handleSelectionChange}

                                            emptyState={emptyStateMarkup}
                                            headings={[
                                                { title: "No" },
                                                { title: "Seller" },
                                                { title: "Date" },
                                                { title: "Courier" },
                                                { title: "Tracking Numbers" },
                                                { title: "Status" },
                                                { title: "Attachements" },
                                                { title: "Action" },
                                            ]}

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
