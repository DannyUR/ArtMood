import { createContext, useState, useEffect, useContext } from "react";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const savedAdmin = localStorage.getItem("ADMIN_DATA");
        if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
    }, []);

    const loginAdmin = async (email, password) => {
        try {
            const res = await fetch("http://localhost:8000/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) return { ok: false };

            const data = await res.json();

            setAdmin(data);
            localStorage.setItem("ADMIN_DATA", JSON.stringify(data));

            return { ok: true };
        } catch {
            return { ok: false };
        }
    };

    const logoutAdmin = () => {
        setAdmin(null);
        localStorage.removeItem("ADMIN_DATA");
    };

    return (
        <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
