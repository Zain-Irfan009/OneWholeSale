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
} from "@shopify/polaris-icons";
import { AppContext } from "../components/providers/ContextProvider";
import { SkeltonPageForTable } from "../components/global/SkeltonPage";
import { CustomBadge } from "../components/Utils/CustomBadge";
// import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/Utils";
// import dateFormat from "dateformat";

let data = [
  {
    id: 1,
    order_id: "3232332",
    store_order_id: "W31411CA",
    seller: "Sagar Patel",
    payment_mode: "Interac E-Transfer",
    payment_status: "Paid",
    order_status: "Unfulfilled",
    tracking_id: "N/A",
  },
  {
    id: 2,
    order_id: "3232332",
    store_order_id: "W31411CA",
    seller: "Sagar Patel",
    payment_mode: "Interac E-Transfer",
    payment_status: "Paid",
    order_status: "Unfulfilled",
    tracking_id: "N/A",
  },
  {
    id: 3,
    order_id: "3232332",
    store_order_id: "W31411CA",
    seller: "Sagar Patel",
    payment_mode: "Interac E-Transfer",
    payment_status: "Paid",
    order_status: "Unfulfilled",
    tracking_id: "N/A",
  },
];

export default function Demo() {
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

  const [customers, setCustomers] = useState(data);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageCursor, setPageCursor] = useState("next");
  const [pageCursorValue, setPageCursorValue] = useState("");
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [previousPageCursor, setPreviousPageCursor] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [sellerEmail, setSellerEmail] = useState("");
  const [uniqueId, setUniqueId] = useState();
  const [moneySpent, setMoneySpent] = useState(undefined);
  const [taggedWith, setTaggedWith] = useState("");
  const { mode, setMode } = useSetIndexFiltersMode();
  const [accountStatus, setAccountStatus] = useState(undefined);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

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

  const [itemStrings, setItemStrings] = useState([
    "All",
    "Approved",
    "Disapproved",
    "Pending ",
    "Approval",
    "Disable",
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
    setQueryValue("");
    setToggleLoadData(true);
  };
  let timeoutId = null;
  const handleFiltersQueryChange = (value) => {
    clearTimeout(timeoutId);
    setPageCursorValue("");
    setQueryValue(value);
    timeoutId = setTimeout(() => {
      let newCustomers = data.filter((customer) =>
        customer.order_id.includes(value)
      );
      setCustomers(newCustomers);
      // setToggleLoadData(true);
    }, 1000);
  };

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
    singular: "Customer",
    plural: "Customers",
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

  // const tabs = [
  //   {
  //     id: "all-orders",
  //     content: "All",
  //     accessibilityLabel: "All orders",
  //     panelID: "all-orders-content",
  //   },
  //   {
  //     id: "active-orders",
  //     content: "Unfulfilled",
  //     panelID: "active-orders-content",
  //   },
  //   {
  //     id: "draft-orders",
  //     content: "Unpaid",
  //     panelID: "draft-orders-content",
  //   },
  //   {
  //     id: "open-orders",
  //     content: "Open",
  //     panelID: "open-orders-content",
  //   },
  //   {
  //     id: "closed-orders",
  //     content: "Closed",
  //     panelID: "closed-orders-content",
  //   },
  // ];
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    // actions:
    //   index === 0
    //     ? []
    //     : [
    //         {
    //           type: "rename",
    //           onAction: () => {},
    //           onPrimaryAction: async (value) => {
    //             const newItemsStrings = tabs.map((item, idx) => {
    //               if (idx === index) {
    //                 return value;
    //               }
    //               return item.content;
    //             });
    //             await sleep(1);
    //             setItemStrings(newItemsStrings);
    //             return true;
    //           },
    //         },
    //         {
    //           type: "duplicate",
    //           onPrimaryAction: async (value) => {
    //             await sleep(1);
    //             duplicateView(value);
    //             return true;
    //           },
    //         },
    //         {
    //           type: "edit",
    //         },
    //         {
    //           type: "delete",
    //           onPrimaryAction: async () => {
    //             await sleep(1);
    //             deleteView(index);
    //             return true;
    //           },
    //         },
    //       ],
  }));
  const allResourcesSelect = customers.every(({ id }) =>
    selectedResources.includes(id)
  );

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

  const rowMarkup = customers?.map(
    (
      {
        id,
        order_id,
        store_order_id,
        seller,
        payment_mode,
        payment_status,
        order_status,
        tracking_id,
      },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {order_id != null ? order_id : "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {store_order_id != null ? store_order_id : "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell className="Capitalize-Cell">
          {seller != null ? seller : "---"}
        </IndexTable.Cell>

        <IndexTable.Cell>
          {payment_mode != null ? payment_mode : "---"}
        </IndexTable.Cell>

        <IndexTable.Cell>
          <CustomBadge value={"PAID"} type="orders" variant={"financial"} />
        </IndexTable.Cell>

        <IndexTable.Cell>
          <CustomBadge
            value={"UNFULFILLED"}
            variant={"fulfillment"}
            type="orders"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          {tracking_id != null ? tracking_id : "---"}
        </IndexTable.Cell>

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
                  content: "View",
                  onAction: () => handleViewAction(id),
                },
                {
                  content: "Sync with your Store",
                  onAction: handleViewinStoreAction,
                },
              ]}
            />
          </Popover>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Customers Found"} withIllustration />
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
    setLoading(false);
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
            onAction: handleAddProduct,
          }}
          secondaryActions={
            <ButtonGroup>
              <a href="#">
                <Button>Export </Button>
              </a>
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
                {/* <div style={{ padding: "16px", display: "flex" }}>
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
                  </div> */}

                <IndexFilters
                  sortOptions={sortOptions}
                  sortSelected={sortSelected}
                  queryValue={queryValue}
                  queryPlaceholder="Searching in all"
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={() => {}}
                  onSort={setSortSelected}
                  primaryAction={primaryAction}
                  cancelAction={{
                    onAction: () => {},
                    disabled: false,
                    loading: false,
                  }}
                  tabs={tabs}
                  selected={selected}
                  onSelect={setSelected}
                  canCreateNewView
                  onCreateNewView={onCreateNewView}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onClearAll={handleFiltersClearAll}
                  mode={mode}
                  setMode={setMode}
                />

                <IndexTable
                  resourceName={resourceName}
                  itemCount={customers.length}
                  hasMoreItems
                  selectable={true}
                  selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  loading={customersLoading}
                  emptyState={emptyStateMarkup}
                  headings={[
                    { title: "Order Id" },
                    { title: "Store Order Id" },
                    { title: "Seller" },
                    { title: "Payment Mode" },
                    { title: "Payment Status" },
                    { title: "Order Status" },
                    { title: "Tracking Id" },
                    { title: "Action" },
                  ]}
                  bulkActions={bulkActions}
                >
                  {rowMarkup}
                </IndexTable>
              </Card.Section>

              <Card.Section>
                <div className="data-table-pagination">
                  <Pagination
                    hasPrevious={hasPreviousPage ? true : false}
                    onPrevious={() => handlePagination("prev")}
                    hasNext={hasNextPage ? true : false}
                    onNext={() => handlePagination("next")}
                  />
                </div>
              </Card.Section>
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
