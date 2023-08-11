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
  Icon,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
  ContextualSaveBar,
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
import { getAccessToken, setAccessToken } from '../assets/cookies'
import EmptyCheckBox from "../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../assets/icons/FillCheckBox.png";
import {Loader} from "../components/Loader";

export function AddSeller() {
  const { apiUrl } = useContext(AppContext);
  // const { user } = useAuthState();
  const navigate = useNavigate();


    const [skeleton, setSkeleton] = useState(false)
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


  const [showSaveBar, setShowSaveBar] = useState(false);


  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [contact, setcontact] = useState("");
  const [storeDescription, setDescription] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");
  const [sellerPolicy, setSellerPolicy] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    const [formErrors, setFormErrors] = useState({});


  const handleDiscardModal = () => {
    setDiscardModal(!discardModal);
  };

  const discardAddSeller = () => {
    navigate("/sellerslisting");
  };

  function handleStoreDescription(event, editor) {
    const data = editor.getData();
    console.log(data);
    setStoreDescriptionContent(data);
  }

  function handleSellerDescription(event, editor) {
    const data = editor.getData();
    console.log(data);
    setSellerDescriptionContent(data);
  }
  function handleSellerPolicy(event, editor) {
    const data = editor.getData();
    console.log(data);
    setSellerPolicyContent(data);
  }



  // =================Products Modal Code Ends Here================





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



  //SUbmit Data
    const submitData = async () => {


        const sessionToken = getAccessToken();

        const errors = {};

        if (name.trim() === '') {
            errors.name = 'Name is required';
        }
        if (shopName.trim() === '') {
            errors.shopName = 'Shop Name is required';
        }
        if (email.trim() === '') {
            errors.email = 'Email is required';
        }

        if (storeAddress.trim() === '') {
            errors.storeAddress = 'Store Address is required';
        }

        if (zipcode.trim() === '') {
            errors.zipcode = 'Zipcode is required';
        }
        if (contact.trim() === '') {
            errors.contact = 'Contact is required';
        }

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
        setBtnLoading(true)
        setLoading(true)
        let data = {
            seller_name:name,
            seller_shopname:shopName,
            seller_email:email,
            seller_store_address:storeAddress,
            seller_zipcode:zipcode,
            seller_contact:contact,
            seller_store_description:storeDescriptioncontent,
            seller_description:sellerDescriptioncontent,
            seller_policy:sellerPolicycontent,
            password:password,
            password_confirmation:confirmPassword,

        };

        try {
            const response = await axios.post(`${apiUrl}/add-seller`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            navigate(`/edit-seller/${response?.data?.seller?.id}`);
            setBtnLoading(false)
            setLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setSkeleton(false)


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

      {loading ? (
        <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
      ) : (
        <Page
          breadcrumbs={[{ content: "Discounts", onAction: handleDiscardModal }]}
          title="Add Seller"
          fullWidth
          // actionGroups={[
          //   {
          //     title: "Actions",
          //     actions: [
          //       {
          //         content: "Share on Facebook",
          //         accessibilityLabel: "Individual action label",
          //         onAction: () => alert("Share on Facebook action"),
          //       },
          //     ],
          //   },
          // ]}
        >
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
          {discountError ? (
            <Banner
              title="There is 1 error with this discount:"
              status="critical"
            >
              <List>
                <List.Item>Specific {discountError} must be added</List.Item>
              </List>
            </Banner>
          ) : (
            ""
          )}

                <Form>
                    <FormLayout>
                        <Card sectioned title="SELLER DETAILS">
                            <Text variant="bodyMd" as="p" fontWeight="regular">
                                {`Enter Seller Details You Want To Add. `}
                            </Text>

                            <div>
                                <InputField
                                    marginTop
                                    label="Name*"
                                    placeholder="Enter Seller Name Here"
                                    type="text"
                                    required
                                    name="code"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={formErrors.name}
                                />
                            </div>

                            <InputField
                                label="Shop Name *"
                                placeholder="Enter Seller Shop Name Here"
                                type="text"
                                marginTop
                                name="title"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                error={formErrors.shopName}
                            />
                            <InputField
                                label="Email *"
                                placeholder="Enter Seller's Email"
                                type="text"
                                marginTop
                                name="title"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={formErrors.email}
                            />

                            <InputField
                                multiline={1}
                                label="Store Address *"
                                placeholder="Enter Seller's Store Physical Address"
                                type="text"
                                marginTop
                                name="title"
                                value={storeAddress}
                                onChange={(e) => setStoreAddress(e.target.value)}
                                error={formErrors.storeAddress}
                            />

                            <InputField
                                label="Seller Zipcode *"
                                type="text"
                                placeholder="Enter Seller's Zipcode"
                                marginTop
                                name="title"
                                value={zipcode}
                                onChange={(e) => setZipcode(e.target.value)}
                                error={formErrors.zipcode}
                            />
                            <InputField
                                label="Seller Contact *"
                                type="text"
                                marginTop
                                name="title"
                                value={contact}
                                onChange={(e) => setcontact(e.target.value)}
                                error={formErrors.contact}
                            />
                            <div className="label_editor">
                                <label>Store Description *</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={storeDescriptioncontent}
                                    onChange={handleStoreDescription}

                                />
                            </div>

                            <div className="label_editor">
                                <label>Seller Description *</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={sellerDescriptioncontent}
                                    onChange={handleSellerDescription}

                                />
                            </div>

                            <div className="label_editor">
                                <label>Seller Policy *</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={sellerPolicycontent}
                                    onChange={handleSellerPolicy}

                                />
                            </div>
                        </Card>

                        <Card sectioned title="SECURITY">
                            <div className="Requirements-Section">
                                <Text variant="bodyMd" as="p" fontWeight="regular">
                                    {`Set Password for Seller.`}
                                </Text>

                                <InputField
                                    label="Password*"
                                    type="password"
                                    marginTop
                                    name="title"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={formErrors.password}
                                />
                                <InputField
                                    label="Confirm Password*"
                                    type="password"
                                    marginTop
                                    name="title"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={formErrors.confirmPassword}
                                />
                            </div>
                        </Card>
                    </FormLayout>
                </Form>

          <div className="Polaris-Product-Actions">
            <PageActions
              primaryAction={{
                content: "Create Account",
                onAction: submitData,
                loading: btnLoading,
              }}
            />
          </div>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
