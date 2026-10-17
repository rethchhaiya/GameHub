import { useState } from "react";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }){
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user_Data");

        return saved ? JSON.parse(saved) : null;
    });

    function login(userData) {
        setUser(userData);
        localStorage.setItem("user_Data", JSON.stringify(userData));

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

