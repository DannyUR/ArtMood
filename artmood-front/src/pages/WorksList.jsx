import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function WorksList() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/works?page=${page}`)
      .then(res => {
        // si la API retorna paginación como data.data o data, ajústalo
        const data = res.data.data ? res.data.data : res.data;
        setWorks(data.data ?? data); // maneja diferentes formatos
      })
      .catch(err => console.error(err))
      .finally(()=>setLoading(false));
  }, [page]);

  if (loading) return <p>Cargando obras...</p>;

  return (
    <div>
      <h2>Galería</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
        {works.map(w => (
          <div key={w.id_obra ?? w.id} style={{border:'1px solid #ddd',padding:12,borderRadius:8}}>
            <img src={`/storage/${w.image}`} alt={w.title} style={{width:'100%',height:150,objectFit:'cover'}}/>
            <h3>{w.title}</h3>
            <p>{w.description}</p>
            <small>Autor: {w.user?.name ?? w.user}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
