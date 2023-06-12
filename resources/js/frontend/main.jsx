import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PolarisProvider } from "./components/providers/PolarisProvider";
import { AuthProvider } from "./assets/AuthProvider";
ReactDOM.createRoot(document.getElementById("root")).render(
    <PolarisProvider>
        <BrowserRouter>
            <AuthProvider apiUrl="https://workingproject.test/api/">
                <App />
            </AuthProvider>
        </BrowserRouter>
    </PolarisProvider>
);
