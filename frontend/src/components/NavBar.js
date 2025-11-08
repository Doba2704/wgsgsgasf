// --- (НОВИЙ ФАЙЛ) frontend/src/components/NavBar.js (v15.0) ---
import React from 'react';

const NavItem = ({ label, icon, page, activePage, onNavClick }) => (
  <li 
    className={`navbar-item ${activePage === page ? 'active' : ''}`}
    onClick={() => onNavClick(page)}
  >
    <span className="navbar-icon">{icon}</span>
    <span className="navbar-label">{label}</span>
  </li>
);

const NavBar = ({ activePage, onNavClick }) => {
  return (
    <nav className="navbar-bottom">
      <ul className="navbar-menu">
        <NavItem 
          label="Огляд" 
          icon="🏠" 
          page="home" 
          activePage={activePage} 
          onNavClick={onNavClick} 
        />
        <NavItem 
          label="Платежі" 
          icon="💸" 
          page="payments" 
          activePage={activePage} 
          onNavClick={onNavClick} 
        />
        <NavItem 
          label="Активи" 
          icon="📈" 
          page="wealth" 
          activePage={activePage} 
          onNavClick={onNavClick} 
        />
        <NavItem 
          label="Сервіси" 
          icon="⚙️" 
          page="services" 
          activePage={activePage} 
          onNavClick={onNavClick} 
        />
        <NavItem 
          label="Профіль" 
          icon="👤" 
          page="profile" 
          activePage={activePage} 
          onNavClick={onNavClick} 
        />
      </ul>
    </nav>
  );
};

export default NavBar;