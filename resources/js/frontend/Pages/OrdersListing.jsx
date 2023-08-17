import React, { useState, useCallback, useEffect, useContext } from "react";
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
  TextContainer,
  IndexFilters,
  useSetIndexFiltersMode,
  ChoiceList,
} from "@shopify/polaris";
import {
  SearchMinor,
  ExternalMinor,
  DeleteMinor,
  HorizontalDotsMinor,
    ViewMajor
} from "@shopify/polaris-icons";
import { AppContext } from "../components/providers/ContextProvider";
import { SkeltonPageForTable } from "../components/global/SkeltonPage";
import { CustomBadge } from "../components/Utils/CustomBadge";
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/Utils";
import {getAccessToken} from "../assets/cookies";

import ReactSelect from 'react-select';
// import dateFormat from "dateformat";



export function OrdersListing() {
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

  const [orders, setOrders] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageCursor, setPageCursor] = useState("next");
  const [pageCursorValue, setPageCursorValue] = useState("");
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [previousPageCursor, setPreviousPageCursor] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnLoading1, setBtnLoading1] = useState(false);
  const [sellerEmail, setSellerEmail] = useState("");
  const [uniqueId, setUniqueId] = useState();
  const [moneySpent, setMoneySpent] = useState(undefined);
  const [taggedWith, setTaggedWith] = useState("");
  const { mode, setMode } = useSetIndexFiltersMode();
  const [accountStatus, setAccountStatus] = useState(undefined);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);


    //pagination
    const [pagination, setPagination] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const [paginationUrl, setPaginationUrl] = useState([]);


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


    const toggleActive1 = useCallback(() => setActive((active) => !active), []);
    const [toggleLoadData1, setToggleLoadData1] = useState(true);

    const handlePaginationTabs = (active1, page) => {
        if (!active1) {
            setPagination(page);
            setToggleLoadData1(!toggleLoadData1);
        }
    };

  const [itemStrings, setItemStrings] = useState([
    "All",
    "Unfulfilled",
    "Partially Fulfilled",
    "Fulfilled",

  ]);

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };


    const handleClearButtonClick = () => {
        setShowSelect(false);
        setShowClearButton(false);
        getData();
    };
    const handleOrderFilter =async (value) =>  {
        setSelected(value)
        setLoading(true)

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/order-filter?status=${value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setOrders(response?.data?.orders)
            setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }


    const fetchProducts =async (filter_type,selectedValue) =>  {

        // setSelected(value)
        setLoading(true)

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/order-filter-payment?value=${selectedValue.value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setOrders(response?.data?.orders)
            setLoading(false)
            // setBtnLoading(false)
            // setToastMsg(response?.data?.message)
            // setSucessToast(true)


        } catch (error) {
            console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }




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
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    []
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );
  const handleQueryValueRemove = () => {
    setPageCursorValue("");
      getData()
    setQueryValue("");
    setToggleLoadData(true);
  };
  let timeoutId = null;

    const handleFiltersQueryChange = async (value)  => {

        setPageCursorValue('')
        setCustomersLoading(true)
        // setLoading(true)
        setQueryValue(value)

        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/search-order?value=${value}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            // setLoading(false)
            setOrders(response?.data?.data)
            setCustomersLoading(false)


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
    if (value == "next") {
      setPageCursorValue(nextPageCursor);
    } else {
      setPageCursorValue(previousPageCursor);
    }
    setPageCursor(value);
    setToggleLoadData(true);
  };

  // ---------------------Index Table Code Start Here----------------------

  const [modalReassign, setModalReassign] = useState(false);

  const resourceName = {
    singular: "Order",
    plural: "Orders",
  };

  const handleViewAction = (id) => {
    navigate(`/view-order/${id}`);
  };

  const handleDisableAction = useCallback(
    () => console.log("Exported action"),
    []
  );

  const handleViewinStoreAction = useCallback(
    () => console.log("View in Store action"),
    []
  );

  const handleSendMessageAction = useCallback(
    () => console.log("View in Send message action"),
    []
  );

  const handleReassignAction = (id) => {
    setUniqueId(id);
    setModalReassign(true);
  };


    const handleSelectChange = (selectedOption) => {
        const selectedValue =  selectedOption; // Access the value property of the selected option
        if (filterType === 'payment') {
            setSelectedStatus(selectedValue);
        }

        fetchProducts( filterType, selectedValue); // Pass the query, filter type, and selected value as arguments
    };
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showSelect, setShowSelect] = useState(false);
    const [showClearButton, setShowClearButton] = useState(false);

    const handleFilterClick = (type) => {
        setFilterType(type);
        setSelectedStatus('');
        setSelectedBrand('');
        setSelectedCategory('');
        setShowSelect(true);
        setShowClearButton(true);
    };

  const handleReassignCloseAction = () => {
    setUniqueId();
    setSellerEmail("");
    setModalReassign(false);
  };
  const handleDeleteAction = useCallback(
    () => console.log("View in delete action"),
    []
  );

  // ---------------------Tabs Code Start Here----------------------

  // const handleTabChange = (selectedTabIndex) => {
  //   if (selected != selectedTabIndex) {
  //     setSelected(selectedTabIndex);
  //     if (selectedTabIndex == 0) {
  //       setOrderStatus("");
  //     } else if (selectedTabIndex == 1) {
  //       setOrderStatus("unfulfilled");
  //     } else if (selectedTabIndex == 2) {
  //       setOrderStatus("unpaid");
  //     } else if (selectedTabIndex == 3) {
  //       setOrderStatus("open");
  //     } else if (selectedTabIndex == 4) {
  //       setOrderStatus("closed");
  //     }
  //     setPageCursorValue("");
  //     setToggleLoadData(true);
  //   }
  // };

    const handleTabChange = (selectedTabIndex) => {
        if (selected != selectedTabIndex) {
            setSelected(selectedTabIndex);
            if (selectedTabIndex == 0) {
                setOrderStatus("");
            } else if (selectedTabIndex == 1) {
                setOrderStatus("unfulfilled");
            } else if (selectedTabIndex == 2) {
                setOrderStatus("unpaid");
            } else if (selectedTabIndex == 3) {
                setOrderStatus("open");
            } else if (selectedTabIndex == 4) {
                setOrderStatus("closed");
            }
            setPageCursorValue("");
            setToggleLoadData(true);
        }
    };

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


  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,

  }));
  const allResourcesSelect = orders?.every(({ id }) =>
    selectedResources.includes(id)
  );

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

  const rowMarkup = orders?.map(
    (
      {
        id,
        order_id,
          order_number,
        user_name,
        created_at,
          financial_status,
          fulfillment_status,
        tracking_id,
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
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {order_number != null ? order_number : "---"}
          </Text>
        </IndexTable.Cell>

        {/*<IndexTable.Cell className="Capitalize-Cell">*/}
        {/*  {user_name != null ? user_name : "---"}*/}
        {/*</IndexTable.Cell>*/}

          <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>

        <IndexTable.Cell>
          <CustomBadge value={financial_status=="paid" ? 'PAID' : financial_status} type="orders" variant={"financial"} />
        </IndexTable.Cell>

          {fulfillment_status === 'fulfilled' ? (
          <IndexTable.Cell className="fulfilled">
              {/*<CustomBadge value={fulfillment_status=='' ? 'UNFULFILLED' : fulfillment_status} type="orders" variant={"fulfillment"} />*/}
              <Badge progress='complete'>{fulfillment_status === 'fulfilled' ? 'Fulfilled' : ''}</Badge>


          </IndexTable.Cell>
          ) : fulfillment_status === 'partial' ? (
              <IndexTable.Cell className="partial">
                  <Badge progress='complete'>{fulfillment_status === 'partial' ? 'Partially fulfilled' : ''}</Badge>
              </IndexTable.Cell>
          ) : (
              <IndexTable.Cell className="unfulfilled">
                  <Badge progress='complete'>{fulfillment_status==null ? 'Unfulfilled' : fulfillment_status}</Badge>

              </IndexTable.Cell>
          )}

        {/*<IndexTable.Cell>*/}
        {/*  {tracking_id != null ? tracking_id : "N/A"}*/}
        {/*</IndexTable.Cell>*/}

        {/*<IndexTable.Cell>*/}
        {/*  <Popover*/}
        {/*    active={active[id]}*/}
        {/*    activator={*/}
        {/*      <Button onClick={() => toggleActive(id)} plain>*/}
        {/*        <Icon source={HorizontalDotsMinor}></Icon>*/}
        {/*      </Button>*/}
        {/*    }*/}
        {/*    autofocusTarget="first-node"*/}
        {/*    onClose={() => setActive(false)}*/}
        {/*  >*/}
        {/*    <ActionList*/}
        {/*      actionRole="menuitem"*/}
        {/*      items={[*/}
        {/*        {*/}
        {/*          content: "View",*/}
        {/*          onAction: () => handleViewAction(id),*/}
        {/*        },*/}
        {/*        // {*/}
        {/*        //   content: "Sync with your Store",*/}
        {/*        //   onAction: handleViewinStoreAction,*/}
        {/*        // },*/}
        {/*      ]}*/}
        {/*    />*/}
        {/*  </Popover>*/}
        {/*</IndexTable.Cell>*/}


          <IndexTable.Cell>
              <Tooltip content="View Order">
                  <Button size="micro" onClick={() => handleViewAction(id)}>
                      <Icon source={ViewMajor}></Icon>
                  </Button>
              </Tooltip>
          </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Order Found"} withIllustration />
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


  // ---------------------Api Code starts Here----------------------

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

  useEffect(() => {
    if (toggleLoadData) {
      // getCustomers()
    }
    // setLoading(false);
    setCustomersLoading(false);
  }, [toggleLoadData]);

  const handleSellerEmail = (e) => {
    setSellerEmail(e.target.value);
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
    //  {
    //    key: "moneySpent",
    //    label: "Money spent",
    //    filter: (
    //      <RangeSlider
    //        label="Money spent is between"
    //        labelHidden
    //        value={moneySpent || [0, 500]}
    //        prefix="$"
    //        output
    //        min={0}
    //        max={2000}
    //        step={1}
    //        onChange={handleMoneySpentChange}
    //      />
    //    ),
    //  },
  ];


    const handleExportOrder = async () => {
        setBtnLoading1(true)
        const sessionToken = getAccessToken();
        try {
            const response = await axios.get(`${apiUrl}/export-order`,
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
            setBtnLoading1(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            setBtnLoading1(false)
            setToastMsg('Export Failed')
            setErrorToast(true)
        }

    }


    const handleSyncOrder = async () => {
        setBtnLoading(true);
        setLoading(true)
        try {
            const response = await axios.get(
                `${apiUrl}/sync-orders`,
                {
                    headers: { Authorization: `Bearer ${getAccessToken()}` },
                }
            );
            getData()
            setBtnLoading(false);
            setLoading(false);
            setToastMsg(response?.data?.message)
            setSucessToast(true)

        } catch (error) {
            console.warn("get orders Api Error", error.response);
            setLoading(false);
            // setCustomersLoading(false)
            setToastMsg("Server Error");
            setToggleLoadData(false);
            setErrorToast(true);
            handleClearStates();
        }
    };

    const getData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/orders?page=${pagination}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            console.log('dsds',response)
            setOrders(response?.data?.data)
            setPaginationUrl(response?.data?.links);
            if (
                response?.data?.total >
                response?.data?.per_page
            ) {
                setShowPagination(true);
            } else {
                setShowPagination(false);
            }
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

  return (
    <div className="Products-Page IndexTable-Page Orders-page">
      <Modal
        open={modalReassign}
        onClose={handleReassignCloseAction}
        title="Assign Product To Seller"
        loading={btnLoading[2]}
        primaryAction={{
          content: "Reassign",
          destructive: true,
          disabled: btnLoading[2],
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading[2],
            onAction: handleReassignCloseAction,
          },
        ]}
      >
        <Modal.Section>
          <InputField
            label="Seller Email *"
            type="text"
            name="seller_email"
            value={sellerEmail}
            onChange={handleSellerEmail}
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
          title="All Orders"
          primaryAction={{
            content: "Sync Order",
            onAction: handleSyncOrder,
              loading: btnLoading,
          }}
          secondaryActions={
            <ButtonGroup>
                <Button onClick={handleExportOrder} loading={btnLoading1}>Export </Button>

            </ButtonGroup>
          }
        >
          <Card>
            {/* <Tabs
              tabs={tabs}
              selected={selected}
              onSelect={handleTabChange}
              disclosureText="More views"
            > */}
            <div className="Polaris-Table">
              <Card.Section>
                  <div>
                      <Tabs
                          tabs={tabs}
                          selected={selected}
                          onSelect={handleOrderFilter}
                      ></Tabs>
                  </div>
              <div style={{ padding: "16px", display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      <TextField
                        placeholder="Search Order"
                        value={queryValue}
                        onChange={handleFiltersQueryChange}
                        clearButton
                        onClearButtonClick={handleQueryValueRemove}
                        autoComplete="off"
                        prefix={<Icon source={SearchMinor} />}
                      />
                    </div>

                  <div style={{ padding: '0px', display: 'flex' }}>
                      {showSelect ? (
                          <div style={{ flex: '1' }}>
                              {filterType === 'payment' ? (
                                  <div style={{ position: 'relative', width: 'auto', zIndex: 99999 }}>
                                      <ReactSelect
                                          name='pushed_status'
                                          options={[
                                              { value: 'all', label: 'All' },
                                              { value: 'paid', label: 'Paid' },
                                              { value: 'unpaid', label: 'Unpaid' },
                                          ]}
                                          placeholder="Select Payment Status"
                                          value={selectedStatus}
                                          onChange={(selectedOption) => handleSelectChange(selectedOption)}
                                          styles={{
                                              menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                          }}
                                      />
                                  </div>
                              )  : null}
                              {showClearButton && (
                                  <Button onClick={handleClearButtonClick} plain>
                                      Clear
                                  </Button>
                              )}
                          </div>
                      ) :null}
                      <div style={{ marginLeft: '10px' }}>
                          <Popover
                              active={active}
                              activator={
                                  <Button onClick={toggleActive1} disclosure>
                                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" style={{ fill: '#303236' }}>
                                          <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                                      </svg>
                                  </Button>
                              }
                              onClose={toggleActive1}
                          >
                              <ActionList
                                  actionRole="menuitem"
                                  items={[
                                      {
                                          content: 'Payment Status',
                                          helpText: 'Filter By Payment Status',
                                          onAction: () => handleFilterClick('payment'),
                                      },

                                  ]}
                              />
                          </Popover>
                      </div>
                  </div>
                  </div>

                {/*<IndexFilters*/}
                {/*  sortOptions={sortOptions}*/}
                {/*  sortSelected={sortSelected}*/}
                {/*  queryValue={queryValue}*/}
                {/*  queryPlaceholder="Searching in all"*/}
                {/*  onQueryChange={handleFiltersQueryChange}*/}
                {/*  onQueryClear={() => {}}*/}
                {/*  onSort={setSortSelected}*/}
                {/*  primaryAction={primaryAction}*/}
                {/*  cancelAction={{*/}
                {/*    onAction: () => {},*/}
                {/*    disabled: false,*/}
                {/*    loading: false,*/}
                {/*  }}*/}
                {/*  tabs={tabs}*/}
                {/*  selected={selected}*/}
                {/*  onSelect={handleOrderFilter}*/}
                {/*  canCreateNewView*/}
                {/*  onCreateNewView={onCreateNewView}*/}
                {/*  filters={filters}*/}
                {/*  appliedFilters={appliedFilters}*/}
                {/*  onClearAll={handleFiltersClearAll}*/}
                {/*  mode={mode}*/}
                {/*  setMode={setMode}*/}
                {/*/>*/}

                <IndexTable
                  resourceName={resourceName}
                  itemCount={orders?.length}
                  hasMoreItems
                  selectable={false}
                  selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  loading={customersLoading}
                  emptyState={emptyStateMarkup}
                  headings={[
                    { title: "Order Id" },
                    { title: "Store Order Num" },
                    // { title: "Seller" },
                    { title: "Date" },
                    { title: "Payment Status" },
                    { title: "Order Status" },
                    // { title: "Tracking Id" },
                    { title: "Action" },
                  ]}
                  // bulkActions={bulkActions}
                >
                  {rowMarkup}
                </IndexTable>
              </Card.Section>
                {showPagination && (
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
                        hasPrevious={pagination > 1}
                        onPrevious={() => handlePaginationTabs(false, pagination - 1)}
                        hasNext={pagination < paginationUrl.length}
                        onNext={() => handlePaginationTabs(false, pagination + 1)}
                    />
                </div>
              </Card.Section>
                )}
            </div>
            {/* </Tabs> */}
          </Card>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}

function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
}
