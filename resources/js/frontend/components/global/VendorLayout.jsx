import { useState, useCallback, useRef, useContext, useEffect } from "react";
import { Frame, Navigation, TopBar, Toast,Button } from "@shopify/polaris";
import {
  HomeMinor,
  SettingsMinor,
  ProductsMinor,
  CustomersMinor,
  OrdersMinor,
} from "@shopify/polaris-icons";
import { AppContext } from "../providers/ContextProvider";
// import { useAuthDispatch, useAuthState } from '../providers/AuthProvider'
import checkifyLogo from "../../assets/logo.webp";
import { useLocation, useNavigate } from "react-router-dom";
// import { setAccessToken, getAccessToken } from '../../components'
import axios from "axios";
import {useAuthState} from "../../assets/AuthProvider";
import {getAccessToken} from "../../assets/cookies";

export function VendorLayout(props) {
  const apiUrl = "https://workingproject.test";

  // const dispatch = useAuthDispatch();
  // const { user } = useAuthState();
    const { name } = useAuthState();
    const { handle } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const { locationChange, setLocationChange } = useContext(AppContext);
  const skipToContentRef = useRef(null);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const [userDetails, setUserDetails] = useState({
      name: name,
      initials: `${name.charAt(0)}`,
  });

  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const toggleErrorMsgActive = useCallback(
    () => setErrorToast((errorToast) => !errorToast),
    []
  );
  const toggleSuccessMsgActive = useCallback(
    () => setSucessToast((sucessToast) => !sucessToast),
    []
  );


    const handleViewShop = () => {
        // Open google.com in a new tab
        window.open(`https://www.onewholesale.ca/collections/${handle}?view=seller`, '_blank');
        // window.open(`https://tlx-new-brand.myshopify.com/collections/${sellerHandle}`, '_blank');
    };




  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const toastSuccessMsg = sucessToast ? (
    <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
  ) : null;

  // useEffect(() => {
  //     if (user?.name?.length > 0) {
  //         let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  //         let initials = [...user.name.matchAll(rgx)] || [];
  //         initials = (
  //             (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  //         ).toUpperCase();
  //         // setUserDetails({ ...userDetails, ['initials']: initials })
  //         setUserDetails({
  //             name: user?.name,
  //             initials: initials,
  //         })
  //     }
  // }, [user])


    useEffect(() => {
        console.log('handle',handle);
    }, [handle]);



  const handleLogout = async () => {
    console.log("logout")
    // let data = {}
    // try {
    //     const response = await axios.post(`${apiUrl}/api/logout`, data, {
    //         headers: { "Authorization": `Bearer ${getAccessToken()}` }
    //     })
    //
    //     // console.log('AuthCheck response: ', response.data);
    //     if (!response?.data?.errors) {
    //         setAccessToken('')
    //         dispatch({
    //             user: null,
    //             userToken: '',
    //         });
    //         navigate('/login')
    //     }
    //
    //
    // } catch (error) {
    //     console.warn('AuthCheck Api Error', error);
    //     if (error.response?.data?.message) {
    //         setToastMsg(error.response?.data?.message)
    //     }
    //     else {
    //         setToastMsg('Server Error')
    //     }
    //     setErrorToast(true)
    props.onLogout();

  };

  const NavigationMarkupPrimary = (
    <Navigation location={locationChange}>
      <Navigation.Section
        items={[
          {
            label: "Dashboard",
            icon: HomeMinor,
            url: "/dashboard",
            onClick: () => setLocationChange("/dashboard"),
            selected: location.pathname === "/dashboard",
          },

          {
            label: "Products",
            icon: OrdersMinor,
            url: "/products",
            onClick: () => setLocationChange("/vendor/products"),
              selected: location.pathname === "/products",
          },
          {
            label: "Orders",
            icon: OrdersMinor,
            url: "/orders",
            onClick: () => setLocationChange("/vendor/orders"),
              selected: location.pathname === "/orders",
          },
            {
                label: "Earning",
                icon: OrdersMinor,
                url: "/commission",
                onClick: () => setLocationChange("/vendor/commission"),
                selected: location.pathname === "/commission",
            },

            {
                label: "Profile",
                icon: OrdersMinor,
                url: "/profile",
                onClick: () => setLocationChange("/vendor/profile"),
                selected: location.pathname === "/profile",
            },

            {
                label: "Shipments",
                icon: OrdersMinor,
                url: "/shipments",
                onClick: () => setLocationChange("/vendor/shipments"),
                selected: location.pathname === "/shipments",
            },
        ]}
      />
    </Navigation>
  );

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );

  const userMenuActions = [
    {
      items: [
        {
          content: "Logout",
          onAction: handleLogout,
        },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={userDetails.name}
      initials={userDetails.initials}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const logo = {
    width: 124,
    topBarSource: checkifyLogo,
    contextualSaveBarSource: checkifyLogo,
    url: "/",
    accessibilityLabel: "Jaded Pixel",
    onClick: () => setLocationChange("/"),
  };

  return (
    <div style={{ height: "500px" }}>
      {location.pathname == "/not-found" ||
      location.pathname == "/vendor/login" ||
      location.pathname == "/vendor/reset-password" ? (
        <Frame>{props.children}</Frame>
      ) : (
        <Frame
          logo={logo}
          topBar={topBarMarkup}
          navigation={NavigationMarkupPrimary}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
          skipToContentTarget={skipToContentRef.current}
        >
            <div className="ticket-alert-c">
                <Button onClick={handleViewShop} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '5px' }}>View Shop</span>

                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="20px" height="15px"><path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"/></svg>
            </Button>
            </div>
          {props.children}
        </Frame>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}

function customize() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.37996 21.646C10.2337 21.8796 11.1148 21.9987 12 22L12.141 21.999C12.6463 21.9927 13.1418 21.8588 13.5815 21.6096C14.0212 21.3605 14.3908 21.0043 14.656 20.574C15.198 19.698 15.256 18.621 14.809 17.694L14.611 17.279C14.158 16.337 14.514 15.483 14.999 14.998C15.484 14.513 16.34 14.157 17.279 14.61H17.28L17.693 14.809C18.1471 15.0286 18.6494 15.1297 19.1531 15.103C19.6569 15.0762 20.1456 14.9225 20.574 14.656C21.0045 14.3911 21.361 14.0216 21.6103 13.5818C21.8596 13.1421 21.9937 12.6465 22 12.141C22.0125 11.209 21.8936 10.2799 21.647 9.381C20.609 5.554 17.294 2.627 13.401 2.096C10.252 1.669 7.15996 2.698 4.92996 4.929C2.69996 7.16 1.66596 10.247 2.09596 13.4C2.62596 17.294 5.55396 20.608 9.37996 21.646ZM15.5 6C15.8978 6 16.2793 6.15804 16.5606 6.43934C16.8419 6.72065 17 7.10218 17 7.5C17 7.89783 16.8419 8.27936 16.5606 8.56066C16.2793 8.84197 15.8978 9 15.5 9C15.1021 9 14.7206 8.84197 14.4393 8.56066C14.158 8.27936 14 7.89783 14 7.5C14 7.10218 14.158 6.72065 14.4393 6.43934C14.7206 6.15804 15.1021 6 15.5 6ZM10.5 5C10.8978 5 11.2793 5.15804 11.5606 5.43934C11.8419 5.72065 12 6.10218 12 6.5C12 6.89783 11.8419 7.27936 11.5606 7.56066C11.2793 7.84197 10.8978 8 10.5 8C10.1021 8 9.7206 7.84197 9.4393 7.56066C9.15799 7.27936 8.99996 6.89783 8.99996 6.5C8.99996 6.10218 9.15799 5.72065 9.4393 5.43934C9.7206 5.15804 10.1021 5 10.5 5ZM8.99996 15.506C8.99996 15.9038 8.84192 16.2854 8.56062 16.5667C8.27931 16.848 7.89778 17.006 7.49996 17.006C7.10213 17.006 6.7206 16.848 6.4393 16.5667C6.15799 16.2854 5.99996 15.9038 5.99996 15.506C5.99996 15.1082 6.15799 14.7266 6.4393 14.4453C6.7206 14.164 7.10213 14.006 7.49996 14.006C7.89778 14.006 8.27931 14.164 8.56062 14.4453C8.84192 14.7266 8.99996 15.1082 8.99996 15.506ZM6.49996 9.006C6.89791 9.00613 7.27952 9.16435 7.56082 9.44584C7.84213 9.72733 8.00009 10.109 7.99996 10.507C7.99982 10.905 7.84161 11.2866 7.56012 11.5679C7.27862 11.8492 6.89691 12.0071 6.49896 12.007C6.101 12.0069 5.71939 11.8487 5.43809 11.5672C5.15678 11.2857 4.99882 10.904 4.99896 10.506C4.99909 10.108 5.1573 9.72644 5.4388 9.44513C5.72029 9.16383 6.102 9.00587 6.49996 9.006Z" />
    </svg>
  );
}

function shipping() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.148 7.971C18.9698 7.67552 18.7185 7.43095 18.4183 7.26087C18.118 7.09079 17.779 7.00095 17.434 7H15V5C15 4.73478 14.8946 4.48043 14.7071 4.29289C14.5196 4.10536 14.2652 4 14 4H4C2.897 4 2 4.897 2 6V16C2 16.746 2.416 17.391 3.023 17.734C3.146 19.553 4.65 21 6.5 21C8.259 21 9.704 19.691 9.949 18H13.051C13.296 19.691 14.741 21 16.5 21C18.259 21 19.704 19.691 19.949 18H20C21.103 18 22 17.103 22 16V13C22.0002 12.8185 21.9507 12.6404 21.857 12.485L19.148 7.971ZM15 9H17.434L19.234 12H15V9ZM6.5 19C5.673 19 5 18.327 5 17.5C5 16.673 5.673 16 6.5 16C7.327 16 8 16.673 8 17.5C8 18.327 7.327 19 6.5 19ZM16.5 19C15.673 19 15 18.327 15 17.5C15 16.673 15.673 16 16.5 16C17.327 16 18 16.673 18 17.5C18 18.327 17.327 19 16.5 19Z" />
    </svg>
  );
}

