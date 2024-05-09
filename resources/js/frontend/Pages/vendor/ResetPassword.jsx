import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Page, Layout, Card, Form, FormLayout, Button, Text, Stack, Modal, TextContainer, Toast, Icon
} from '@shopify/polaris';
import checkifyLogo from '../../assets/onewholesale.webp';
import { AppContext } from '../../components/providers/ContextProvider'
// import { InputField, setAccessToken } from '../../components'
import { InputField } from '../../components/Utils/InputField'
import { Link } from 'react-router-dom';
import axios from "axios";
import {HidePassword, ShowPassword} from "../../components/Utils";


export function ResetPassword() {
    const { apiUrl, } = useContext(AppContext);
    const [btnLoading, setBtnLoading] = useState(false)
    const [errorModal, setErrorModal] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [time, setTime] = useState(0);


    const [formValues, setFormValues] = useState({
        email: '',
    })


    const handleErrorModal = useCallback(() => setErrorModal(!errorModal), [errorModal]);


    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const handleFormValue = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

    const clearFormValues = () => {
        setFormValues({
            email: '',
        })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true)
        setBtnDisabled(true)
        let data = {
            email: formValues.email,
        }

        try {
            const response = await axios.post(`${apiUrl}/forgot-password`, data)

            setBtnLoading(false)
            if (response?.data == "We can't find a user with that email address.") {
                setErrorToast(true)
                setToastMsg(response?.data)
                setBtnDisabled(false)
            }else if(response?.data == "Network issue, Click on the Reset Password again"){
                setErrorToast(true)
                setToastMsg(response?.data)
                setBtnDisabled(false)
            }
            else {
                setSucessToast(true)
                setToastMsg(response?.data)
                setTime(60)
                setTimeout(() => {

                    setBtnDisabled(false)
                }, 60000);
            }


        } catch (error) {
            console.warn('forgot password Api Error', error);
            setBtnLoading(false)
            setBtnDisabled(false)
            if (error.response?.message) {
                setToastMsg(error.response?.message)
                setErrorToast(true)
            }
            else {
                setToastMsg('Server Error')
                setErrorToast(true)
            }
        }

    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => prevTime - 1);
        }, 1000);

        // Clear interval on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="div-padding">
            <Page fullWidth>
                <div style={{ display: "flex" }}>
                    <div className="login-div">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Error earum optio dignissimos distinctio
                            consequatur sint adipisci corrupti exercitationem,
                            dolor fuga odit debitis ratione eaque dolores
                            asperiores magni culpa alias. Suscipit?
                        </p>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            width: "50%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "500px",
                                    width:"400px",
                                    maxHeight: "500px",
                                    padding: "20px 20px",
                                    backgroundColor: "white",
                                    borderRadius: "5px",
                                }}
                            >
                                <div className="Logo-Container">
                                    <img src={checkifyLogo} alt="logo" />
                                </div>

                                <div>
                                    <Text
                                        variant="headingLg"
                                        as="h6"
                                        fontWeight="semibold"
                                        alignment="center"
                                    >
                                        Reset password
                                    </Text>
                                    <div className="margin-top" />
                                                      <Form onSubmit={handleFormSubmit}>
                                                            <FormLayout>

                                                          <FormLayout.Group>
                                                             <InputField
                                                                        value={formValues.email}
                                                                        name='email'
                                                                        onChange={handleFormValue}
                                                                        label="Email"
                                                                        type="email"
                                                                        autoComplete="email"
                                                                        placeholder='Enter Email'
                                                                        required
                                                                    />
                                                                </FormLayout.Group>

                                                                <div className='Form-Btns'>
                                                                    <Stack vertical>
                                                                        <Button
                                                                            submit
                                                                            primary
                                                                            loading={btnLoading}
                                                                            disabled={formValues.email?.length < 1 || btnDisabled}
                                                                        >
                                                                            {btnDisabled ?
                                                                                time > 0 ?
                                                                                    `Resend in ${time}` :
                                                                                    'Reset Password' :
                                                                                'Reset Password'
                                                                            }

                                                                        </Button>
                                                                    </Stack>
                                                                </div>


                                                                <div className='Form-Footer'>
                                                                    <p>
                                                                        <Link to='/vendor/login'>Return to login</Link>
                                                                    </p>
                                                                </div>


                                                            </FormLayout>
                                                        </Form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Layout>
        <Layout.Section oneThird>
          <LegacyCard title="Order details" sectioned>
            <p>
              Use to follow a normal section with a secondary section to create
              a 2/3 + 1/3 layout on detail pages (such as individual product or
              order pages). Can also be used on any page that needs to structure
              a lot of content. This layout stacks the columns on small screens.
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section >
          <LegacyCard title="Tags" sectioned>
            <p>Add tags to your order.</p>
          </LegacyCard>
        </Layout.Section>
      </Layout> */}

                {/* <Card sectioned>
          <div className="Logo-Container">
            <img src={checkifyLogo} alt="logo" />
          </div>

          <div>
            <Text
              variant="headingLg"
              as="h6"
              fontWeight="semibold"
              alignment="center"
            >
              Sign in to Onewholesale Marketplace
            </Text>

            <Form onSubmit={handleFormSubmit}>
              <FormLayout>
                <FormLayout.Group>
                  <InputField
                    value={formValues.email}
                    name="email"
                    onChange={handleFormValue}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter Email"
                    required
                  />
                </FormLayout.Group>

                <FormLayout.Group>
                  <div className="Icon-TextFiled">
                    <InputField
                      value={formValues.password}
                      name="password"
                      onChange={handleFormValue}
                      label="Password"
                      type={hidePassword ? "password" : "text"}
                      autoComplete="password"
                      placeholder="Enter Password"
                      required
                    />
                    <span
                      onClick={() => setHidePassword(!hidePassword)}
                      className="Icon-Section"
                    >
                      {hidePassword ? (
                        <Icon source={HidePassword} color="subdued" />
                      ) : (
                        <Icon source={ShowPassword} color="subdued" />
                      )}
                    </span>
                  </div>
                </FormLayout.Group>

                <div className="Form-Btns">
                  <Stack vertical>
                    <Button
                      submit
                      primary
                      loading={btnLoading}
                      onClick={submitHanlder}
                    >
                      Login
                    </Button>
                    <Link to="/vendor/reset-password">
                      Forgot the password?
                    </Link>
                  </Stack>
                </div>


              </FormLayout>
            </Form>
          </div>
        </Card> */}

                {toastErrorMsg}
                {toastSuccessMsg}

            </Page>
        </div>
    );

    // return (
    //
    //     <div className='Login-Page Login-Page-Centered'>
    //
    //         <Modal
    //             titleHidden
    //             small
    //             open={errorModal}
    //             onClose={handleErrorModal}
    //             secondaryActions={[
    //                 {
    //                     content: 'Ok',
    //                     onAction: handleErrorModal,
    //                 },
    //             ]}
    //         >
    //             <div className='Login-Error-Modal'>
    //                 <Modal.Section>
    //                     <TextContainer>
    //                         <Text variant="bodyMd" as="p" fontWeight="medium">
    //                             Your email or password is incorrect.
    //                         </Text>
    //                         <Text variant="bodyMd" as="p" fontWeight="regular">
    //                             Please try again
    //                         </Text>
    //                     </TextContainer>
    //                 </Modal.Section>
    //             </div>
    //         </Modal>
    //
    //         <Page>
    //             <Card sectioned>
    //                 <div className='Logo-Container'>
    //                     <img src={checkifyLogo} alt="logo" />
    //                 </div>
    //
    //                 <div>
    //                     <Text variant="headingLg" as="h6" fontWeight="semibold">
    //                         Forgot your password?
    //                     </Text>
    //
    //                     <Text variant="bodyMd" as="p" fontWeight="regular" color="subdued">
    //                         We’ll send instructions to your email, on how to reset it.
    //                     </Text>
    //
    //                     <Form onSubmit={handleFormSubmit}>
    //                         <FormLayout>
    //
    //                             <FormLayout.Group>
    //                                 <InputField
    //                                     value={formValues.email}
    //                                     name='email'
    //                                     onChange={handleFormValue}
    //                                     label="Email"
    //                                     type="email"
    //                                     autoComplete="email"
    //                                     placeholder='Enter Email'
    //                                     required
    //                                 />
    //                             </FormLayout.Group>
    //
    //                             <div className='Form-Btns'>
    //                                 <Stack vertical>
    //                                     <Button
    //                                         submit
    //                                         primary
    //                                         loading={btnLoading}
    //                                         disabled={formValues.email?.length < 1 || btnDisabled}
    //                                     >
    //                                         {btnDisabled ?
    //                                             time > 0 ?
    //                                                 `Resend in ${time}` :
    //                                                 'Reset Password' :
    //                                             'Reset Password'
    //                                         }
    //
    //                                     </Button>
    //                                 </Stack>
    //                             </div>
    //
    //
    //                             <div className='Form-Footer'>
    //                                 <p>
    //                                     <Link to='/vendor/login'>Return to login</Link>
    //                                 </p>
    //                             </div>
    //
    //
    //                         </FormLayout>
    //                     </Form>
    //
    //
    //                 </div>
    //             </Card>
    //             {toastErrorMsg}
    //             {toastSuccessMsg}
    //         </Page>
    //     </div>
    // )
}
