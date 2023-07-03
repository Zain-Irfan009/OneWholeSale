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
  DropZone,
  Thumbnail,
  Popover,
  ActionList,
  ContextualSaveBar,
} from "@shopify/polaris";
import {
  SearchMinor,
  ChevronDownMinor,
  ChevronUpMinor,
  NoteMinor,
} from "@shopify/polaris-icons";
import { SkeltonPageForTable } from "../components/global/SkeltonPage";
import { InputField } from "../components/Utils/InputField";
import { CheckBox } from "../components/Utils/CheckBox";
import { AppContext } from "../components/providers/ContextProvider";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EmptyCheckBox from "../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../assets/icons/FillCheckBox.png";
import {getAccessToken} from "../assets/cookies";

export function EditSeller() {
  const { apiUrl } = useContext(AppContext);
  // const { user } = useAuthState();
  const params = useParams();
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
  const [showSaveBar, setShowSaveBar] = useState(false);




  const [publishSellerPageProfile, setPublishSellerPageProfile] =
    useState(false);

  const [file3, setFile3] = useState();
  const [file4, setFile4] = useState();
  const [file5, setFile5] = useState();


    const [fileUrl3, setFileUrl3] = useState();
    const [fileUrl4, setFileUrl4] = useState();
    const [fileUrl5, setFileUrl5] = useState();

  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [contact, setcontact] = useState("");
  const [storeDescription, setDescription] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");
  const [sellerPolicy, setSellerPolicy] = useState("");
  const [handle, setHandle] = useState("");


    const [formErrors, setFormErrors] = useState({});

  const validImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg",
  ];



  const getSellerData = async (id) => {
      const sessionToken = getAccessToken();
      try {

          const response = await axios.get(`${apiUrl}/seller-view/${id}`,
              {
                  headers: {
                      Authorization: "Bearer " + sessionToken
                  }
              })

          setName(response?.data?.name)
          setShopName(response?.data?.seller_shopname)
          setEmail(response?.data?.email)
          setStoreAddress(response?.data?.seller_store_address)
          setZipcode(response?.data?.seller_zipcode)
          setcontact(response?.data?.seller_contact)
          setStoreDescriptionContent(response?.data?.seller_store_description)
          setSellerDescriptionContent(response?.data?.seller_description)
          setSellerPolicyContent(response?.data?.seller_policy)
          setFileUrl5(response?.data?.store_banner_image)
          setFileUrl3(response?.data?.seller_image)
          setFileUrl4(response?.data?.seller_shop_image)
          setPublishSellerPageProfile(response?.data?.publish_seller_profile)
          setHandle(response?.data?.seller_handle)


          // setCustomers(response?.data)

          // setBtnLoading(false)
          // setToastMsg(response?.data?.message)
          // setSucessToast(true)


      } catch (error) {
console.log('error',error)
          setToastMsg(error?.response?.data?.message)
          setErrorToast(true)
      }

  };

  useEffect(() => {
    getSellerData(params.edit_seller_id);
  }, []);





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

  const handleDropZoneDrop3 = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile3((file3) => acceptedFiles[0]),
    []
  );
  const handleDropZoneDrop5 = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile5((file5) => acceptedFiles[0]),
    []
  );
  const handleDropZoneDrop4 = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile4((file4) => acceptedFiles[0]),
    []
  );



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





  const handleRemoveImage = (type) => {
    if (type == "favicons") {
      setFile3();
    }
  };

    const handleRemoveImage1 = (type) => {
        if (type == "favicons") {
            setFileUrl3();
        }
    };
  const handleBannerRemove = (type) => {
    if (type == "favicons") {
      setFile5();
    }
  };
    const handleBannerRemove1 = (type) => {
        if (type == "favicons") {
            setFileUrl5();
        }
    };
  const handleRemoveShopImage = (type) => {
    if (type == "favicons") {
      setFile4();
    }
  };

    const handleRemoveShopImage1 = (type) => {
        if (type == "favicons") {
            setFileUrl4();
        }
    };

  const handleSellerPageProfile = (e) => {
    setPublishSellerPageProfile(!publishSellerPageProfile);
  };

  const [active, setActive] = useState(true);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleImportedAction = useCallback(
    () => console.log("Imported action"),
    []
  );

  const handleExportedAction = useCallback(
    () => console.log("Exported action"),
    []
  );

  const activator = (
    <Button onClick={toggleActive} disclosure>
      More actions
    </Button>
  );



    //SUbmit Data
    const submitData = async () => {

        setBtnLoading(true)
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

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setBtnLoading(false)
            return;
        }

        let formData = new FormData();
        formData.append('store_banner_image', file5 ? file5 : fileUrl5);
        formData.append('seller_shop_image', file4 ? file4 : fileUrl4);
        formData.append('seller_image', file3 ? file3 : fileUrl3);
        formData.append('publish_seller_profile',publishSellerPageProfile);
        formData.append('seller_handle',handle);
        formData.append('id',params.edit_seller_id);
        formData.append('seller_name',name);
        formData.append('seller_shopname',shopName);
        formData.append('seller_email',email);
        formData.append('seller_store_address',storeAddress);
        formData.append('seller_zipcode',zipcode);
        formData.append('seller_contact',contact);
        formData.append('seller_store_description',storeDescriptioncontent);
        formData.append('seller_description',sellerDescriptioncontent);
        formData.append('seller_policy',sellerPolicycontent);


        try {
            const response = await axios.post(`${apiUrl}/edit-seller`,formData,
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
          <SkeltonPageForProductDetail />
        </span>
      ) : (
        <Page
          breadcrumbs={[{ content: "Discounts", onAction: handleDiscardModal }]}
          title="Edit Seller"
          fullWidth
          actionGroups={[
            {
              title: "Actions",
              actions: [
                {
                  content: "Share on Facebook",
                  accessibilityLabel: "Individual action label",
                  onAction: () => alert("Share on Facebook action"),
                },
              ],
            },
          ]}
        >

          <Form >
            <Layout>
              <Layout.Section>
                <FormLayout>
                  <Card sectioned title="SELLER DETAILS">
                    <Text variant="bodyMd" as="p" fontWeight="regular">
                      {`Enter Seller Details You Want To Add. `}
                    </Text>

                    <div>
                      <InputField
                        marginTop
                        label="Seller Name*"
                        placeholder="Enter Seller Name Here"
                        type="text"
                        required
                        name="code"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    />
                    <InputField
                      label="Email *"
                      placeholder="Enter Seller's Email"
                      type="text"
                      marginTop
                      name="title"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    />

                    <InputField
                      label="Seller Zipcode *"
                      type="text"
                      marginTop
                      name="title"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                    />
                    <InputField
                      label="Seller Contact *"
                      type="text"
                      marginTop
                      name="title"
                      value={contact}
                      onChange={(e) => setcontact(e.target.value)}
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

                  <Card sectioned title="Store Banner Image">
                    <Text> Upload Banner here</Text>
                    <div className="margin-top" />
                    <div>
                      {!file5 && !fileUrl5 && (
                        <DropZone
                          allowMultiple={false}
                          onDrop={handleDropZoneDrop5}
                          accept="image/*"
                          type="image"
                        >

                          {!file5 && !fileUrl5 && (
                            <DropZone.FileUpload actionTitle={"Add Image"} />
                          )}
                        </DropZone>
                      )}
                      {file5 && (
                        <img
                          style={{ maxWidth: "600px", maxHeight: "200px" }}
                          src={
                            validImageTypes.includes(file5.type)
                              ? window.URL.createObjectURL(file5)
                              : NoteMinor
                          }
                        />
                        //   <Thumbnail
                        //     size="large"
                        //     alt={file5.name}
                        //     source={
                        //       validImageTypes.includes(file5.type)
                        //         ? window.URL.createObjectURL(file5)
                        //         : NoteMinor
                        //     }
                        //   />
                      )}

                        {fileUrl5 && fileUrl5 != 'null' && !file5 &&
                            <img
                                style={{ maxWidth: "600px", maxHeight: "200px" }}
                                src={`${fileUrl5}`}
                            />

                        }
                    </div>
                    <div className="margin-top" />
                    {file5 ? (
                      <span className="Image-Remove">
                        <Button
                          plain
                          onClick={() => handleBannerRemove("favicons")}
                        >
                          Remove
                        </Button>
                      </span>
                    ) :  (
                      ""
                    )}

                      {fileUrl5 ? (
                          <span className="Image-Remove">
                        <Button
                            plain
                            onClick={() => handleBannerRemove1("favicons")}
                        >
                          Remove
                        </Button>
                      </span>
                      ) :  (
                          ""
                      )}
                  </Card>
                </FormLayout>
              </Layout.Section>
              <Layout.Section oneThird>
                <FormLayout>
                  <Card>
                    <Card.Section title="SELLER PROFILE AND STATUS">
                      <p>
                        {`Here You Can Upload Profile Image of Seller & Change the Status of Seller. `}
                      </p>

                      <br />
                      <div>
                        {!file3 && !fileUrl3 && (
                          <DropZone
                            allowMultiple={false}
                            onDrop={handleDropZoneDrop3}
                            accept="image/*"
                            type="image"
                          >

                            {!file3 && !fileUrl3 && (
                              <DropZone.FileUpload actionTitle={"Add Image"} />
                            )}

                          </DropZone>
                        )}
                        {file3 &&  (
                          <img
                            style={{ maxWidth: "300px", maxHeight: "200px" }}
                            src={
                              validImageTypes.includes(file3.type)
                                ? window.URL.createObjectURL(file3)
                                : NoteMinor
                            }
                          />
                        )}
                          {fileUrl3 && fileUrl3 != 'null' && !file3 &&
                              <img
                                  style={{ maxWidth: "600px", maxHeight: "200px" }}
                                  src={`${fileUrl3}`}
                              />

                          }
                      </div>
                      {file3 ? (
                        <span className="Image-Remove">
                          <Button
                            plain
                            onClick={() => handleRemoveImage("favicons")}
                          >
                            Remove
                          </Button>
                        </span>
                      ) : (
                        ""
                      )}

                        {fileUrl3 ? (
                            <span className="Image-Remove">
                        <Button
                            plain
                            onClick={() => handleRemoveImage1("favicons")}
                        >
                          Remove
                        </Button>
                      </span>
                        ) :  (
                            ""
                        )}

                      <p>{`Publish Seller Profile Page`}</p>
                      <div className="edit_seller_page_toggle">
                        <span>
                          <input
                            id="toggle"
                            type="checkbox"
                            className="tgl tgl-light"
                            checked={publishSellerPageProfile}
                            onChange={handleSellerPageProfile}
                          />
                          <label htmlFor="toggle" className="tgl-btn"></label>
                        </span>
                      </div>
                    </Card.Section>
                  </Card>

                  <Card>
                    <Card.Section title="SELLER SHOP LOGO">
                      <p>{`Here You Can Upload Shop logo of Seller.`}</p>

                      <br />
                      <div>
                        {!file4 && !fileUrl4 && (
                          <DropZone
                            allowMultiple={false}
                            onDrop={handleDropZoneDrop4}
                            accept="image/*"
                            type="image"
                          >
                            {!file4 && !fileUrl4 && (
                              <DropZone.FileUpload actionTitle={"Add Image"} />
                            )}





                          </DropZone>
                        )}
                        {file4 && (
                          <img
                            style={{ maxWidth: "600px", maxHeight: "200px" }}
                            src={
                              validImageTypes.includes(file4.type)
                                ? window.URL.createObjectURL(file4)
                                : NoteMinor
                            }
                          />
                        )}

                          {fileUrl4 && fileUrl4 != 'null' && !file4 &&
                              <img
                                  style={{ maxWidth: "600px", maxHeight: "200px" }}
                                  src={`${fileUrl4}`}
                              />

                          }
                      </div>
                      {file4 ? (
                        <span className="Image-Remove">
                          <Button
                            plain
                            onClick={() => handleRemoveShopImage("favicons")}
                          >
                            Remove
                          </Button>
                        </span>
                      ) : (
                        ""
                      )}

                        {fileUrl4 ? (
                            <span className="Image-Remove">
                          <Button
                              plain
                              onClick={() => handleRemoveShopImage1("favicons")}
                          >
                            Remove
                          </Button>
                        </span>
                        ) : (
                            ""
                        )}
                    </Card.Section>
                  </Card>
                  <Card>
                    {" "}
                    <Card.Section title="SELLER Handle">
                      <Text>Here you can configure seller handle</Text>
                      <InputField
                        label="Handle"
                        placeholder="Handle"
                        type="text"
                        marginTop
                        name="title"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                      />
                    </Card.Section>
                  </Card>
                </FormLayout>
              </Layout.Section>
            </Layout>
          </Form>
          <div className="Polaris-Product-Actions">
            <PageActions
              primaryAction={{
                content: "Update",
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
