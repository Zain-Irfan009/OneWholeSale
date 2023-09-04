import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react';
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
    SkeletonPage,
    SkeletonBodyText,
    Tag,
    Autocomplete,
    useIndexResourceState,
    IndexTable,
    Popover,
    ActionList,
    useSetIndexFiltersMode,
    ChoiceList, RangeSlider, Checkbox, Pagination,
} from '@shopify/polaris';
import {
    SearchMinor, ChevronDownMinor, ChevronUpMinor, NoteMinor, HorizontalDotsMinor,ExternalMinor
} from '@shopify/polaris-icons';
import { SkeltonPageForTable } from '../components/global/SkeltonPage'
import {  InputField } from '../components/Utils/InputField'
import {  CheckBox } from '../components/Utils/CheckBox'
import { AppContext } from '../components/providers/ContextProvider'

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import EmptyCheckBox from '../assets/icons/EmptyCheckBox.png'
import FillCheckBox from '../assets/icons/FillCheckBox.png'
import {getAccessToken} from "../assets/cookies";
import {CustomBadge} from "../components/Utils";
import ReactSelect from "react-select";




export function MailConfiguration1() {
    const { apiUrl } = useContext(AppContext);
    // const { user } = useAuthState();
    const navigate = useNavigate();
    const location = useLocation();

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
    const [selectedTab, setSelectedTab] = useState(0);
    const [sellerList, setSellerList] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false)
    const [skeleton, setSkeleton] = useState(false)

    const [publishSellerPageProfile, setPublishSellerPageProfile] = useState(false)

    const [mailSubject, setMailSubject] = useState("");
    const [mailContent, setMailContent] = useState("");
    const [orderMailContent, setOrderMailContent] = useState("");

    const [mailContentStatus, setMailContentStatus] = useState(false)

    const [mailHeaderStatus, setMailHeaderStatus] = useState(false)
    const [mailFooterStatus, setMailFooterStatus] = useState(false)
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#000000');
    const [footerBackgroundColor, setFooterBackgroundColor] = useState('#000000');



    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        []
    );


    const handleHeaderBackgoundColor = useCallback((e)=>setHeaderBackgroundColor(e.target.value),[])
    const handleFooterBackgoundColor = useCallback((e)=>setFooterBackgroundColor(e.target.value),[])


    const tabs = [
        {
            id: "1",
            content: "Product Email",
        },
        {
            id: "2",
            content: "Order Email",
        },
        // {
        //     id: "3",
        //     content: "Inducements",
        // },
    ];



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



    const handleMailHeaderStatus = (e) => {
        setMailHeaderStatus(!mailHeaderStatus)
    }

    const handleMailFooterStatus = (e) => {
        setMailFooterStatus(!mailFooterStatus)
    }



    useEffect(() => {
        getMailConfigurationData()
    }, [toggleLoadData]);




    const emptyStateMarkup = (
        <EmptySearchResult title={"No Product Found"} withIllustration />
    );

    const handleSellerPageProfile = (e) => {
        setPublishSellerPageProfile(!publishSellerPageProfile)
    }


    function handleMailContent(event, editor) {
        const data = editor.getData();
        console.log(data);
        setMailContent(data);
    }

    function handleOrderMailContent(event, editor) {
        const data = editor.getData();
        console.log(data);
        setOrderMailContent(data);
    }

    const getMailConfigurationData = async () => {

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
            setOrderMailContent(response?.data?.data?.order_mail_content)

            setLoading(false)

        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    const mailConfigurationDataSave = async () => {

        setLoading(true)
        const sessionToken = getAccessToken();
        try {

            let data = {
                product_approval_status: publishSellerPageProfile,
                // mail_subject: mailSubject,
                mail_content: mailContent,
                // header_background_color: headerBackgroundColor,
                // footer_background_color: footerBackgroundColor,
                // mail_header_status:mailHeaderStatus,
                // mail_footer_status:mailFooterStatus,
            }

            const response = await axios.post(`${apiUrl}/mail-configuration-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setLoading(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };
    const mailConfigurationDataSaveOrder = async () => {

        setLoading(true)
        const sessionToken = getAccessToken();
        try {

            let data = {
                // product_approval_status: publishSellerPageProfile,
                // mail_subject: mailSubject,
                order_mail_content: orderMailContent,
                // header_background_color: headerBackgroundColor,
                // footer_background_color: footerBackgroundColor,
                // mail_header_status:mailHeaderStatus,
                // mail_footer_status:mailFooterStatus,
            }

            const response = await axios.post(`${apiUrl}/mail-configuration-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setLoading(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };
    return (
        <div className="Customization-Page">

            {loading ? (
                <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
            ) : (
                <Page
                    fullWidth
                    title="Mail"

                >

                    <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                        {loading ? (
                            selectedTab == 2 ? (
                                <span>
                  <SkeltonTabsWithThumbnail />
                </span>
                            ) : (
                                <span>
                  <SkeltonTabsLayoutSecondary />
                </span>
                            )
                        ) : (
                            <>
                                {(() => {
                                    switch (selectedTab) {
                                        case 0:
                                            return (
                                                <div className="Customization-Tab1 margin-top">
                                                    <Form >
                                                        <Layout>
                                                            <Layout.Section>

                                                                <FormLayout>
                                                                    <Card sectioned title='Product APPROVAL'>


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
                                            <p className="margin-top">
                                        {`This will send notification to the seller when their product is approved by admin.`}
                                            </p>
                                            </span>
                                                                        </div>

                                                                        {/*<InputField*/}
                                                                        {/*    label='Mail Subject *'*/}
                                                                        {/*    type='text'*/}
                                                                        {/*    marginTop*/}
                                                                        {/*    name='title'*/}
                                                                        {/*    value={mailSubject}*/}
                                                                        {/*    disabled*/}
                                                                        {/*    onChange={(e) =>setMailSubject(e.target.value)}*/}

                                                                        {/*/>*/}
                                                                        {!mailContentStatus &&
                                                                            // <InputField
                                                                            //     label='Mail Content *'
                                                                            //     multiline={1}
                                                                            //     type='text'
                                                                            //     marginTop
                                                                            //     name='title'
                                                                            //     value={mailContent}
                                                                            //     disabled
                                                                            //     onChange={(e) =>setMailContent(e.target.value)}
                                                                            //
                                                                            // />
                                                                            <div className="margin-top">
                                                                            <CKEditor
                                                                                editor={ClassicEditor}
                                                                                data={mailContent}
                                                                                onChange={handleMailContent}
                                                                            />
                                                                            </div>
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
                                                                                {/*<Button>Reset</Button>*/}
                                                                                {/*<Button primary onClick={handleEditAction}>Edit</Button>*/}
                                                                            </ButtonGroup>
                                                                        </div>


                                                                    </Card>

                                                                </FormLayout>

                                                                <div className='Polaris-Product-Actions'>
                                                                    <PageActions
                                                                        primaryAction={{
                                                                            content: 'Save',
                                                                            onAction: mailConfigurationDataSave,
                                                                            loading: btnLoading
                                                                        }}

                                                                    />
                                                                </div>

                                                            </Layout.Section>

                                                        </Layout>
                                                    </Form>


                                                </div>
                                            );

                                        case 1:
                                            return (
                                                <div className="Customization-Tab2 Custom-PageActions margin-top">
                                                    <Form >
                                                        <Layout>
                                                            <Layout.Section>

                                                                <FormLayout>
                                                                    <Card sectioned title='Order Email'>



                                                                        {/*<InputField*/}
                                                                        {/*    label='Mail Subject *'*/}
                                                                        {/*    type='text'*/}
                                                                        {/*    marginTop*/}
                                                                        {/*    name='title'*/}
                                                                        {/*    value={mailSubject}*/}
                                                                        {/*    disabled*/}
                                                                        {/*    onChange={(e) =>setMailSubject(e.target.value)}*/}

                                                                        {/*/>*/}
                                                                        {!mailContentStatus &&
                                                                            // <InputField
                                                                            //     label='Mail Content *'
                                                                            //     multiline={1}
                                                                            //     type='text'
                                                                            //     marginTop
                                                                            //     name='title'
                                                                            //     value={mailContent}
                                                                            //     disabled
                                                                            //     onChange={(e) =>setMailContent(e.target.value)}
                                                                            //
                                                                            // />
                                                                            <div className="margin-top">
                                                                                <CKEditor
                                                                                    editor={ClassicEditor}
                                                                                    data={orderMailContent}
                                                                                    onChange={handleOrderMailContent}
                                                                                />
                                                                            </div>
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
                                                                                {/*<Button>Reset</Button>*/}
                                                                                {/*<Button primary onClick={handleEditAction}>Edit</Button>*/}
                                                                            </ButtonGroup>
                                                                        </div>


                                                                    </Card>

                                                                </FormLayout>

                                                                <div className='Polaris-Product-Actions'>
                                                                    <PageActions
                                                                        primaryAction={{
                                                                            content: 'Save',
                                                                            onAction: mailConfigurationDataSaveOrder,
                                                                            loading: btnLoading
                                                                        }}

                                                                    />
                                                                </div>

                                                            </Layout.Section>
                                                            <Layout.Section >

                                                                {/*                            <FormLayout>*/}

                                                                {/*                                <Card >*/}


                                                                {/*                                    <Card.Section title='MAIL TEMPLATE HEADER AND FOOTER BACKGROUND COLOR'>*/}
                                                                {/*                                        <p>*/}
                                                                {/*                                            {`Here you can set color of mail templates header and footer's background. `}*/}
                                                                {/*                                        </p>*/}
                                                                {/*                                        <br />*/}
                                                                {/*                                        <p className="note_background_p">*/}
                                                                {/*                                            <span className="note_background_span">Note: </span>  {`Background color of header and footer will be applicable for all mail templates.`}*/}
                                                                {/*                                        </p>*/}

                                                                {/*                                        <br />*/}


                                                                {/*                                        <p>*/}
                                                                {/*                                            {`Header Background Color *`}*/}
                                                                {/*                                        </p>*/}
                                                                {/*                                        <div className='Color-Inputs'>*/}
                                                                {/*                                            <Stack>*/}
                                                                {/*                                                <label*/}
                                                                {/*                                                    className={`${headerBackgroundColor === '#FFFFFF' ? 'Color-Circle-Border' : ''} Color-Circle`}*/}
                                                                {/*                                                    style={{ backgroundColor: headerBackgroundColor }}>*/}
                                                                {/*                                                    <input type="color"*/}
                                                                {/*                                                           value={headerBackgroundColor}*/}
                                                                {/*                                                           name='backgroundColor'*/}
                                                                {/*                                                           onChange={(e)=>handleHeaderBackgoundColor(e)}*/}
                                                                {/*                                                    />*/}
                                                                {/*                                                </label>*/}
                                                                {/*                                                <span className='Color-Property'>*/}
                                                                {/*			<Stack vertical>*/}
                                                                {/*				<div className="color-field-3">*/}
                                                                {/*					<div className="Polaris-Labelled__LabelWrapper">*/}
                                                                {/*						<div className="Polaris-Label">*/}
                                                                {/*							<label htmlFor="primaryText" className="Polaris-Label__Text">*/}
                                                                {/*								<span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">Background Color</span>*/}
                                                                {/*							</label>*/}
                                                                {/*						</div>*/}
                                                                {/*					</div>*/}
                                                                {/*					<div className="Polaris-Connected">*/}
                                                                {/*						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">*/}
                                                                {/*							<div className="Polaris-TextField Polaris-TextField--hasValue">*/}
                                                                {/*								<input id="primaryText"*/}
                                                                {/*                                       autoComplete="off"*/}
                                                                {/*                                       className="Polaris-TextField__Input"*/}
                                                                {/*                                       type="text"*/}
                                                                {/*                                       aria-labelledby="PolarisTextField1Label"*/}
                                                                {/*                                       aria-invalid="false"*/}
                                                                {/*                                       value={headerBackgroundColor}*/}
                                                                {/*                                       name="backgroundColor"*/}
                                                                {/*                                       onChange={handleHeaderBackgoundColor}*/}
                                                                {/*                                />*/}
                                                                {/*								<div className="Polaris-TextField__Backdrop">*/}
                                                                {/*								</div>*/}
                                                                {/*							</div>*/}
                                                                {/*						</div>*/}
                                                                {/*					</div>*/}
                                                                {/*				</div>*/}
                                                                {/*			</Stack>*/}
                                                                {/*		</span>*/}
                                                                {/*                                            </Stack>*/}


                                                                {/*                                        </div>*/}
                                                                {/*                                        <br />*/}
                                                                {/*                                        <p>*/}
                                                                {/*                                            {`Footer Background Color *`}*/}
                                                                {/*                                        </p>*/}
                                                                {/*                                        <div className='Color-Inputs'>*/}
                                                                {/*                                            <Stack>*/}
                                                                {/*                                                <label*/}
                                                                {/*                                                    className={`${footerBackgroundColor === '#FFFFFF' ? 'Color-Circle-Border' : ''} Color-Circle`}*/}
                                                                {/*                                                    style={{ backgroundColor: footerBackgroundColor }}>*/}
                                                                {/*                                                    <input type="color"*/}
                                                                {/*                                                           value={footerBackgroundColor}*/}
                                                                {/*                                                           name='backgroundColor'*/}
                                                                {/*                                                           onChange={(e)=>handleFooterBackgoundColor(e)}*/}
                                                                {/*                                                    />*/}
                                                                {/*                                                </label>*/}
                                                                {/*                                                <span className='Color-Property'>*/}
                                                                {/*			<Stack vertical>*/}
                                                                {/*				<div className="color-field-3">*/}
                                                                {/*					<div className="Polaris-Labelled__LabelWrapper">*/}
                                                                {/*						<div className="Polaris-Label">*/}
                                                                {/*							<label htmlFor="primaryText" className="Polaris-Label__Text">*/}
                                                                {/*								<span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular">Background Color</span>*/}
                                                                {/*							</label>*/}
                                                                {/*						</div>*/}
                                                                {/*					</div>*/}
                                                                {/*					<div className="Polaris-Connected">*/}
                                                                {/*						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">*/}
                                                                {/*							<div className="Polaris-TextField Polaris-TextField--hasValue">*/}
                                                                {/*								<input id="primaryText"*/}
                                                                {/*                                       autoComplete="off"*/}
                                                                {/*                                       className="Polaris-TextField__Input"*/}
                                                                {/*                                       type="text"*/}
                                                                {/*                                       aria-labelledby="PolarisTextField1Label"*/}
                                                                {/*                                       aria-invalid="false"*/}
                                                                {/*                                       value={footerBackgroundColor}*/}
                                                                {/*                                       name="backgroundColor"*/}
                                                                {/*                                       onChange={handleFooterBackgoundColor}*/}
                                                                {/*                                />*/}
                                                                {/*								<div className="Polaris-TextField__Backdrop">*/}
                                                                {/*								</div>*/}
                                                                {/*							</div>*/}
                                                                {/*						</div>*/}
                                                                {/*					</div>*/}
                                                                {/*				</div>*/}
                                                                {/*			</Stack>*/}
                                                                {/*		</span>*/}
                                                                {/*                                            </Stack>*/}


                                                                {/*                                        </div>*/}
                                                                {/*                                        /!*<div className="mail_config_btn_group" >*!/*/}
                                                                {/*                                        /!*<ButtonGroup>*!/*/}
                                                                {/*                                        /!*    <Button>Test Mail</Button>*!/*/}
                                                                {/*                                        /!*    <Button primary>Save</Button>*!/*/}
                                                                {/*                                        /!*</ButtonGroup>*!/*/}
                                                                {/*                                        /!*</div>*!/*/}
                                                                {/*                                    </Card.Section>*/}


                                                                {/*                                </Card>*/}

                                                                {/*                                <div className="template_status_card">*/}
                                                                {/*                                    <Card >*/}
                                                                {/*                                        {skeleton ? <SkeletonBodyText/> :*/}
                                                                {/*                                            <>*/}

                                                                {/*                                                <Card.Section title='MAIL TEMPLATE HEADER AND FOOTER CONFIGURATION'>*/}
                                                                {/*                                                    <p>*/}
                                                                {/*                                                        {`Choose whether you want to add a header and footer to the mail template or not. `}*/}
                                                                {/*                                                    </p>*/}
                                                                {/*                                                    <br />*/}
                                                                {/*                                                    <p className="note_background_p">*/}
                                                                {/*                                                        <span className="note_background_span">Note: </span>  {`This configuration will be applicable for all mail templates.`}*/}
                                                                {/*                                                    </p>*/}

                                                                {/*                                                    <br />*/}


                                                                {/*                                                    <p>*/}
                                                                {/*                                                        {`Mail Header Status *`}*/}
                                                                {/*                                                    </p>*/}

                                                                {/*                                                    <div className="edit_seller_page_toggle">*/}
                                                                {/*<span>*/}
                                                                {/*     <input id='toggle1'*/}
                                                                {/*            type="checkbox"*/}
                                                                {/*            className="tgl tgl-light"*/}
                                                                {/*            checked={mailHeaderStatus}*/}
                                                                {/*            onChange={handleMailHeaderStatus}*/}
                                                                {/*     />*/}
                                                                {/*          <label htmlFor='toggle1' className='tgl-btn'></label>*/}
                                                                {/*      <p>*/}
                                                                {/*        {`This will enable or disable your mail header template.`}*/}
                                                                {/*    </p>*/}
                                                                {/*      </span>*/}
                                                                {/*                                                    </div>*/}

                                                                {/*                                                    <br />*/}
                                                                {/*                                                    <p>*/}
                                                                {/*                                                        {`Mail Footer Status *`}*/}
                                                                {/*                                                    </p>*/}
                                                                {/*                                                    <div className="edit_seller_page_toggle">*/}
                                                                {/*<span>*/}
                                                                {/*     <input id='toggle2'*/}
                                                                {/*            type="checkbox"*/}
                                                                {/*            className="tgl tgl-light"*/}
                                                                {/*            checked={mailFooterStatus}*/}
                                                                {/*            onChange={handleMailFooterStatus}*/}
                                                                {/*     />*/}
                                                                {/*          <label htmlFor='toggle2' className='tgl-btn'></label>*/}
                                                                {/*      <p>*/}
                                                                {/*        {`This will enable or disable your mail footer template.`}*/}
                                                                {/*    </p>*/}
                                                                {/*      </span>*/}
                                                                {/*                                                    </div>*/}
                                                                {/*                                                    <div className="mail_config_btn_group" >*/}
                                                                {/*                                                        <ButtonGroup>*/}
                                                                {/*                                                            <Button onClick={mailConfigurationDataSave} loading={btnLoading} primary>Save</Button>*/}
                                                                {/*                                                        </ButtonGroup>*/}
                                                                {/*                                                    </div>*/}
                                                                {/*                                                </Card.Section>*/}

                                                                {/*                                            </>*/}
                                                                {/*                                        }*/}
                                                                {/*                                    </Card>*/}
                                                                {/*                                </div>*/}

                                                                {/*                            </FormLayout>*/}

                                                            </Layout.Section>
                                                        </Layout>
                                                    </Form>


                                                </div>
                                            );

                                        case 2:
                                            return (
                                                <div className="Customization-Tab3 Custom-ResourceList">

                                                </div>
                                            );

                                        default:
                                            break;
                                    }
                                })()}
                            </>
                        )}
                    </Tabs>
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
