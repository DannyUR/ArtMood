import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Bienvenido a ArtMood
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Descubre y comparte arte digital que expresa emociones. 
        Únete a nuestra comunidad creativa y conecta a través del arte.
      </p>
      <div className="space-x-4">
        <Link 
          to="/register" 
          className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-medium"
        >
          Comenzar
        </Link>
        <Link 
          to="/login" 
          className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 font-medium"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
};

export default Home;