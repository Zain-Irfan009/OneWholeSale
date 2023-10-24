import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
    Page, Layout, Card, Modal, Text, Stack, ButtonGroup, Button, PageActions, Form, FormLayout,
    Toast, List, TextContainer, Banner, Loading, Scrollable, Avatar, EmptyState, TextField,
    Listbox, EmptySearchResult, AutoSelection, Tabs, Icon, Select, SkeletonBodyText
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


export function Announcement() {
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
    const [announcementContent,setAnnouncementContent] = useState('');
    const [title, setTitle] = useState('')

    const [skeleton, setSkeleton] = useState(false)



    const handleProductTabChange = useCallback(
        (selectedTabIndex) => setProductTab(selectedTabIndex),
        [],
    );




    function handleAnnouncementContent(event, editor) {
        const data = editor.getData();
        console.log(data);
        setAnnouncementContent(data);
    }





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







    const mailSmtpDataSave = async () => {

        setSkeleton(true)
        setBtnLoading(true)
        const sessionToken = getAccessToken();
        try {

            let data = {
                message: announcementContent,
                title: title,
            }

            const response = await axios.post(`${apiUrl}/send-announcement-mail`,data,
                {
                    headers: {
                        Authorization: "Bearer " + sessionToken
                    }
                })
            setToastMsg(response?.data?.message)
            setSucessToast(true)
            setSkeleton(false)
            setBtnLoading(false)


        } catch (error) {

            setToastMsg(error?.response?.data?.message)
            setErrorToast(true)
            setSkeleton(false)
        }

    };

    const handleTitle = (e) => {
        setTitle(e.target.value)
    }





    return (
        <div className='Discount-Detail-Page'>


            {loading ?
                <span>
                    <Loading />
                    <SkeltonPageForProductDetail />
                </span>
                :
                <Page
                    // breadcrumbs={[{ content: 'Discounts', onAction: handleDiscardModal }]}
                    title="Announcement"
                >

                    <Form >
                        <Layout>
                            <Layout.Section>

                                <FormLayout>
                                    <Card sectioned title=''>


                                        <Text variant="bodyMd" as="p" fontWeight="regular">
                                            {`Here you can set up mail smtp settings. `}
                                        </Text>

                                        <div >
                                            <InputField

                                                label='Title'
                                                type='text'
                                                marginTop
                                                required
                                                name='code'
                                                value={title}
                                                onChange={handleTitle}

                                            />
                                        </div>


                                        <div className='label_editor'>
                                                <label >Mail Content *</label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={announcementContent}
                                                    onChange={handleAnnouncementContent}

                                                />
                                            </div>


                                    </Card>

                                </FormLayout>
                            </Layout.Section>

                        </Layout>
                    </Form>



                    <div className='Polaris-Product-Actions'>
                        <PageActions
                            primaryAction={{
                                content: 'Send',
                                onAction: mailSmtpDataSave,
                                loading: btnLoading
                            }}

                        />
                    </div>
                </Page >
            }
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    );
}
