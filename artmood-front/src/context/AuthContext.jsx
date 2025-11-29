import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // LOGIN
    const login = async (email, password) => {
        const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();

        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        setUser(data.user);

        return data.user;
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// HOOK QUE SE USA EN TODAS LAS PÁGINAS
export function useAuth() {
    return useContext(AuthContext);
}
