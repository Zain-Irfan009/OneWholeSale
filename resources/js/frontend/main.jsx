import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PolarisProvider } from "./components/providers/PolarisProvider";
import { AuthProvider } from "./assets/AuthProvider";
import {
    Frame,

} from '@shopify/polaris';
ReactDOM.createRoot(document.getElementById("root")).render(
    <PolarisProvider>
        <BrowserRouter>

            <AuthProvider apiUrl="https://phpstack-1018470-3598964.cloudwaysapps.com/api/">
            {/*<AuthProvider apiUrl="https://workingproject.test/api/">*/}
                <Frame>
                <App />
                </Frame>
            </AuthProvider>
        </BrowserRouter>
    </PolarisProvider>
);
