import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Pages/Login/Auth";
import Logo from "./components/Logo/Logo";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Reset from "./Pages/Reset/Reset";
import Deposit from "./Pages/Deposit/Deposit";
import Wallet from "./Pages/wallet/Wallet";
import NotFound from "./Pages/NotFound/PageNotFound";
import Withdraw from "./Pages/Withdrawal/Withdrawal";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"



function App() {
    const [active, setActive] = useState("");

    const showSidebar = () => {
        setActive("active");
    };

    const closeSidebar = () => {
        setActive("");
    };

    return (
        <>
            <Router>
                <Logo />
                <Routes>
                    <Route path="Auth" element={<Auth />} />
                    <Route path="/">
                        <Route index element={<Home />} />
                        <Route
                            path="profile"
                            element={
                                <Profile
                                    showSidebar={showSidebar}
                                    closeSidebar={closeSidebar}
                                    active={active}
                                />
                            }
                        />
                        <Route
                            path="reset"
                            element={
                                <Reset
                                    showSidebar={showSidebar}
                                    closeSidebar={closeSidebar}
                                    active={active}
                                />
                            }
                        />
                        <Route
                            path="deposit"
                            element={
                                <Deposit
                                    showSidebar={showSidebar}
                                    closeSidebar={closeSidebar}
                                    active={active}
                                />
                            }
                        />
                        <Route
                            path="dashboard"
                            element={
                                <Home
                                    showSidebar={showSidebar}
                                    closeSidebar={closeSidebar}
                                    active={active}
                                />
                            }
                        />
                        <Route
                            path="wallets"
                            element={
                                <Wallet
                                    showSidebar={showSidebar}
                                    closeSidebar={closeSidebar}
                                    active={active}
                                />
                            }
                        />
                        <Route
                            path="withdraw"
                            element={
                                <Withdraw
                                    showSidebar={showSidebar}
                                    closeSidebar={closeSidebar}
                                    active={active}
                                />
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Router>
            <Analytics />
            <SpeedInsights />
        </>
    );
}

export default App;
