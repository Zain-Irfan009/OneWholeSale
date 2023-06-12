import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Layout, Card, Modal, Text, Stack, ButtonGroup, Button, PageActions, Form, FormLayout,
    Toast, List, TextContainer, Banner, Loading, Scrollable, Avatar, EmptyState, TextField,
    Listbox, EmptySearchResult, AutoSelection, Tabs, Icon,DropZone,Thumbnail,  SkeletonPage,
    SkeletonBodyText,
} from '@shopify/polaris';
import {
    SearchMinor, ChevronDownMinor, ChevronUpMinor,NoteMinor
} from '@shopify/polaris-icons';
import { SkeltonPageForTable } from '../components/global/SkeltonPage'
import {  InputField } from '../components/Utils/InputField'
import {  CheckBox } from '../components/Utils/CheckBox'
import { AppContext } from '../components/providers/ContextProvider'

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import EmptyCheckBox from '../assets/icons/EmptyCheckBox.png'
import FillCheckBox from '../assets/icons/FillCheckBox.png'
import {getAccessToken} from "../assets/cookies";




export function MailConfiguration() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [discountError, setDiscountError] = useState()
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [discardModal, setDiscardModal] = useState(false)
    const [storeDescriptioncontent, setStoreDescriptionContent] = useState('');
    const [sellerDescriptioncontent, setSellerDescriptionContent] = useState('');
    const [sellerPolicycontent, setSellerPolicyContent] = useState('');

    const [skeleton, setSkeleton] = useState(false)


    // =================Products Modal Code Start Here================
    const [productsLoading, setProductsLoading] = useState(false)
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadProducts, setToggleLoadProducts] = useState(true)
    const [productTab, setProductTab] = useState(0);
    const [productsModal, setProductsModal] = useState(false)
    const [expandedProduct, setExpandedProduct] = useState([])
    const [globalProducts, setGlobalProducts] = useState([])
    const [productsList, setProductsList] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [publishSellerPageProfile, setPublishSellerPageProfile] = useState(false)

    const [mailSubject, setMailSubject] = useState("");
    const [mailContent, setMailContent] = useState("");

    const [mailContentStatus, setMailContentStatus] = useState(false)

    const [mailHeaderStatus, setMailHeaderStatus] = useState(false)
    const [mailFooterStatus, setMailFooterStatus] = useState(false)
    const [nextPageCursor, setNextPageCursor] = useState('')
    const [selectedVariantProducts, setSelectedVariantProducts] = useState([])
    const [checkedVariants, setCheckedVariants] = useState([])
    const [previousCheckedVariants, setPreviousCheckedVariants] = useState([])

    const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#000000');
    const [footerBackgroundColor, setFooterBackgroundColor] = useState('#000000');

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/svg'];


    const handleProductTabChange = useCallback(
        (selectedTabIndex) => setProductTab(selectedTabIndex),
        [],
    );



    const handleSelectProductsModal = () => {
        setProductsModal(true)
    }

    const handleProductsCancelModal = () => {
        setProductsModal(false)
        setCheckedVariants(previousCheckedVariants)
    }


    const [discount, setDiscount] = useState({
        code: '',
        title: '',
        appliesTo: 'all',
        type: 'percentage',
        value: '',
        minimumRequirement: 'none',
        minimumValue: '',
        collections: null,
        products: null,
        variants: null,
        status: '',
    })



    const handleDiscardModal = () => {
        setDiscardModal(!discardModal)
    }

    const discardAddSeller = () => {
        navigate('/sellerslisting')
    }
    const handleProductsSaveModal = () => {
        setProductsModal(false)
        setPreviousCheckedVariants(checkedVariants)
    }


    const handleQueryChange = (query) => {
        setQueryValue(query);

        setProductsLoading(true)
        setNextPageCursor('')
        setProductsList([])
        setAllProducts([])
        setTimeout(() => {
            setToggleLoadProducts(true)
        }, 500);


    };

    const handleQueryClear = () => {
        handleQueryChange('');
    };


    const getMailConfigurationData = async () => {

        setSkeleton(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/mail-configuration`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setPublishSellerPageProfile(response?.data?.data?.product_approval_status)
            setMailSubject(response?.data?.data?.mail_subject)
            setMailContent(response?.data?.data?.mail_content)
            setHeaderBackgroundColor(response?.data?.data?.header_background_color)
            setFooterBackgroundColor(response?.data?.data?.footer_background_color)
            setMailHeaderStatus(response?.data?.data?.mail_header_status)
            setMailFooterStatus(response?.data?.data?.mail_footer_status)

            setSkeleton(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    const mailConfigurationDataSave = async () => {

        setSkeleton(true)
        const sessionToken = getAccessToken();
        try {

            let data = {
                product_approval_status: publishSellerPageProfile,
                mail_subject: mailSubject,
                mail_content: mailContent,
                header_background_color: headerBackgroundColor,
                footer_background_color: footerBackgroundColor,
                mail_header_status:mailHeaderStatus,
                mail_footer_status:mailFooterStatus,
            }

            const response = await axios.post(`${apiUrl}/mail-configuration-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setSkeleton(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };


    useEffect(() => {
        getMailConfigurationData();
    }, []);



    // =================Products Modal Code Ends Here================



    const handleCollectionTabChange = useCallback(
        (selectedTabIndex) => setCollectionTab(selectedTabIndex),
        [],
    );




    // =================Collections Modal Code Ends Here================



    // ------------------------Toasts Code start here------------------
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;


    const handleCreateDiscount = () => {
        document.getElementById('createDiscountBtn').click();
    }

    const handleDiscount = (e) => {
        setDiscount({ ...discount, [e.target.name]: e.target.value })
    }




    const handleSellerPageProfile = (e) => {
        setPublishSellerPageProfile(!publishSellerPageProfile)
    }

    const handleMailHeaderStatus = (e) => {
        setMailHeaderStatus(!mailHeaderStatus)
    }

    const handleMailFooterStatus = (e) => {
        setMailFooterStatus(!mailFooterStatus)
    }



    const handleHeaderBackgoundColor = useCallback((e)=>setHeaderBackgroundColor(e.target.value),[])
    const handleFooterBackgoundColor = useCallback((e)=>setFooterBackgroundColor(e.target.value),[])


    const [editMailContent, setEditMailContent] = useState('');


    function handleEditMailContent(event, editor) {
        const data = editor.getData();
        console.log(data)
        setEditMailContent(data);
    }


    const handleEditAction=()=>{
        setMailContentStatus(!mailContentStatus)
    }
    return (
        <div className='Discount-Detail-Page'>



            <Modal
                open={discardModal}
                onClose={handleDiscardModal}
                title="Leave page with unsaved changes?"
                primaryAction={{
                    content: 'Leave page',
                    destructive: true,
                    onAction: discardAddSeller,
                }}
                secondaryActions={[
                    {
                        content: 'Stay',
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

            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForProductDetail />
                </span>
                :
                <Page
                    breadcrumbs={[{ content: 'Discounts', onAction: handleDiscardModal }]}
                    title="Mail Configuration"
                >
                    {discountError ?
                        <Banner
                            title="There is 1 error with this discount:"
                            status="critical"
                        >
                            <List>
                                <List.Item>
                                    Specific {discountError} must be added
                                </List.Item>
                            </List>
                        </Banner> : ''
                    }
                    <Form >
                        <Layout>
                            <Layout.Section>

                                <FormLayout>
                                    <Card sectioned title='SELLER APPROVAL'>
                                        {skeleton ? <SkeletonBodyText/> :
                                            <>

                                                <p>
                                                    {`Status`}
                                                </p>

                                            <div className="edit_seller_page_toggle">
                                            <span>
                                            <input id='toggle'
                                            type="checkbox"
                                            className="tgl tgl-light"
                                            checked={publishSellerPageProfile}
                                            onChange={handleSellerPageProfile}
                                            />
                                            <label htmlFor='toggle' className='tgl-btn'></label>
                                            <p>
                                        {`This will send notification to the seller when their product is approved by admin.`}
                                            </p>
                                            </span>
                                            </div>

                                            <InputField
                                            label='Mail Subject *'
                                            type='text'
                                            marginTop
                                            name='title'
                                            value={mailSubject}
                                            disabled
                                            onChange={(e) =>setMailSubject(e.target.value)}

                                            />
                                        {!mailContentStatus &&
                                            <InputField
                                            label='Mail Content *'
                                            multiline={1}
                                            type='text'
                                            marginTop
                                            name='title'
                                            value={mailContent}
                                            disabled
                                            onChange={(e) =>setMailContent(e.target.value)}

                                            />
                                        }

                                        {mailContentStatus &&
                                            <div className='label_editor'>
                                            <label >Mail Content *</label>
                                            <CKEditor
                                            editor={ClassicEditor}
                                            data={editMailContent}
                                            onChange={handleEditMailContent}

                                            />
                                            </div>
                                        }
                                            <div className="mail_config_btn_group" >
                                            <ButtonGroup>
                                            <Button>Reset</Button>
                                            <Button primary onClick={handleEditAction}>Edit</Button>
                                            </ButtonGroup>
                                            </div>
                                            </>
                                        }
                                    </Card>

                                </FormLayout>

                            </Layout.Section>
                            <Layout.Section oneThird>

                                <FormLayout>

                                    <Card >
                                        {skeleton ? <SkeletonBodyText/> :
                                            <>

                                        <Card.Section title='MAIL TEMPLATE HEADER AND FOOTER BACKGROUND COLOR'>
                                            <p>
                                                {`Here you can set color of mail templates header and footer's background. `}
                                            </p>
                                            <br />
                                            <p className="note_background_p">
                                              <span className="note_background_span">Note: </span>  {`Background color of header and footer will be applicable for all mail templates.`}
                                            </p>

                                            <br />


                                            <p>
                                                {`Header Background Color *`}
                                            </p>
                                            <div className='Color-Inputs'>
                                                <Stack>
                                                    <label
                                                        className={`${headerBackgroundColor === '#FFFFFF' ? 'Color-Circle-Border' : ''} Color-Circle`}
                                                        style={{ backgroundColor: headerBackgroundColor }}>
                                                        <input type="color"
                                                               value={headerBackgroundColor}
                                                               name='backgroundColor'
                                                               onChange={(e)=>handleHeaderBackgoundColor(e)}
                                                        />
                                                    </label>
                                                    <span className='Color-Property'>
												<Stack vertical>
													<div className="color-field-3">
														<div className="Polaris-Labelled__LabelWrapper">
															<div className="Polaris-Label">
																<label htmlFor="primaryText" className="Polaris-Label__Text">
																	<span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">Background Color</span>
																</label>
															</div>
														</div>
														<div className="Polaris-Connected">
															<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
																<div className="Polaris-TextField Polaris-TextField--hasValue">
																	<input id="primaryText"
                                                                           autoComplete="off"
                                                                           className="Polaris-TextField__Input"
                                                                           type="text"
                                                                           aria-labelledby="PolarisTextField1Label"
                                                                           aria-invalid="false"
                                                                           value={headerBackgroundColor}
                                                                           name="backgroundColor"
                                                                           onChange={handleHeaderBackgoundColor}
                                                                    />
																	<div className="Polaris-TextField__Backdrop">
																	</div>
																</div>
															</div>
														</div>
													</div>
												</Stack>
											</span>
                                                </Stack>


                                            </div>
                                            <br />
                                            <p>
                                                {`Footer Background Color *`}
                                            </p>
                                            <div className='Color-Inputs'>
                                                <Stack>
                                                    <label
                                                        className={`${footerBackgroundColor === '#FFFFFF' ? 'Color-Circle-Border' : ''} Color-Circle`}
                                                        style={{ backgroundColor: footerBackgroundColor }}>
                                                        <input type="color"
                                                               value={footerBackgroundColor}
                                                               name='backgroundColor'
                                                               onChange={(e)=>handleFooterBackgoundColor(e)}
                                                        />
                                                    </label>
                                                    <span className='Color-Property'>
												<Stack vertical>
													<div className="color-field-3">
														<div className="Polaris-Labelled__LabelWrapper">
															<div className="Polaris-Label">
																<label htmlFor="primaryText" className="Polaris-Label__Text">
																	<span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">Background Color</span>
																</label>
															</div>
														</div>
														<div className="Polaris-Connected">
															<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
																<div className="Polaris-TextField Polaris-TextField--hasValue">
																	<input id="primaryText"
                                                                           autoComplete="off"
                                                                           className="Polaris-TextField__Input"
                                                                           type="text"
                                                                           aria-labelledby="PolarisTextField1Label"
                                                                           aria-invalid="false"
                                                                           value={footerBackgroundColor}
                                                                           name="backgroundColor"
                                                                           onChange={handleFooterBackgoundColor}
                                                                    />
																	<div className="Polaris-TextField__Backdrop">
																	</div>
																</div>
															</div>
														</div>
													</div>
												</Stack>
											</span>
                                                </Stack>


                                            </div>
                                            <div className="mail_config_btn_group" >
                                            <ButtonGroup>
                                                <Button>Test Mail</Button>
                                                <Button primary>Save</Button>
                                            </ButtonGroup>
                                            </div>
                                        </Card.Section>

                                            </>
                                        }
                                    </Card>

                            <div className="template_status_card">
                                    <Card >
                                        {skeleton ? <SkeletonBodyText/> :
                                            <>

                                        <Card.Section title='MAIL TEMPLATE HEADER AND FOOTER CONFIGURATION'>
                                            <p>
                                                {`Choose whether you want to add a header and footer to the mail template or not. `}
                                            </p>
                                            <br />
                                            <p className="note_background_p">
                                                <span className="note_background_span">Note: </span>  {`This configuration will be applicable for all mail templates.`}
                                            </p>

                                            <br />


                                            <p>
                                                {`Mail Header Status *`}
                                            </p>

                                            <div className="edit_seller_page_toggle">
                                    <span>
                                         <input id='toggle1'
                                                type="checkbox"
                                                className="tgl tgl-light"
                                                checked={mailHeaderStatus}
                                                onChange={handleMailHeaderStatus}
                                         />
                                              <label htmlFor='toggle1' className='tgl-btn'></label>
                                          <p>
                                            {`This will enable or disable your mail header template.`}
                                        </p>
                                          </span>
                                            </div>

                                            <br />
                                            <p>
                                                {`Mail Footer Status *`}
                                            </p>
                                            <div className="edit_seller_page_toggle">
                                    <span>
                                         <input id='toggle2'
                                                type="checkbox"
                                                className="tgl tgl-light"
                                                checked={mailFooterStatus}
                                                onChange={handleMailFooterStatus}
                                         />
                                              <label htmlFor='toggle2' className='tgl-btn'></label>
                                          <p>
                                            {`This will enable or disable your mail footer template.`}
                                        </p>
                                          </span>
                                            </div>
                                            <div className="mail_config_btn_group" >
                                                <ButtonGroup>
                                                    <Button onClick={mailConfigurationDataSave} loading={btnLoading} primary>Save</Button>
                                                </ButtonGroup>
                                            </div>
                                        </Card.Section>

                                            </>
                                        }
                                    </Card>
                            </div>

                                </FormLayout>

                            </Layout.Section>
                        </Layout>
                    </Form>

                </Page >
            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
