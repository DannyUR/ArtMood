// components/common/Footer.jsx - VERSIÓN MEJORADA
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Archivo CSS para estilos personalizados

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Sección de Enlaces */}
        <div className="footer-links">
          <div className="footer-section">
            <h4>Navegación</h4>
            <Link to="/" className="footer-link">Inicio</Link>
            <Link to="/about" className="footer-link">Acerca de</Link>
            <Link to="/gallery" className="footer-link">Galería</Link>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <Link to="/privacy" className="footer-link">Privacidad</Link>
            <Link to="/terms" className="footer-link">Términos</Link>
            <Link to="/cookies" className="footer-link">Cookies</Link>
          </div>
          
          <div className="footer-section">
            <h4>Comunidad</h4>
            <a href="#" className="footer-link">Instagram</a>
            <a href="#" className="footer-link">Twitter</a>
            <a href="#" className="footer-link">Discord</a>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 ArtMood - Galería interactiva de arte digital
          </p>
          <p className="developers">
            Desarrollado con ❤️ por Daniela Uscanga & Rafael Luján
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;