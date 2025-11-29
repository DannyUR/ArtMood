import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", nickname:"", email:"", password:"" });
  const [error, setError] = useState("");

  const handle = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      navigate("/login");
    } catch(err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Error al registrar");
    }
  };

  return (
    <div style={{maxWidth:500, margin:"30px auto"}}>
      <h2>Registro</h2>
      {error && <div style={{color:"red"}}>{error}</div>}
      <form onSubmit={submit}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handle} />
        <input name="nickname" placeholder="Nickname" value={form.nickname} onChange={handle} />
        <input name="email" placeholder="Correo" value={form.email} onChange={handle} />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handle} />
        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  );
}
