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
    product_id: "3232332",
    image:
      "https://cdn.shopify.com/s/files/1/0060/5582/1381/products/ihumolighterbestAMZ2Final.webp?v=1678989366",
    product_name: "iHumo | 2 in 1 Grinder & USB Lighter, 4 Parts (60mm)",
    seller: "seller1",
    type: "normal",
    price: "$13.00",
    quantity: "14 Pcs.",
    status: "Approved",
  },
  {
    id: 2,
    product_id: "3232332",
    image:
      "https://cdn.shopify.com/s/files/1/0060/5582/1381/products/ihumolighterbestAMZ2Final.webp?v=1678989366",
    product_name: "iHumo | 2 in 1 Grinder & USB Lighter, 4 Parts (60mm)",
    seller: "seller1",
    type: "normal",
    price: "$13.00",
    quantity: "14 Pcs.",
    status: "Approved",
  },
  {
    id: 3,
    product_id: "3232332",
    image:
      "https://cdn.shopify.com/s/files/1/0060/5582/1381/products/ihumolighterbestAMZ2Final.webp?v=1678989366",
    product_name: "iHumo | 2 in 1 Grinder & USB Lighter, 4 Parts (60mm)",
    seller: "seller1",
    type: "normal",
    price: "$13.00",
    quantity: "14 Pcs.",
    status: "Approved",
  },
];

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
    setQueryValue("");
    setToggleLoadData(true);
  };
  const handleFiltersQueryChange = (value) => {
    setPageCursorValue("");
    setQueryValue(value);
    setTimeout(() => {
      setToggleLoadData(true);
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

  const handleEditAction = (id) => {
    navigate(`/edit-product/${id}`);
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

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

  // ---------------------Tabs Code Start Here----------------------

  const handleTabChange = (selectedTabIndex) => {
    if (selected != selectedTabIndex) {
      setSelected(selectedTabIndex);
      if (selectedTabIndex == 0) {
        setProductStatus("");
      } else if (selectedTabIndex == 1) {
        setProductStatus("ACTIVE");
      } else if (selectedTabIndex == 2) {
        setProductStatus("DRAFT");
      } else if (selectedTabIndex == 3) {
        setProductStatus("ARCHIVED");
      }
      setPageCursorValue("");
      setToggleLoadData(true);
    }
  };

  const tabs = [
    {
      id: "all-products",
      content: "All",
      accessibilityLabel: "All products",
      panelID: "all-products-content",
    },
    {
      id: "active-products",
      content: "Active",
      panelID: "active-products-content",
    },
    {
      id: "draft-products",
      content: "Draft",
      panelID: "draft-products-content",
    },
    {
      id: "archived-products",
      content: "Archived",
      panelID: "archived-products-content",
    },
  ];

  const rowMarkup = customers?.map(
    (
      {
        id,
        product_id,
        image,
        product_name,
        seller,
        type,
        price,
        quantity,
        status,
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
            {product_id != null ? product_id : "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Avatar size="small" shape="square" name="title" source={image} />
        </IndexTable.Cell>

        <IndexTable.Cell className="Capitalize-Cell">
          {product_name != null ? product_name : "---"}
        </IndexTable.Cell>

        <IndexTable.Cell>{seller != null ? seller : "---"}</IndexTable.Cell>

        <IndexTable.Cell>
          <CustomBadge value={"NORMAL"} type="products" />
        </IndexTable.Cell>

        <IndexTable.Cell>{price != null ? price : "---"}</IndexTable.Cell>
        <IndexTable.Cell>{quantity != null ? quantity : "---"}</IndexTable.Cell>
        <IndexTable.Cell>
          <CustomBadge value={"APPROVED"} type="products" />
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
                  content: "Edit",
                  onAction: () => handleEditAction(id),
                },
                {
                  content: "View in Store",
                  onAction: handleViewinStoreAction,
                },
                {
                  content: "Reassign",
                  onAction: () => handleReassignAction(id),
                },
                {
                  content: "Disable",
                  onAction: handleDisableAction,
                },

                {
                  content: "Delete",
                  onAction: handleDeleteAction,
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
          title="All Products"
          primaryAction={{
            content: "Add Product",
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
            <Tabs
              tabs={tabs}
              selected={selected}
              onSelect={handleTabChange}
              disclosureText="More views"
            >
              <div className="Polaris-Table">
                <Card.Section>
                  <div style={{ padding: "16px", display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      <TextField
                        placeholder="Search Product"
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
            </Tabs>
          </Card>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
