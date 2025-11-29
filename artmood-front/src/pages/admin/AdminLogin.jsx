import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const { loginAdmin } = useAdminAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await loginAdmin(email, password);

        if (!res.ok) {
            alert("Credenciales incorrectas");
            return;
        }

        navigate("/admin/dashboard");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login Admin</h2>
            <input onChange={e => setEmail(e.target.value)} />
            <input type="password" onChange={e => setPassword(e.target.value)} />
            <button>Entrar</button>
        </form>
    );
}
