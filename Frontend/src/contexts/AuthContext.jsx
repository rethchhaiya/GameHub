import { useState } from "react";
import { AuthContext } from "./authContext";

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
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

