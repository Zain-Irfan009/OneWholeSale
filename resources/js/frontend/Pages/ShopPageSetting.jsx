import React, { useState, useCallback, useEffect, useContext } from "react";
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
    SkeletonPage,
    SkeletonBodyText,
  Icon,
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

// import { useAuthState } from '../../components/providers/AuthProvider'
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import dateFormat from "dateformat";

import EmptyCheckBox from "../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../assets/icons/FillCheckBox.png";
import {getAccessToken} from "../assets/cookies";

export function ShopPageSetting() {
  const { apiUrl } = useContext(AppContext);
  // const { user } = useAuthState();
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [resetBtnLoading, setResetBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discountError, setDiscountError] = useState();
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [discardModal, setDiscardModal] = useState(false);
  const [storeDescriptioncontent, setStoreDescriptionContent] = useState("");
  const [sellerDescriptioncontent, setSellerDescriptionContent] = useState("");
  const [sellerPolicycontent, setSellerPolicyContent] = useState("");

    const [skeleton, setSkeleton] = useState(false)

    const [soldByLabel, setSoldByLabel] = useState("");
    const [sellerNameLabel, setSellerNameLabel] = useState("");
    const [totalProductsLabel, setTotalProductsLabel] = useState("");
    const [totalSaleLabel, setTotalSaleLabel] = useState("");
    const [joinSinceLabel, setJoinSinceLabel] = useState("");
    const [contactLabel, setContactLabel] = useState("");
    const [sellerProductsLabel, setSellerProductsLabel] = useState("");
    const [allReviewsLabel, SetAllReviewsLabel] = useState("");
    const [feedbackLabel, SetFeedbackLabel] = useState("");
    const [policyLabel, SetPolicyLabel] = useState("");
    const [descriptionLabel, setDescriptionLabel] = useState("");
    const [searchLabel, setSearchLabel] = useState("");
    const [notAvailableLabel, setNotAvailableLabel] = useState("");
    const [sortbyLabel, setSortbyLabel] = useState("");
    const [nameAscendingLabel, setNameAscendingLabel] = useState("");
    const [nameDecendingLabel, setNameDecendingLabel] = useState("");
    const [dateAscendingLabel, setDateAscendingLabel] = useState("");
    const [datedecendingLabel, setDateDecendingLabel] = useState("");
    const [priceAscendingLabel, setPriceAscendingLabel] = useState("");
    const [pricedecendingLabel, setPriceDecendingLabel] = useState("");
    const [showLabel, setShowLabel] = useState("");
    const [onlyStorePickupLabel, setOnlyStorePickupLabel] = useState("");
    const [pickupAndDeliveryLabel, setPickupAndDeliveryLabel] = useState("");
    const [closedStoreLabel, setClosedStoreLabel] = useState("");
    const [openStoreLabel, setOpenStoreLabel] = useState("");
    const [ratingLabel, setRatingLabel] = useState("");
    const [nameLabel, setNameLabel] = useState("");
    const [submitLabel, setSubmitLabel] = useState("");
    const [viewAllLabel, setViewAllLabel] = useState("");
    const [feedbackSubmittedLabel, setFeedbackSubmittedLabel] = useState("");
    const [categoryLabel, setCategoryLabel] = useState("");
    const [typeLabel, setTypeLabel] = useState("");
    const [tagLabel, setTagLabel] = useState("");



  // =================Products Modal Code Start Here================
  const [productsLoading, setProductsLoading] = useState(false);


  const [productsModal, setProductsModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});

  const handleProductTabChange = useCallback(
    (selectedTabIndex) => setProductTab(selectedTabIndex),
    []
  );

  const productModalTabs = [
    {
      id: "all-products",
      content: "All products",
    },
    {
      id: "selected-products",
      content: "Selected products",
    },
  ];

  const handleSelectProductsModal = () => {
    setProductsModal(true);
  };

  const handleProductsCancelModal = () => {
    setProductsModal(false);
    setCheckedVariants(previousCheckedVariants);
  };

  const [discount, setDiscount] = useState({
      sold_by_label: "",
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
    navigate("/sellerslisting");
  };
  const handleProductsSaveModal = () => {
    setProductsModal(false);
    setPreviousCheckedVariants(checkedVariants);
  };





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




    const getShopSettingData = async () => {

        setSkeleton(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/shop-setting`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setSoldByLabel(response?.data?.sold_by_label)
            setSellerNameLabel(response?.data?.seller_name_label)
            setTotalProductsLabel(response?.data?.total_products_label)
            setTotalSaleLabel(response?.data?.total_sale_label)
            setJoinSinceLabel(response?.data?.join_since_label)
            setContactLabel(response?.data?.contact_label)
            setSellerProductsLabel(response?.data?.seller_products_label)
            SetAllReviewsLabel(response?.data?.all_review_label)
            SetFeedbackLabel(response?.data?.feedback_label)
            SetPolicyLabel(response?.data?.policy_label)
            setDescriptionLabel(response?.data?.description_label)
            setSearchLabel(response?.data?.search_label)
            setNotAvailableLabel(response?.data?.not_available_label)
            setSortbyLabel(response?.data?.sort_by_label)
            setNameAscendingLabel(response?.data?.name_ascending_label)
            setNameDecendingLabel(response?.data?.name_decending_label)
            setDateAscendingLabel(response?.data?.date_ascending_label)
            setDateDecendingLabel(response?.data?.date_decending_label)
            setPriceAscendingLabel(response?.data?.price_ascending_label)
            setPriceDecendingLabel(response?.data?.price_decending_label)
            setShowLabel(response?.data?.show_label)
            setOnlyStorePickupLabel(response?.data?.only_store_pickup_label)
            setPickupAndDeliveryLabel(response?.data?.store_pickup_deliivery_label)
            setClosedStoreLabel(response?.data?.closed_store_label)
            setOpenStoreLabel(response?.data?.open_store_label)
            setRatingLabel(response?.data?.rating_label)
            setNameLabel(response?.data?.name_label)
            setSubmitLabel(response?.data?.sumbit_label)
            setViewAllLabel(response?.data?.view_all_label)
            setFeedbackSubmittedLabel(response?.data?.feedback_submitted_approval_label)
            setCategoryLabel(response?.data?.category_label)
            setTypeLabel(response?.data?.type_label)
            setTagLabel(response?.data?.tag_label)
            setSkeleton(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    useEffect(() => {
        getShopSettingData();
    }, []);



      const handleCreateDiscount = async () => {
          setBtnLoading(true)
          const sessionToken = getAccessToken();
          const errors = {};

          if (soldByLabel.trim() === '') {
              errors.soldByLabel = 'Sold By Label is required';
          }

          if (sellerNameLabel.trim() === '') {
              errors.sellerNameLabel = 'Seller Name Label is required';
          }

          if (totalProductsLabel.trim() === '') {
              errors.totalProductsLabel = 'Total Products Label is required';
          }

          if (totalSaleLabel.trim() === '') {
              errors.totalSaleLabel = 'Total Sale Label is required';
          }

          if (joinSinceLabel.trim() === '') {
              errors.joinSinceLabel = 'Join Since Label is required';
          }

          if (contactLabel.trim() === '') {
              errors.contactLabel = 'Contact Label is required';
          }

          if (sellerProductsLabel.trim() === '') {
              errors.sellerProductsLabel = 'Seller Product Label is required';
          }
          if (allReviewsLabel.trim() === '') {
              errors.allReviewsLabel = 'All Reviews Label is required';
          }
          if (feedbackLabel.trim() === '') {
              errors.feedbackLabel = 'Feedback Label is required';
          }
          if (policyLabel.trim() === '') {
              errors.policyLabel = 'Policy Label is required';
          }
          if (descriptionLabel.trim() === '') {
              errors.descriptionLabel = 'Description Label is required';
          }
          if (searchLabel.trim() === '') {
              errors.searchLabel = 'Search Label is required';
          }
          if (notAvailableLabel.trim() === '') {
              errors.notAvailableLabel = 'Not Available Label is required';
          }
          if (sortbyLabel.trim() === '') {
              errors.sortbyLabel = 'Sort By Label is required';
          }
          if (nameAscendingLabel.trim() === '') {
              errors.nameAscendingLabel = 'Name Ascending Label is required';
          }
          if (nameDecendingLabel.trim() === '') {
              errors.nameDecendingLabel = 'Name Decending Label is required';
          }
          if (dateAscendingLabel.trim() === '') {
              errors.dateAscendingLabel = 'Date Ascending Label is required';
          }
          if (datedecendingLabel.trim() === '') {
              errors.datedecendingLabel = 'Date Decending Label is required';
          }
          if (priceAscendingLabel.trim() === '') {
              errors.priceAscendingLabel = 'Price Ascending Label is required';
          }
          if (pricedecendingLabel.trim() === '') {
              errors.pricedecendingLabel = 'Price Decending Label is required';
          }
          if (showLabel.trim() === '') {
              errors.showLabel = 'Show Label is required';
          }
          if (onlyStorePickupLabel.trim() === '') {
              errors.onlyStorePickupLabel = 'Only Store Pick-up Label is required';
          }
          if (pickupAndDeliveryLabel.trim() === '') {
              errors.pickupAndDeliveryLabel = 'Pick-up and Delivery Label is required';
          }
          if (closedStoreLabel.trim() === '') {
              errors.closedStoreLabel = 'Closed Store Label is required';
          }
          if (openStoreLabel.trim() === '') {
              errors.openStoreLabel = 'Open Store Label is required';
          }
          if (ratingLabel.trim() === '') {
              errors.ratingLabel = 'Rating Label is required';
          }
          if (nameLabel.trim() === '') {
              errors.nameLabel = 'Name Label is required';
          }
          if (submitLabel.trim() === '') {
              errors.submitLabel = 'Submit Label is required';
          }
          if (viewAllLabel.trim() === '') {
              errors.viewAllLabel = 'View All Label is required';
          }
          if (feedbackSubmittedLabel.trim() === '') {
              errors.feedbackSubmittedLabel = 'Feedback Submitted Label is required';
          }
          if (categoryLabel.trim() === '') {
              errors.categoryLabel = 'Category Label is required';
          }
          if (typeLabel.trim() === '') {
              errors.typeLabel = 'Type Label is required';
          }
          if (tagLabel.trim() === '') {
              errors.tagLabel = 'Tag Label is required';
          }
          if (Object.keys(errors).length > 0) {
              setFormErrors(errors);
              setBtnLoading(false)
              return;
          }

          let data = {
              sold_by_label: soldByLabel,
              seller_name_label: sellerNameLabel,
              total_products_label: totalProductsLabel,
              total_sale_label: totalSaleLabel,
              join_since_label: joinSinceLabel,
              contact_label:contactLabel,
              seller_products_label:sellerProductsLabel,
              all_review_label:allReviewsLabel,
              feedback_label:feedbackLabel,
              policy_label:policyLabel,
              description_label:descriptionLabel,
              search_label:searchLabel,
              not_available_label:notAvailableLabel,
              sort_by_label:sortbyLabel,
              name_ascending_label:nameAscendingLabel,
              name_decending_label:nameDecendingLabel,
              date_ascending_label:dateAscendingLabel,
              date_decending_label:datedecendingLabel,
              price_ascending_label:priceAscendingLabel,
              price_decending_label:pricedecendingLabel,
              show_label:showLabel,
              only_store_pickup_label:onlyStorePickupLabel,
              store_pickup_deliivery_label:pickupAndDeliveryLabel,
              closed_store_label:closedStoreLabel,
              open_store_label:openStoreLabel,
              rating_label:ratingLabel,
              name_label:nameLabel,
              sumbit_label:submitLabel,
              view_all_label:viewAllLabel,
              feedback_submitted_approval_label:feedbackSubmittedLabel,
              category_label:categoryLabel,
              type_label:typeLabel,
              tag_label:tagLabel,

          }

          try {
              const response = await axios.post(`${apiUrl}/shop-setting-save`,data,
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
              setToastMsg('Message Failed')
              setErrorToast(true)
          }

      }


    const handleResetDefault = async () => {
        setResetBtnLoading(true)
        const sessionToken = getAccessToken();


        try {
            const response = await axios.get(`${apiUrl}/reset-default`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            getShopSettingData();
            setResetBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            // setSkeleton(false)

        } catch (error) {
            setResetBtnLoading(false)
            setToastMsg('Message Failed')
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


        <Page title="Shop Page Settings">


          <Form >
            <FormLayout>
              <Card sectioned title="PRODUCT PAGE LABELS">
                  {skeleton ? <SkeletonBodyText/> :
                     <> <Text variant="bodyMd" as="p" fontWeight="regular">
                  {`Here you can set labels for product page. `}
                      </Text>

                      <div>
                      <InputField
                      marginTop
                      label="Sold By"
                      type="text"
                      required
                      name="soldByLabel"
                      value={soldByLabel}
                      onChange={(e) =>setSoldByLabel(e.target.value)}
                      error={formErrors.soldByLabel}
                      />
                      </div></>
                  }
              </Card>

              <Card sectioned title="SELLER PAGE LABELS">
                  {skeleton ? <SkeletonBodyText/> :
                      <div className="shop_page_setting">
                          <Text variant="bodyMd" as="p" fontWeight="regular">
                              {`Here you set labels for seller page.`}
                          </Text>

                          <FormLayout.Group>
                              <InputField
                                  label="Seller Name"
                                  type="text"
                                  marginTop
                                  name="sellerNameLabel"
                                  value={sellerNameLabel}
                                  onChange={(e) => setSellerNameLabel(e.target.value)}
                                  error={formErrors.sellerNameLabel}
                              />
                              <InputField
                                  label="Total Products"
                                  type="text"
                                  marginTop
                                  name="totalProductsLabel"
                                  value={totalProductsLabel}
                                  onChange={(e) => setTotalProductsLabel(e.target.value)}
                                  error={formErrors.totalProductsLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Total Sale"
                                  type="text"
                                  marginTop
                                  name="totalSaleLabel"
                                  value={totalSaleLabel}
                                  onChange={(e) => setTotalSaleLabel(e.target.value)}
                                  error={formErrors.totalSaleLabel}

                              />
                              <InputField
                                  label="Join Since"
                                  type="text"
                                  marginTop
                                  name="joinSinceLabel"
                                  value={joinSinceLabel}
                                  onChange={(e) => setJoinSinceLabel(e.target.value)}
                                  error={formErrors.joinSinceLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Contact"
                                  type="text"
                                  marginTop
                                  name="contactLabel"
                                  value={contactLabel}
                                  onChange={(e) => setContactLabel(e.target.value)}
                                  error={formErrors.contactLabel}
                              />
                              <InputField
                                  label="Seller Products"
                                  type="text"
                                  marginTop
                                  name="sellerProductsLabel"
                                  value={sellerProductsLabel}
                                  onChange={(e) => setSellerProductsLabel(e.target.value)}
                                  error={formErrors.sellerProductsLabel}

                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="All Reviews"
                                  type="text"
                                  marginTop
                                  name="allReviewsLabel"
                                  value={allReviewsLabel}
                                  onChange={(e) => SetAllReviewsLabel(e.target.value)}
                                  error={formErrors.allReviewsLabel}
                              />
                              <InputField
                                  label="Feedback"
                                  type="text"
                                  marginTop
                                  name="feedbackLabel"
                                  value={feedbackLabel}
                                  onChange={(e) => SetFeedbackLabel(e.target.value)}
                                  error={formErrors.feedbackLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Policy"
                                  type="text"
                                  marginTop
                                  name="v"
                                  value={policyLabel}
                                  onChange={(e) => SetPolicyLabel(e.target.value)}
                                  error={formErrors.policyLabel}
                              />
                              <InputField
                                  label="Description"
                                  type="text"
                                  marginTop
                                  name="descriptionLabel"
                                  value={descriptionLabel}
                                  onChange={(e) => setDescriptionLabel(e.target.value)}
                                  error={formErrors.descriptionLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Search"
                                  type="text"
                                  marginTop
                                  name="searchLabel"
                                  value={searchLabel}
                                  onChange={(e) => setSearchLabel(e.target.value)}
                                  error={formErrors.searchLabel}

                              />
                              <InputField
                                  label="Not Available"
                                  type="text"
                                  marginTop
                                  name="notAvailableLabel"
                                  value={notAvailableLabel}
                                  onChange={(e) => setNotAvailableLabel(e.target.value)}
                                  error={formErrors.notAvailableLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Sort By"
                                  type="text"
                                  marginTop
                                  name="sortbyLabel"
                                  value={sortbyLabel}
                                  onChange={(e) => setSortbyLabel(e.target.value)}
                                  error={formErrors.sortbyLabel}
                              />
                              <InputField
                                  label="Name Ascending"
                                  type="text"
                                  marginTop
                                  name="nameAscendingLabel"
                                  value={nameAscendingLabel}
                                  onChange={(e) => setNameAscendingLabel(e.target.value)}
                                  error={formErrors.nameAscendingLabel}

                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Name Decending"
                                  type="text"
                                  marginTop
                                  name="nameDecendingLabel"
                                  value={nameDecendingLabel}
                                  onChange={(e) => setNameDecendingLabel(e.target.value)}
                                  error={formErrors.nameDecendingLabel}
                              />
                              <InputField
                                  label="Date Ascending"
                                  type="text"
                                  marginTop
                                  name="dateAscendingLabel"
                                  value={dateAscendingLabel}
                                  onChange={(e) => setDateAscendingLabel(e.target.value)}
                                  error={formErrors.dateAscendingLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Date Decending"
                                  type="text"
                                  marginTop
                                  name="datedecendingLabel"
                                  value={datedecendingLabel}
                                  onChange={(e) => setDateDecendingLabel(e.target.value)}
                                  error={formErrors.datedecendingLabel}
                              />
                              <InputField
                                  label="Price Ascending"
                                  type="text"
                                  marginTop
                                  name="priceAscendingLabel"
                                  value={priceAscendingLabel}
                                  onChange={(e) => setPriceAscendingLabel(e.target.value)}
                                  error={formErrors.priceAscendingLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Price Decending"
                                  type="text"
                                  marginTop
                                  name="pricedecendingLabel"
                                  value={pricedecendingLabel}
                                  onChange={(e) => setPriceDecendingLabel(e.target.value)}
                                  error={formErrors.pricedecendingLabel}
                              />
                              <InputField
                                  label="Show"
                                  type="text"
                                  marginTop
                                  name="showLabel"
                                  value={showLabel}
                                  onChange={(e) => setShowLabel(e.target.value)}
                                  error={formErrors.showLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Only Store Pickup"
                                  type="text"
                                  marginTop
                                  name="onlyStorePickupLabel"
                                  value={onlyStorePickupLabel}
                                  onChange={(e) => setOnlyStorePickupLabel(e.target.value)}
                                  error={formErrors.onlyStorePickupLabel}
                              />
                              <InputField
                                  label="Store Pickup + Delivery"
                                  type="text"
                                  marginTop
                                  name="pickupAndDeliveryLabel"
                                  value={pickupAndDeliveryLabel}
                                  onChange={(e) => setPickupAndDeliveryLabel(e.target.value)}
                                  error={formErrors.pickupAndDeliveryLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Closed Store"
                                  type="text"
                                  marginTop
                                  name="closedStoreLabel"
                                  value={closedStoreLabel}
                                  onChange={(e) => setClosedStoreLabel(e.target.value)}
                                  error={formErrors.closedStoreLabel}
                              />
                              <InputField
                                  label="Open Store"
                                  type="text"
                                  marginTop
                                  name="openStoreLabel"
                                  value={openStoreLabel}
                                  onChange={(e) => setOpenStoreLabel(e.target.value)}
                                  error={formErrors.openStoreLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Rating"
                                  type="text"
                                  marginTop
                                  name="ratingLabel"
                                  value={ratingLabel}
                                  onChange={(e) => setRatingLabel(e.target.value)}
                                  error={formErrors.ratingLabel}
                              />
                              <InputField
                                  label="Name"
                                  type="text"
                                  marginTop
                                  name="nameLabel"
                                  value={nameLabel}
                                  onChange={(e) => setNameLabel(e.target.value)}
                                  error={formErrors.nameLabel}

                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Submit"
                                  type="text"
                                  marginTop
                                  name="submitLabel"
                                  value={submitLabel}
                                  onChange={(e) => setSubmitLabel(e.target.value)}
                                  error={formErrors.submitLabel}
                              />
                              <InputField
                                  label="View All"
                                  type="text"
                                  marginTop
                                  name="viewAllLabel"
                                  value={viewAllLabel}
                                  onChange={(e) => setViewAllLabel(e.target.value)}
                                  error={formErrors.viewAllLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Feedback Submitted for Approval"
                                  type="text"
                                  marginTop
                                  name="feedbackSubmittedLabel"
                                  value={feedbackSubmittedLabel}
                                  onChange={(e) => setFeedbackSubmittedLabel(e.target.value)}
                                  error={formErrors.feedbackSubmittedLabel}
                              />
                              <InputField
                                  label="Category"
                                  type="text"
                                  marginTop
                                  name="categoryLabel"
                                  value={categoryLabel}
                                  onChange={(e) => setCategoryLabel(e.target.value)}
                                  error={formErrors.categoryLabel}
                              />
                          </FormLayout.Group>
                          <FormLayout.Group>
                              <InputField
                                  label="Type"
                                  type="text"
                                  marginTop
                                  name="typeLabel"
                                  value={typeLabel}
                                  onChange={(e) => setTypeLabel(e.target.value)}
                                  error={formErrors.typeLabel}
                              />
                              <InputField
                                  label="Tag"
                                  type="text"
                                  marginTop
                                  name="tagLabel"
                                  value={tagLabel}
                                  onChange={(e) => setTagLabel(e.target.value)}
                                  error={formErrors.tagLabel}
                              />
                          </FormLayout.Group>
                      </div>
                  }
              </Card>
            </FormLayout>
          </Form>

          <div className="Polaris-Product-Actions">
            <PageActions
              primaryAction={{
                content: "Save Changes",
                onAction: handleCreateDiscount,
                loading: btnLoading,
              }}
              secondaryActions={[
                {
                  content: "Reset Default",
                  onAction: handleResetDefault,
                    loading: resetBtnLoading,
                },
              ]}
            />
          </div>
        </Page>
      }
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
