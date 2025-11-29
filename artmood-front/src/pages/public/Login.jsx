import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const user = await login(email, password);

            // Redirección por rol
            if (user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/user");
            }

        } catch (error) {
            setError("Correo o contraseña incorrectos");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
            <button type="submit">Ingresar</button>
            {error && <p style={{color:"red"}}>{error}</p>}
        </form>
    );
}