function payment() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM13 16.915V18H11V16.92C8.661 16.553 8 14.918 8 14H10C10.011 14.143 10.159 15 12 15C13.38 15 14 14.415 14 14C14 13.676 14 13 12 13C8.52 13 8 11.12 8 10C8 8.712 9.029 7.416 11 7.085V6.012H13V7.121C14.734 7.531 15.4 8.974 15.4 10H14.4L13.4 10.018C13.386 9.638 13.185 9 12 9C10.701 9 10 9.516 10 10C10 10.374 10 11 12 11C15.48 11 16 12.88 16 14C16 15.288 14.971 16.584 13 16.915Z" />
    </svg>
  );
}

function integration() {
  return (
    <svg
      style={{ marginTop: "4px" }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.944 6.112C16.507 2.67 13.56 0 10 0C7.244 0 4.85 1.611 3.757 4.15C1.609 4.792 0 6.82 0 9C0 11.757 2.243 14 5 14H16C18.206 14 20 12.206 20 10C19.9985 9.10361 19.6966 8.23358 19.1427 7.52883C18.5888 6.82408 17.8147 6.32526 16.944 6.112ZM11 9V12H9V9H6L10 4L14 9H11Z" />
    </svg>
  );
}

function scripts() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_209_11)">
        <path d="M5.35496 0.221847C4.22057 0.390447 3.25098 1.22985 2.85998 2.37965C2.64538 3.00045 2.65298 2.81665 2.65298 9.09805V14.9004H1.68339C0.755992 14.9004 0.705992 14.9042 0.545193 14.9848C0.334394 15.092 0.200195 15.3258 0.200195 15.5902C0.200195 16.3528 0.456994 17.2612 0.863191 17.9472C1.07779 18.319 1.61059 18.8938 1.93638 19.1124C2.44238 19.4534 3.07858 19.6872 3.72617 19.7678C3.99057 19.7984 5.38556 19.8062 8.80434 19.7984C13.2155 19.787 13.5337 19.7792 13.7483 19.714C14.8405 19.3844 15.6185 18.591 15.9789 17.4414L16.0861 17.1042L16.1053 11.087L16.1245 5.07005L17.7801 5.05085C19.3745 5.03165 19.4395 5.02785 19.5393 4.95125C19.7769 4.77485 19.8037 4.69825 19.7999 4.23465C19.7845 3.16145 19.4281 2.07685 18.8493 1.34485C18.5465 0.965447 18.2207 0.697248 17.8107 0.494048C17.1783 0.179848 17.7455 0.206647 11.2953 0.198847C8.13355 0.195047 5.45836 0.206447 5.35496 0.221847ZM17.4465 1.70505C18.0941 2.02705 18.5503 2.73605 18.5695 3.44505C18.5771 3.65585 18.5657 3.68645 18.4699 3.77085L18.3625 3.86285H17.2319H16.1051V3.27645C16.1051 2.34905 16.1855 2.03845 16.4845 1.78945C16.7951 1.52485 17.0479 1.50185 17.4465 1.70505ZM7.23675 6.39605C7.53955 6.54165 7.66595 6.92485 7.51275 7.21625C7.47835 7.27765 6.98395 7.79505 6.40896 8.36225L5.36656 9.39325L6.44356 10.4702C7.61255 11.6392 7.64315 11.6812 7.55875 11.984C7.48215 12.2792 7.25595 12.4554 6.96475 12.4554C6.87275 12.4554 6.75775 12.4324 6.70415 12.4018C6.55476 12.3214 4.00997 9.79965 3.94097 9.66165C3.86437 9.51225 3.86057 9.30525 3.93337 9.14045C4.00617 8.97185 6.54336 6.45005 6.71575 6.37725C6.89935 6.29645 7.04515 6.30025 7.23675 6.39605ZM12.0733 6.38065C12.1385 6.41905 12.7899 7.04365 13.5181 7.77185C14.6295 8.88325 14.8481 9.11705 14.8825 9.24745C14.9707 9.56545 14.9515 9.58845 13.5259 11.0218C12.8053 11.7462 12.1653 12.367 12.1001 12.3976C11.8471 12.5356 11.4793 12.4474 11.3029 12.2098C11.1955 12.0642 11.1725 11.7652 11.2569 11.589C11.2991 11.5046 11.7437 11.037 12.3721 10.4238L13.4223 9.39665L12.3645 8.34665C11.7857 7.76785 11.2837 7.24665 11.2531 7.18925C11.1841 7.05885 11.1841 6.80225 11.2531 6.66805C11.4141 6.35765 11.7859 6.22745 12.0733 6.38065ZM11.2417 16.238C11.3413 16.3376 11.3529 16.3798 11.3529 16.579C11.3529 16.9584 11.5407 17.2804 12.0465 17.7824C12.3187 18.0506 12.4643 18.2192 12.4643 18.273C12.4643 18.319 12.4145 18.4072 12.3531 18.4684L12.2419 18.5796H7.86515C2.98258 18.5796 3.16258 18.5872 2.59538 18.3114C1.93238 17.9894 1.48399 17.3302 1.44179 16.625C1.42259 16.326 1.44559 16.261 1.59899 16.1728C1.65639 16.1422 2.92118 16.1306 6.40116 16.1268H11.1305L11.2417 16.238Z" />
      </g>
      <defs>
        <clipPath id="clip0_209_11">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function localization() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.165 13.582C17.752 9.509 21.306 4.158 19.222 1.81101C18.561 1.06701 17.638 0.722005 16.647 0.828005C15.815 0.919005 14.96 1.33 14.098 2.02C12.7429 1.318 11.2305 0.975308 9.7052 1.02468C8.17991 1.07405 6.69278 1.51384 5.38598 2.30201C4.37009 2.90348 3.48375 3.70071 2.77839 4.64742C2.07303 5.59414 1.56269 6.6715 1.27698 7.81701C0.831675 9.5815 0.938481 11.4401 1.58298 13.142C0.517979 14.345 -0.471021 16.819 0.759979 18.205C1.27698 18.786 2.01698 19.046 2.90698 19.046C5.61398 19.046 9.71498 16.647 13.165 13.582ZM16.864 2.81501C17.222 2.78101 17.496 2.879 17.725 3.13801C17.956 3.399 17.894 4.084 17.473 5.067C17.0207 4.37871 16.4767 3.7553 15.856 3.21401C16.287 2.95201 16.632 2.84101 16.864 2.81501ZM2.63298 15.118C3.07764 15.7629 3.60478 16.3469 4.20098 16.855C3.17598 17.158 2.48698 17.138 2.25598 16.876C2.03898 16.633 2.25798 15.807 2.63298 15.118ZM18.943 9.249C17.728 11.046 16.037 12.92 14.165 14.582C12.231 16.301 10.099 17.79 8.11498 18.784C8.7306 18.9195 9.35865 18.9906 9.98898 18.996C11.6153 18.9943 13.2107 18.5512 14.605 17.714C16.0535 16.8565 17.2296 15.6064 17.9972 14.1084C18.7649 12.6104 19.0928 10.9256 18.943 9.249Z" />
    </svg>
  );
}

