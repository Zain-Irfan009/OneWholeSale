import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/global/Layout";
import { VendorLayout } from "./components/global/VendorLayout";
import { AppContext } from "./components/providers/ContextProvider";
import "./assets/css/theme.css";
import "./assets/css/checkout.css";
import "./assets/css/style.css";
import { ViewOrder } from "./Pages/ViewOrder";

import { Login } from "./Pages/vendor/Login";
import { ResetPassword } from "./Pages/vendor/ResetPassword";
import { VDashboard } from "./Pages/vendor/VDashboard";
import { Products } from "./Pages/vendor/Products";
import { ViewProduct } from "./Pages/vendor/ViewProduct";
import { Orders } from "./Pages/vendor/Orders";
import { VendorViewOrder } from "./Pages/vendor/VendorViewOrder";
import { Commissions } from "./Pages/vendor/Commissions";
import { Profile } from "./Pages/vendor/Profile";
import { AddNewProduct } from "./Pages/vendor/AddNewProduct";
import { EditVProduct } from "./Pages/vendor/EditVProduct";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import {MailConfiguration1} from "./Pages/MailConfiguration1"
import {Announcement} from "./Pages/Announcement"
import {
    Dashboard,
    NotFound,
    SellersListing,
    AddSeller,
    ShopPageSetting,
    ProductsListing,
    AddProduct,
    EditProduct,
    ImportProduct,
    OrdersListing,
    EditSeller,
    CommissionListing,
    SellerCommissionSetting,
    AddSellerCommission,
    EditSellerCommission,
    MailConfiguration,
    MailSmtp,
    GlobalCommissionSetting,
} from "./Pages";
import Demo from "./Pages/demo";
import { useAuthState, useAuthDispatch } from "./assets/AuthProvider";
import { getAccessToken, setAccessToken } from "./assets/cookies";

export default function App() {
    // const apiUrl = "https://phpstack-1018470-3598964.cloudwaysapps.com/api";
    const apiUrl = "https://workingproject.test/api";
    const [locationChange, setLocationChange] = useState(location.pathname);

    const { userRole, isLoggedIn, name } = useAuthState();
    const dispatch = useAuthDispatch();

    // const [userRole, setUserRole] = useState("admin");
    // const [isLoggedIn, setIsLoggedIn] = useState(true);

    const navigate = useNavigate();

    const logout = async () => {
        try {
            const res = await axios.get(`${apiUrl}/logout`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            dispatch({
                userRole: "",
                name: "",
                isLoggedIn: false,
                userToken: null,
            });
            setAccessToken(null);
            navigate("/login");
        } catch (e) {
            setAccessToken(null);
            console.log(e);
        }
    };

    // if (!getAccessToken()) {
    //     navigate("/dashboard");
    // } else {
    //     navigate("/login");
    // }

    return (
        <AppContext.Provider
            value={{
                locationChange,
                setLocationChange,
                apiUrl,
            }}
        >
            <>
                {!isLoggedIn ? (
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                ) : userRole == "admin" ? (
                    <MainLayout onLogout={logout}>
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/dashboard" />}
                            />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/sellerslisting"
                                element={<SellersListing />}
                            />
                            <Route path="/add-seller" element={<AddSeller />} />
                            <Route
                                path="/shop-page-setting"
                                element={<ShopPageSetting />}
                            />
                            <Route
                                path="/productslisting"
                                element={<ProductsListing />}
                            />
                            <Route
                                path="/add-product"
                                element={<AddProduct />}
                            />
                            <Route
                                path="/edit-product/:edit_product_id"
                                element={<EditProduct />}
                            />
                            <Route path="/demo" element={<Demo />} />
                            <Route
                                path="/import-product"
                                element={<ImportProduct />}
                            />
                            <Route
                                path="/orderslisting"
                                element={<OrdersListing />}
                            />
                            <Route
                                path="/view-order/:order_id"
                                element={<ViewOrder />}
                            />
                            <Route
                                path="/edit-seller/:edit_seller_id"
                                element={<EditSeller />}
                            />
                            <Route
                                path="/commissionslisting"
                                element={<CommissionListing />}
                            />
                            <Route
                                path="/seller-commission-setting"
                                element={<SellerCommissionSetting />}
                            />
                            <Route
                                path="/add-seller-commission"
                                element={<AddSellerCommission />}
                            />
                            <Route
                                path="/edit-seller-commission/:id"
                                element={<EditSellerCommission />}
                            />
                            <Route
                                path="/mail-configuration"
                                element={<MailConfiguration />}
                            />

                            <Route
                                path="/mail"
                                element={<MailConfiguration1 />}
                            />

                            <Route
                                path="/mail-smtp"
                                element={<MailSmtp />}
                            />
                            <Route
                                path="/global-commission-setting"
                                element={<GlobalCommissionSetting />}
                            />
                            <Route path="/not-found" element={<NotFound />} />
                            <Route
                                path="*"
                                element={<Navigate to="/dashboard" />}
                            />
                            <Route path="/announcement" element={<Announcement />} />
                        </Routes>
                    </MainLayout>
                ) : (
                    <VendorLayout onLogout={logout}>
                        <Routes>
                            <Route path="/dashboard" element={<VDashboard />} />
                            <Route path="/products" element={<Products />} />
                            <Route
                                path="/view-product/:view_product_id"
                                element={<ViewProduct />}
                            />
                            <Route path="/orders" element={<Orders />} />

                            <Route
                                path="/view-order/:view_order_id"
                                element={<VendorViewOrder />}
                            />
                            <Route path="/commission" element={<Commissions />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/add-product" element={<AddNewProduct />} />
                            <Route
                                path="/edit-product/:edit_product_id"
                                element={<EditVProduct />}
                            />

                        </Routes>
                    </VendorLayout>
                )}
                {/* <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sellerslisting" element={<SellersListing />} />
          <Route path="/add-seller" element={<AddSeller />} />
          <Route path="/shop-page-setting" element={<ShopPageSetting />} />
          <Route path="/productslisting" element={<ProductsListing />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route
            path="/edit-product/:edit_product_id"
            element={<EditProduct />}
          />
          <Route path="/import-product" element={<ImportProduct />} />
          <Route path="/orderslisting" element={<OrdersListing />} />
          <Route path="/view-order/:order_id" element={<ViewOrder />} />
          <Route path="/edit-seller/:edit_seller_id" element={<EditSeller />} />
          <Route path="/commissionslisting" element={<CommissionListing />} />
          <Route
            path="/seller-commission-setting"
            element={<SellerCommissionSetting />}
          />
          <Route
            path="/add-seller-commission"
            element={<AddSellerCommission />}
          />
          <Route
            path="/edit-seller-commission/:seller_commission_id"
            element={<EditSellerCommission />}
          />
          <Route path="/mail-configuration" element={<MailConfiguration />} />
          <Route
            path="/global-commission-setting"
            element={<GlobalCommissionSetting />}
          />
          <Route path="/mail-smtp" element={<MailSmtp />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </MainLayout> */}

                {/* <VendorLayout>
           <Routes>
            <Route path="/vendor/login" element={<Login />} />
            <Route path="/vendor/reset-password" element={<ResetPassword />} />
            <Route path="/vendor/dashboard" element={<VDashboard />} />
             <Route path="/vendor/products" element={<Products />} />
               <Route path="/vendor/view-product/:view_product_id" element={<ViewProduct />} />
               <Route path="/vendor/orders" element={<Orders />} />
               <Route path="/vendor/view-order/:view_order_id" element={<VendorViewOrder />} />

           </Routes>
        </VendorLayout> */}
            </>
        </AppContext.Provider>
    );
}
