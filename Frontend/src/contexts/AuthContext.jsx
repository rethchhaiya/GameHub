import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { getCurrentUser } from "../services/authService";

export function AuthProvider({ children }){

    const [user, setUser] = useState(() => {
        try{
            const saved = localStorage.getItem("user_Data");
            
            return saved ? JSON.parse(saved) : null;
        }catch{
            localStorage.removeItem("user_Data");
            return null;
        }
    });
    const [loading, setLoading] = useState(() => Boolean(
        localStorage.getItem("token")
    ));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            return;
        }

        getCurrentUser().then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem("user_Data", JSON.stringify(freshUser));
        }).catch((error) => {
            if(error.status === 401){
                setUser(null);
                localStorage.removeItem("user_Data");
                localStorage.removeItem("token");
            }
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    function login(userData, token) {

        if(!userData){
            throw new Error("Login response did not include user data");
        }
        setUser(userData);
        localStorage.setItem("user_Data", JSON.stringify(userData));
        localStorage.setItem("token", token);
        
        return userData;
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("user_Data");
        localStorage.removeItem("token");
    }

    return(
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

