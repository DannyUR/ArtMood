import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div>
            <h1>Bienvenido {user?.name}</h1>
            <p>Tu usuario: @{user?.nickname}</p>

            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
}
