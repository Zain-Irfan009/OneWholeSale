import React, { useState, useCallback, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Page,
    Card,
    Form,
    FormLayout,
    Button,
    Text,
    Stack,
    Modal,
    TextContainer,
    Toast,
    Icon,
    Layout,
    LegacyCard,
} from "@shopify/polaris";
import axios from "axios";
import checkifyLogo from "../../assets/onewholesale.webp";
import { AppContext } from "../../components/providers/ContextProvider";
// import { useAuthDispatch } from '../../components/providers/AuthProvider'
// import { InputField, ShowPassword, HidePassword, setAccessToken } from '../../components'
import { InputField } from "../../components/Utils/InputField";
import { HidePassword, ShowPassword } from "../../components/Utils/Icon";
import { useAuthDispatch, useAuthState } from "../../assets/AuthProvider";
import { setAccessToken } from "../../assets/cookies";

export function Login(props) {
    const navigate = useNavigate();
    const dispatch = useAuthDispatch();
    const { apiUrl, setLocationChange } = useContext(AppContext);
    const [hidePassword, setHidePassword] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });

    const submitHanlder = async () => {
        const data = {
            email: formValues.email,
            password: formValues.password,
        };
        console.log(data);

        try {
            setBtnLoading(true)
            const res = await axios.post(`${apiUrl}/login`, data);
            console.log(res.data);
            dispatch({
                userRole: res?.data?.data?.role?.name,
                name: res?.data?.data?.user?.name,
                isLoggedIn: true,
                userToken: res?.data?.data?.token,
            });
            setAccessToken(res?.data?.data?.token);
            setBtnLoading(false)
            navigate("/dashboard");
        } catch (e) {
            setBtnLoading(false)
            setToastMsg(e?.response?.data?.message)
            setErrorToast(true);
            navigate("/login");
            console.log(e);
        }
        // props.onLogin(formValues.email);
        // navigate("/dashboard");
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

    const handleFormValue = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const clearFormValues = () => {
        setFormValues({
            email: "",
            password: "",
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);

        let data = {
            email: formValues.email,
            password: formValues.password,
        };

        try {
            const response = await axios.post(`${apiUrl}login`, data);

            console.log('wewewewe');
            setBtnLoading(false);
            if (!response.data.errors) {
                clearFormValues();
                setToastMsg(response.data.message);
                setSucessToast(true);
                setAccessToken(response.data.data.token);
                dispatch({
                    user: response.data.user,
                    userToken: response.data.data.token,
                });
                setLocationChange("/");

                if (response.data.user?.email_verified_at == null) {
                    navigate(
                        `/sign-up-status?email=${response.data.user?.email}`
                    );
                } else {
                    if (response.data.user?.shopifyConnected) {
                        setTimeout(() => {
                            navigate("/");
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            navigate("/admin/store-connect");
                        }, 1000);
                    }
                }
            } else {
                clearFormValues();
                setToastMsg(response.data.message);
                setErrorToast(true);
            }
        } catch (error) {
            console.warn("Login Api Error", error.response);
            setBtnLoading(false);
            setFormValues({ ...formValues, ["password"]: "" });
            if (
                error.response?.data?.data?.error &&
                error.response?.data?.data?.error == "Unauthorised"
            ) {
                setToastMsg("Your email or password is incorrect.");
                setErrorToast(true);
            } else if (error.response?.data?.data?.error) {
                setToastMsg(error.response?.data?.data?.error);
                setErrorToast(true);
            } else {
                setToastMsg("Server Error");
                setErrorToast(true);
            }
        }
    };

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
                                        Sign in
                                    </Text>
                                    <div className="margin-top" />
                                    <Form onSubmit={submitHanlder}>
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
                                                        value={
                                                            formValues.password
                                                        }
                                                        name="password"
                                                        onChange={
                                                            handleFormValue
                                                        }
                                                        label="Password"
                                                        type={
                                                            hidePassword
                                                                ? "password"
                                                                : "text"
                                                        }
                                                        autoComplete="password"
                                                        placeholder="Enter Password"
                                                        required
                                                    />
                                                    <span
                                                        onClick={() =>
                                                            setHidePassword(
                                                                !hidePassword
                                                            )
                                                        }
                                                        className="Icon-Section"
                                                    >
                                                        {hidePassword ? (
                                                            <Icon
                                                                source={
                                                                    HidePassword
                                                                }
                                                                color="subdued"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                source={
                                                                    ShowPassword
                                                                }
                                                                color="subdued"
                                                            />
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
                                                        // onClick={submitHanlder}
                                                        fullWidth
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
}
