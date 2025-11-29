import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{padding:16}}>
        {children}
      </main>
    </div>
  );
}
