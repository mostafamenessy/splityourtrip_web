/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { createContext, useEffect, useState } from "react";
import { showToast } from "../showTost";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuth(true);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuth(true);
    };

    const register = (token) => {
        localStorage.setItem('authToken', token);
        const userData = JSON.parse(localStorage.getItem('loginUser'));
        setIsAuth(true);
    };

    const logout = () => {
        localStorage.clear();
        showToast({ title: "You have logged out successfully!", id: "success" });
        window.location.href = "/";
    };

    return (
        <>
            <AuthContext.Provider value={{ isAuth, login, logout, register }}>
                {children}
            </AuthContext.Provider>
        </>

    )

}
/* jshint ignore:end */