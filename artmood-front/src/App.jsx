import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/public/Login';
import WorksList from './pages/WorksList';
import Home from './pages/public/Home';


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/works" 
          element={
            <PrivateRoute>   
              <WorksList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

