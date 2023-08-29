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
    SkeletonPage,
    SkeletonBodyText,
    Tabs,
    Icon,
    Select,
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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EmptyCheckBox from "../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../assets/icons/FillCheckBox.png";
import {getAccessToken} from "../assets/cookies";

export function EditSellerCommission() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const {id} = useParams();
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [discountError, setDiscountError] = useState();
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [discardModal, setDiscardModal] = useState(false);
    const [storeDescriptioncontent, setStoreDescriptionContent] = useState("");
    const [sellerDescriptioncontent, setSellerDescriptionContent] =
        useState("");
    const [sellerPolicycontent, setSellerPolicyContent] = useState("");

    const [skeleton, setSkeleton] = useState(false)

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


    const handleDiscardModal = () => {
        setDiscardModal(!discardModal);
    };

    const discardAddSeller = () => {
        navigate("/seller-commission-setting");
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

    const [commissionType, setCommissionType] = useState("%");
    const [firstCommission, setFirstCommission] = useState();
    const [secondCommission, setSecondCommission] = useState();






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



    const getData = async (id) => {
        const sessionToken = getAccessToken();
        setSkeleton(true)
        try {

            const response = await axios.get(`${apiUrl}/seller-commission/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setSellerEmail(response?.data?.data?.store_name)
            setCommissionType(response?.data?.data?.commission_type)
            setCommissionType(response?.data?.data?.commission_type)
            setFirstCommission(response?.data?.data?.first_commission)
            setSecondCommission(response?.data?.data?.second_commission)
            setSkeleton(false)



        } catch (error) {
console.log(error)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    useEffect(() => {

        getData(id);
    }, []);


    //SUbmit Data
    const submitData = async () => {

        setBtnLoading(true)
        const sessionToken = getAccessToken();


        let data = {
            store_name:sellerEmail,
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
                console.log(response)
            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            navigate('/seller-commission-setting')


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
                        <p>
                            Leaving this page will delete all unsaved changes.
                        </p>
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
                    breadcrumbs={[
                        { content: "Discounts", onAction: handleDiscardModal },
                    ]}
                    title="Edit Seller Commission"
                >
                    {discountError ? (
                        <Banner
                            title="There is 1 error with this discount:"
                            status="critical"
                        >
                            <List>
                                <List.Item>
                                    Specific {discountError} must be added
                                </List.Item>
                            </List>
                        </Banner>
                    ) : (
                        ""
                    )}

                    <Form >
                        <FormLayout>
                            <Card sectioned title="EDIT COMMISSION">

                                {skeleton ? <SkeletonBodyText/> :
                                    <>
                                <Text
                                    variant="bodyMd"
                                    as="p"
                                    fontWeight="regular"
                                >
                                    {`Enter Commission Details You Want To add. `}
                                </Text>

                                <div>


                                    <InputField
                                        marginTop
                                        label="Seller Shop*"
                                        placeholder="Enter Seller Email Here"
                                        type="email"

                                        name="code"
                                        value={sellerEmail}
                                       readOnly

                                    />

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
                                                onChange={
                                                    handleSecondCommission
                                                }
                                            />
                                        </>
                                    )}
                                </div>

                                    </>
                                }
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
                            secondaryActions={[
                                {
                                    content: "Cancel",
                                    onAction: handleDiscardModal,
                                },
                            ]}
                        />
                    </div>
                </Page>
            )}
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
