import React, {
    useState,
    useEffect,
    useContext,
    createContext,
    useReducer,
    useCallback,
} from "react";
import { useNavigate, Navigate, useLocation, Route } from "react-router-dom";

import { Loader } from "./Loader";
import { getAccessToken, setAccessToken } from './cookies'
import axios from "axios";
// import getUser from "./UserApi";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

function reducer(currentState, newState) {
    return { ...currentState, ...newState };
}

function useAuthState() {
    const context = useContext(AuthStateContext);
    if (!context) throw new Error("useAuthState must be used in AuthProvider");
    return context;
}

function useAuthDispatch() {
    const context = useContext(AuthDispatchContext);
    if (!context)
        throw new Error("useAuthDispatch must be used in AuthProvider");

    return context;
}

const initialState = {
    name: "",
    userEmail: "",
    userRole: "",
    isLoggedIn: false,
    userToken: "",
    handle:"",
};

function AuthProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [accessToken,setaccessToken]=useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      console.log("token", accessToken);
        setaccessToken(getAccessToken())
    }, []);


    const handleReloadPage = () => {
        window.location.reload(true);
    };

    const ErrorPage = () => {
        return (
            <>
                <p>
                    Something went wrong, please {""}
                    <a
                        onClick={handleReloadPage}
                        className="href-css-underline href-css-pointer"
                    >
                        reload
                    </a>
                    {""} the page
                </p>
            </>
        );
    };

    const AuthCheck = async () => {
        console.log("access token", getAccessToken());
        try {
            const res = await axios.get(`${props.apiUrl}profile`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });

            console.log("AuthCheck response: ", res?.data);

            dispatch({
                userEmail: res?.data?.data?.user?.email,
                name: res?.data?.data?.user?.name,
                userRole: res?.data?.data?.user?.role,
                handle: res?.data?.data?.user?.collection_handle,
                isLoggedIn: true,
                userToken: getAccessToken(),
            });
            setLoading(false);
        } catch (error) {
            console.warn("AuthCheck Api Error", error);
            if (location.pathname == "/signup") {
                setLoading(false);
                setAccessToken(null);
                navigate("/login");
            } else {
                // if (error.response?.status == 401) {
                setLoading(false);
                setAccessToken(null);
                navigate("/login");
                //   } else if (error.response?.status == 403) {
                //     setLoading(false);
                //     setAccessToken(null);
                //     navigate("/signin");
                //   } else {
                //     console.warn("unauth1");
                //   }
                // }
            }
        }
    };
    useEffect(() => {
        AuthCheck();
    }, [accessToken]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <AuthStateContext.Provider value={state}>
                    <AuthDispatchContext.Provider value={dispatch}>
                        {props.children}
                    </AuthDispatchContext.Provider>
                </AuthStateContext.Provider>
            )}
        </>
    );
}

export { AuthProvider, useAuthState, useAuthDispatch };
