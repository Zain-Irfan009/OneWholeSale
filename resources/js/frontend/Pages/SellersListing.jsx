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
  Select,
  Checkbox,
  useSetIndexFiltersMode,
  ChoiceList,
  RangeSlider,
  IndexFilters,
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
// import dateFormat from "dateformat";

export function SellersListing() {
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

  const [customers, setCustomers] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageCursor, setPageCursor] = useState("next");
  const [pageCursorValue, setPageCursorValue] = useState("");
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [previousPageCursor, setPreviousPageCursor] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

    const [sellerId, setSellerId] = useState("");

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
    const [enableModal, setEnableModal] = useState(false);
  const [deleteSellerModal, setDeleteSellerModal] = useState(false);
  const [checked, setChecked] = useState(false);

    const [formErrors, setFormErrors] = useState({});
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  const deleteSellerModalHandler = (id) => {
      setUniqueId(id)
    setDeleteSellerModal(true);
  };

  const deleteModalCloseHandler = () => {
    setDeleteSellerModal(false);
  };

  const handleSelectChange2 = useCallback((value) => setSelected2(value), []);

  const options = [
    { label: "New", value: "new" },
    { label: "Old", value: "old" },
  ];

  const handleSellerFilter =async (value) =>  {
      setSelected(value)
      const sessionToken = getAccessToken();
      try {

          const response = await axios.get(`${apiUrl}/sellers-filter?status=${value}`,
              {
                  headers: {
                      Authorization: "Bearer " + sessionToken
                  }
              })
          console.log('3',response?.data?.seller)
          console.log('443',response?.data)
              setCustomers(response?.data?.seller)

          // setBtnLoading(false)
          // setToastMsg(response?.data?.message)
          // setSucessToast(true)


      } catch (error) {

          setToastMsg(error?.response?.data?.message)
          setErrorToast(true)
      }
  }


    const getData = async () => {

        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/sellers`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setCustomers(response?.data)

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
    }, []);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const handleSendMessageCloseAction = () => {
    setUniqueId();
    setSellerMessage("");
    setModalReassign(false);
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

  let timeoutId = null;
  const handleFiltersQueryChange = (value) => {
    clearTimeout(timeoutId);
    setPageCursorValue("");
    setQueryValue(value);
    timeoutId = setTimeout(() => {
      let newCustomers = data.filter((customer) =>
        customer.seller_id.includes(value)
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

  const resourceName = {
    singular: "Customer",
    plural: "Customers",
  };

  const handleEditAction = (id) => {
    navigate(`/edit-seller/${id}`);
  };

  // const handleDisableAction = useCallback(() => setDisableModal(true), []);

    const handleDisableAction = (id) => {
        setDisableModal(true);
        setSellerId(id)


    };

    const handleEnableAction = (id) => {
        setEnableModal(true);
        setSellerId(id)


    };


    const updateEnableStatus=async () => {

        setBtnLoading(true)
        const sessionToken = getAccessToken();

        try {
            const response = await axios.get(`${apiUrl}/update-seller-status?id=${sellerId}&status=0`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setDisableModal(false);
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setBtnLoading(false)
            getData()


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }
    }
    const updateDisableStatus=async () => {
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        try {
            const response = await axios.get(`${apiUrl}/update-seller-status?id=${sellerId}&status=1`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setEnableModal(false);

            // setBtnLoading(false)
            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            getData()

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }
    }
  const handleViewinStoreAction = useCallback(
    () => console.log("View in Store action"),
    []
  );

  const handleSendMessageAction = (id) => {
      setModalReassign(true);
    setUniqueId(id);
      setSellerId(id)

  };

  const handleChangePasswordAction = (id) => {
      setModalChangePassword(true);
      setUniqueId(id);
  };

  const handleDeleteSellerAction = useCallback(
    () => console.log("View in delete action"),
    []
  );

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

  useEffect(() => {
    console.log(selectedResources, "eqeeeqeqeq");
  }, [selectedResources]);

  const allResourcesSelect = customers?.every(({ id }) =>
    selectedResources.includes(id)
  );

  const bulkActions = [
    {
      content: selectedResources.length > 0 && "Disable",
      onAction: () => {
        const newSelection = selectedResources.filter(
          (id) => !customers?.find((customer) => customer.id === id)
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

  const formatDate=(created_at)=>{
      const date = new Date(created_at);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formatedDate = `${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}-${year}`;
      return formatedDate;
  }

  const rowMarkup =customers ?  customers?.map(
      ({ id, seller_id, name, seller_shopname, email, created_at, status }, index) => (

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

              <IndexTable.Cell>{name != null ? name : "---"}</IndexTable.Cell>

              <IndexTable.Cell className="Capitalize-Cell">
                  {seller_shopname != null ? seller_shopname : "---"}
              </IndexTable.Cell>

              <IndexTable.Cell>{email != null ? email : "---"}</IndexTable.Cell>

              <IndexTable.Cell>{created_at != null ? formatDate(created_at) : "---"}</IndexTable.Cell>
              <IndexTable.Cell>
                  <CustomBadge value={status==1 ?"ACTIVE" : "Disabled"} type="products" />

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
                                  content: status==1 ?"Disable" : "Enable",
                                  onAction: () => status==1 ? handleDisableAction(id) : handleEnableAction(id) ,
                              },
                              {
                                  content: "View in Store",
                                  onAction: handleViewinStoreAction,
                              },
                              {
                                  content: "Send Message",
                                  onAction: () => handleSendMessageAction(id),
                              },
                              {
                                  content: "Change Password",
                                  onAction: () => handleChangePasswordAction(id),
                              },
                              {
                                  content: "Delete Seller",
                                  onAction: () =>deleteSellerModalHandler(id),
                              },
                          ]}
                      />
                  </Popover>
              </IndexTable.Cell>
          </IndexTable.Row>
      )
  ) : <EmptySearchResult title={"No Seller Found"} withIllustration />

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Seller Found"} withIllustration />
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

  const handleAddSeller = () => {
    navigate("/add-seller");
  };


  // const submitStatus = async (id) => {
  //
  // console.log('dssd',id)
  // }



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
    "Active",
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
    setDisableModal(false)
      setEnableModal(false)
  };

  useEffect(() => {
    if (toggleLoadData) {
      // getCustomers()
    }
    setLoading(false);
    setCustomersLoading(false);
  }, [toggleLoadData]);


    const sendMessage = async () => {
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        const errors = {};

        if (sellerMessage.trim() === '') {
            errors.sellerMessage = 'Message is required';
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setBtnLoading(false)
            return;
        }

        let data = {
            message: sellerMessage,
            id:sellerId
        }

        try {
            const response = await axios.post(`${apiUrl}/send-message`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setBtnLoading(false)
            setToastMsg('Message Send Successfully')
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            setBtnLoading(false)
            setToastMsg('Message Failed')
            setErrorToast(true)
        }

    }

    const changePassword = async () => {
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        const errors = {};

        if (password.trim() === '') {
            errors.password = 'Password is required';
        }

        if (confirmPassword.trim() === '') {
            errors.confirmPassword = 'Confirm Password is required';
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setBtnLoading(false)
            return;
        }

        let data = {
            password: password,
            password_confirmation:confirmPassword,
            id:uniqueId
        }

        try {
            const response = await axios.post(`${apiUrl}/change-password`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }

    }


    const deleteSeller  = async () => {

        setBtnLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.delete(`${apiUrl}/delete-seller?id=${uniqueId}&delete_product=${checked}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getData();
            setDeleteSellerModal(false);
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setBtnLoading(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }

    }

  return (
    <div className="Products-Page IndexTable-Page Orders-page">
      <Modal
        open={modalReassign}
        onClose={handleSendMessageCloseAction}
        title="Send Message to Seller"
        loading={btnLoading}
        primaryAction={{
          content: "Send",
          destructive: true,
          disabled: btnLoading,
            onAction: sendMessage,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading[2],
            onAction: handleSendMessageCloseAction,
          },
        ]}
      >
        <Modal.Section>
          <InputField
            multiline={1}
            placeholder="Enter Message for Seller"
            type="text"
            name="seller_message"
            value={sellerMessage}
            onChange={(e) => setSellerMessage(e.target.value)}
            error={formErrors.sellerMessage}


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
            onAction: deleteSeller,
            loading: btnLoading,
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
        title="Update Seller Status"
        primaryAction={{
          content: "Disable",
          destructive: true,
            loading: btnLoading,
            onAction:updateEnableStatus,
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
            open={enableModal}
            onClose={closeDisableModal}
            title="Update Seller Status"
            primaryAction={{
                content: "Enable",
                disabled: btnLoading[2],
                loading: btnLoading,
                onAction:updateDisableStatus,
            }}
            secondaryActions={[
                {
                    content: "Cancel",
                    onAction: closeDisableModal,
                },
            ]}
        >
            <Modal.Section>
                <Text>Are You sure you want to Enable ?</Text>
            </Modal.Section>
        </Modal>

      <Modal
        open={modalChangePassword}
        onClose={handleChangePasswordCloseAction}
        title="Reset Password For Seller"
        loading={btnLoading}
        primaryAction={{
          content: "Change",
          destructive: true,
          disabled: btnLoading,
            onAction:changePassword,

        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading,
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
            onChange={(e) =>setPassword(e.target.value)}
            error={formErrors.password}

          />

          <InputField
            marginTop
            label="Confirm Password*"
            placeholder="Enter Password again"
            type="password"
            name="confirm_password"
            value={confirmPassword}
            onChange={(e) =>setConfirmPassword(e.target.value)}
            error={formErrors.confirmPassword}
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
          title="Sellers"
          primaryAction={{
            content: "Add Seller",
            onAction: handleAddSeller,
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
            <div className="Polaris-Table">
              <Card.Section fullWidth subdued hasPaddingTop={false}>
                {/* <div>
                  <Tabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={handleTabChange}
                  ></Tabs>
                </div>
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ width: "50%", padding: "0 10px" }}>
                      <Select
                        options={options}
                        onChange={handleSelectChange2}
                        value={selected2}
                      />
                    </div>
                    <div style={{ width: "50%", padding: "0 10px" }}>
                      <TextField
                        placeholder="Search Seller"
                        value={queryValue}
                        onChange={handleFiltersQueryChange}
                        clearButton
                        onClearButtonClick={handleQueryValueRemove}
                        autoComplete="off"
                        prefix={<Icon source={SearchMinor} />}
                      />
                    </div>
                  </div>
                </div> */}

                <IndexFilters
                  // sortOptions={sortOptions}
                  // sortSelected={sortSelected}
                  // queryValue={queryValue}
                  // queryPlaceholder="Searching in all"
                  // onQueryChange={handleFiltersQueryChange}
                  // onQueryClear={() => {}}
                  onSort={setSortSelected}
                  primaryAction={primaryAction}
                  cancelAction={{
                    onAction: () => {},
                    disabled: false,
                    loading: false,
                  }}
                  tabs={tabs}
                  selected={selected}
                  onSelect={handleSellerFilter}
                  canCreateNewView
                  onCreateNewView={onCreateNewView}
                  filters={filters}
                  // appliedFilters={appliedFilters}
                  // onClearAll={handleFiltersClearAll}
                  mode={mode}
                  // setMode={setMode}
                />
                <IndexTable
                  resourceName={resourceName}
                  itemCount={customers?.length}
                  hasMoreItems
                  selectable={true}
                  selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  loading={customersLoading}
                  emptyState={emptyStateMarkup}
                  headings={[
                    { title: "Seller ID" },
                    { title: "Seller Name" },
                    { title: "Store Name" },
                    { title: "Email" },
                    { title: "Date" },
                    { title: "Status" },
                    { title: "Action" },
                  ]}
                  bulkActions={bulkActions}
                >
                  {rowMarkup}
                </IndexTable>
              </Card.Section>

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
        return value.map((val) => `Customer ${val}`).join(", ");
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