function discount() {
  return (
    <svg
      style={{ marginTop: "4px" }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V5H0.893C1.889 5 2.813 5.681 2.973 6.664C3.02174 6.95104 3.00726 7.24525 2.93056 7.52612C2.85387 7.80698 2.71681 8.06772 2.52894 8.29015C2.34108 8.51258 2.10694 8.69133 1.84287 8.81393C1.57879 8.93654 1.29115 9.00004 1 9H0V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14H19C19.2652 14 19.5196 13.8946 19.7071 13.7071C19.8946 13.5196 20 13.2652 20 13V9H19C18.7089 9.00004 18.4212 8.93654 18.1571 8.81393C17.8931 8.69133 17.6589 8.51258 17.4711 8.29015C17.2832 8.06772 17.1461 7.80698 17.0694 7.52612C16.9927 7.24525 16.9783 6.95104 17.027 6.664C17.187 5.681 18.111 5 19.107 5H20V1C20 0.734784 19.8946 0.48043 19.7071 0.292893C19.5196 0.105357 19.2652 0 19 0ZM7 4C7.26522 4 7.51957 4.10536 7.70711 4.29289C7.89464 4.48043 8 4.73478 8 5C8 5.26522 7.89464 5.51957 7.70711 5.70711C7.51957 5.89464 7.26522 6 7 6C6.73478 6 6.48043 5.89464 6.29289 5.70711C6.10536 5.51957 6 5.26522 6 5C6 4.73478 6.10536 4.48043 6.29289 4.29289C6.48043 4.10536 6.73478 4 7 4ZM6.2 10.4L12.2 2.4L13.8 3.6L7.8 11.6L6.2 10.4ZM13 10C12.7348 10 12.4804 9.89464 12.2929 9.70711C12.1054 9.51957 12 9.26522 12 9C12 8.73478 12.1054 8.48043 12.2929 8.29289C12.4804 8.10536 12.7348 8 13 8C13.2652 8 13.5196 8.10536 13.7071 8.29289C13.8946 8.48043 14 8.73478 14 9C14 9.26522 13.8946 9.51957 13.7071 9.70711C13.5196 9.89464 13.2652 10 13 10Z" />
    </svg>
  );
}

function account() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0C4.579 0 0 4.579 0 10C0 15.421 4.579 20 10 20C15.421 20 20 15.421 20 10C20 4.579 15.421 0 10 0ZM10 5C11.727 5 13 6.272 13 8C13 9.728 11.727 11 10 11C8.274 11 7 9.728 7 8C7 6.272 8.274 5 10 5ZM4.894 14.772C5.791 13.452 7.287 12.572 9 12.572H11C12.714 12.572 14.209 13.452 15.106 14.772C13.828 16.14 12.015 17 10 17C7.985 17 6.172 16.14 4.894 14.772Z" />
    </svg>
  );
}

function extraOffers() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 20H6V10C6 9.73478 6.10536 9.48043 6.29289 9.29289C6.48043 9.10536 6.73478 9 7 9H19V7C19 6.73478 18.8946 6.48043 18.7071 6.29289C18.5196 6.10536 18.2652 6 18 6H14.949C14.697 3.756 12.81 2 10.5 2C8.19 2 6.303 3.756 6.051 6H3C2.73478 6 2.48043 6.10536 2.29289 6.29289C2.10536 6.48043 2 6.73478 2 7V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20ZM10.5 4C11.707 4 12.718 4.86 12.95 6H8.05C8.282 4.86 9.293 4 10.5 4Z" />
      <path d="M21 11H9C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12V20C8 20.5304 8.21071 21.0391 8.58579 21.4142C8.96086 21.7893 9.46957 22 10 22H20C20.5304 22 21.0391 21.7893 21.4142 21.4142C21.7893 21.0391 22 20.5304 22 20V12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11ZM15 18C12.243 18 10 15.757 10 13H12C12 14.654 13.346 16 15 16C16.654 16 18 14.654 18 13H20C20 15.757 17.757 18 15 18Z" />
    </svg>
  );
}
