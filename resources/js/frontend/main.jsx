import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PolarisProvider } from "./components/providers/PolarisProvider";
import { AuthProvider } from "./assets/AuthProvider";
// import { initI18n } from "./utils/i18nUtils";
import {
    Frame,

} from '@shopify/polaris';
// ReactDOM.createRoot(document.getElementById("root")).render(

// initI18n().then(() => {
// ReactDOM.render(
//     <PolarisProvider>
//         <BrowserRouter>
//
//             {/*<AuthProvider apiUrl="https://phpstack-1018470-3598964.cloudwaysapps.com/api/">*/}
//             <AuthProvider apiUrl="https://workingproject.test/api/">
//                 <Frame>
//                 <App />
//                 </Frame>
//             </AuthProvider>
//         </BrowserRouter>
//     </PolarisProvider>
// ,document.getElementById("root")
// );
// });


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
