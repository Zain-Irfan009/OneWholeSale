import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Layout, Card, Modal, Text, Stack, ButtonGroup, Button, PageActions, Form, FormLayout,
    Toast, List, TextContainer, Banner, Loading, Scrollable, Avatar, EmptyState, TextField,
    Listbox, EmptySearchResult, AutoSelection, Tabs, Icon, Select ,SkeletonPage,
    SkeletonBodyText
} from '@shopify/polaris';
import {
    SearchMinor, ChevronDownMinor, ChevronUpMinor,
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


export function GlobalCommissionSetting() {
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

    const [skeleton, setSkeleton] = useState(false)



    // =================Products Modal Code Start Here================
    const [productsLoading, setProductsLoading] = useState(false)
    const [queryValue, setQueryValue] = useState('');
    const [toggleLoadProducts, setToggleLoadProducts] = useState(true)
    const [productTab, setProductTab] = useState(0);
    const [productsModal, setProductsModal] = useState(false)
    const [globalProducts, setGlobalProducts] = useState([])
    const [sellerEmail, setSellerEmail] = useState('')
    const [enableMaximumCommission, setEnableMaximumCommission] = useState(false)




    const handleDiscardModal = () => {
        setDiscardModal(!discardModal)
    }

    const discardAddSeller = () => {
        navigate('/commissionslisting')
    }






    const [commissionType, setCommissionType] = useState('%');
    const [fixedCommissionType, setFixedCommissionType] = useState('product');
    const [globalCommission, setGlobalCommission] = useState();
    const [secondGlobalCommission, setSecondGlobalCommission] = useState();
    const [maximumCommission, setMaximumCommission] = useState();



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





    const handleSellerEmail = (e) => {
        setSellerEmail(e.target.value)
    }

    const handleGlobalCommission = (e) => {
        setGlobalCommission(e.target.value)
    }

    const handleSecondGlobalCommission = (e) => {
        setSecondGlobalCommission(e.target.value)
    }

    const handleMaximumCommission = (e) => {
        setMaximumCommission(e.target.value)
    }




    const commissionTypeOptions=[

        {label: '%', value: '%'},
        {label: 'FIXED', value: 'fixed'},
        // {label: '% + FIXED', value: '%_fixed'},
    ];

    const FixedCommissionTypeOptions=[

        {label: 'Product', value: 'product'},
        {label: 'Seller', value: 'seller'},
    ];

    const handleCommissionType = useCallback((value) => setCommissionType(value), []);
    const handleFixedCommissionType = useCallback((value) => setFixedCommissionType(value), []);

    const handleEnableMaximumCommission = (e) => {
        setEnableMaximumCommission(!enableMaximumCommission)
    }


    const getData = async () => {
        setSkeleton(true)
        setLoading(true)
        const sessionToken = getAccessToken();
        try {

            const response = await axios.get(`${apiUrl}/global-commission`,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })

            setCommissionType(response?.data?.data?.commission_type)
            setFixedCommissionType(response?.data?.data?.fixed_commission_type)
            setGlobalCommission(response?.data?.data?.global_commission)
            setSecondGlobalCommission(response?.data?.data?.second_global_commission)
            setEnableMaximumCommission(response?.data?.data?.enable_maximum_commission)
            setMaximumCommission(response?.data?.data?.maximum_commission)
            setLoading(false)
            setSkeleton(false)

        } catch (error) {
            setSkeleton(true)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
    }

    useEffect(() => {
        getData();
    }, []);


    //SUbmit Data
    const submitData = async () => {

        setBtnLoading(true)
        setLoading(true)
        const sessionToken = getAccessToken();


        let data = {
            commission_type:commissionType,
            fixed_commission_type:fixedCommissionType,
            global_commission:globalCommission,
            second_global_commission:secondGlobalCommission,
            enable_maximum_commission:enableMaximumCommission,
            maximum_commission:maximumCommission,

        };

        try {
            const response = await axios.post(`${apiUrl}/global-commission-save`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setLoading(false)
            setBtnLoading(false)
            setToastMsg(response?.data?.message)
            setSucessToast(true)


        } catch (error) {
            setBtnLoading(false)
            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
        }
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
                    <SkeltonPageForTable />
                </span>
                :
                <Page
                    breadcrumbs={[{ content: 'Discounts', onAction: handleDiscardModal }]}
                    title="Global Commission"
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
                        <FormLayout>
                            <Card sectioned title='GLOBAL COMMISSION'>
                                {skeleton ? <SkeletonBodyText/> :
                                    <>
                                    <Text variant="bodyMd" as="p" fontWeight="regular">
                                        {`Here are settings for global commission.`}
                                    </Text>

                                    <div >
                                    <div className="add_product_select">
                                    <Select
                                    label="Global Commission Type"
                                    options={commissionTypeOptions}
                                    onChange={handleCommissionType}
                                    value={commissionType}
                                    helpText="Choose global commission type."

                                    />
                                    </div>
                                {commissionType == '%' &&
                                    <>
                                    <InputField
                                    label='Global Commission*'

                                    name='value'
                                    type='number'
                                    required
                                    marginTop
                                    suffix={`%`}
                                    value={globalCommission}
                                    onChange={handleGlobalCommission}
                                    helpText="Enter global commission."
                                    />
                                    </>
                                }

                                {commissionType == 'fixed' &&
                                    <>
                                    <InputField
                                    label='Global Commission*'

                                    name='value'
                                    type='number'
                                    required
                                    marginTop
                                    suffix={`FIXED`}
                                    value={globalCommission}
                                    onChange={handleGlobalCommission}
                                    helpText="Enter global commission."
                                    />
                                    </>
                                }

                                {commissionType == '%_fixed' &&
                                    <>

                                    <div className="add_product_select">
                                    <Select
                                    label="Fixed Commission Type*"
                                    options={FixedCommissionTypeOptions}
                                    onChange={handleFixedCommissionType}
                                    value={fixedCommissionType}
                                    />
                                    </div>


                                    <InputField
                                    label='Global Commission*'

                                    name='value'
                                    type='number'
                                    required
                                    marginTop
                                    suffix={`FIXED`}
                                    value={globalCommission}
                                    onChange={handleGlobalCommission}
                                    helpText="Enter global commission."
                                    />
                                    <InputField
                                    label='Second Global Commission*'

                                    name='value'
                                    type='number'
                                    required
                                    marginTop
                                    suffix={`FIXED`}
                                    value={secondGlobalCommission}
                                    onChange={handleSecondGlobalCommission}
                                    helpText="This is your second global commission that will apply on a product when second global commission is set."
                                    />
                                    <div className="edit_seller_page_toggle">
                                    <span>
                                    <input id='toggle'
                                    type="checkbox"
                                    className="tgl tgl-light"
                                    checked={enableMaximumCommission}
                                    onChange={handleEnableMaximumCommission}
                                    />
                                    <label htmlFor='toggle' className='tgl-btn'></label>
                                    <p>
                                {`From this option, you can opt maximum commission from a seller per order.`}
                                    </p>
                                    </span>
                                {enableMaximumCommission &&
                                    < InputField
                                    label='Set Maximum Commission*'

                                    name='value'
                                    type='number'
                                    required
                                    marginTop
                                    suffix={`FIXED`}
                                    value={maximumCommission}
                                    onChange={handleMaximumCommission}
                                    helpText="From this option, you can set a fixed commission value above which the global commission can't be exceeded & charged for a particular order.

                                                    Example: Let say, product A has a price of $100, and the global commission is set to 20%. Now, if the maximum commission is set to $30 and 2 quantities of product A is purchased then the commission applied will be $30 and not $40 [2(20% of $100)]."
                                    />
                                }
                                    </div>
                                    </>
                                }



                                    </div>
                                    </>
                                    }

                            </Card>

                        </FormLayout>
                    </Form>


                    <div className='Polaris-Product-Actions'>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: submitData,
                                loading: btnLoading
                            }}
                            secondaryActions={[
                                {
                                    content: 'Cancel',
                                    onAction: handleDiscardModal,
                                },
                            ]}

                        />
                    </div>
                </Page >
            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
