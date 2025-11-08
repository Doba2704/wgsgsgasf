// --- (ЗАМІНИТИ) frontend/src/components/Dashboard.js (v18.0) ---
import React, { useState } from 'react';

// Імпорти...
import Overview from './Overview';
import Transactions from './Transactions';
import Budget from './Budget';
import Wealth from './Wealth';
import Profile from './Profile';
import Settings from './Settings';

import CardDetails from './CardDetails';
import CardFreeze from './CardFreeze';
import CardSecurity from './CardSecurity';
import CardLimits from './CardLimits';
import CardPin from './CardPin';
import TransactionDetails from './TransactionDetails';
import CardTariff from './CardTariff'; // <-- (НОВЕ v18.0)

import DepositModal from './DepositModal';
import TransferModal from './TransferModal';
import OpenAccountModal from './OpenAccountModal';
import PayBillModal from './PayBillModal';
import ExchangeModal from './ExchangeModal';

const Dashboard = ({ email, onLogout }) => {
  const [activePage, setActivePage] = useState('overview');
  const [subPage, setSubPage] = useState(null); 
  const [modal, setModal] = useState(null); 
  const [viewProps, setViewProps] = useState({ timestamp: Date.now() });

  const navigateTo = (page, props = {}) => {
    if (['overview', 'transactions', 'budget', 'wealth', 'profile'].includes(page)) {
      setActivePage(page);
      setSubPage(null); 
      setViewProps({ timestamp: Date.now(), ...props });
      return;
    }
    if (page.endsWith('Modal')) {
      setModal({ type: page, ...props });
      return;
    }
    setSubPage({ page: page, ...props });
  };
  
  const handleBack = () => {
    setSubPage(null);
    // (ВАЖЛИВО) Оновлюємо дані після повернення, 
    // на випадок, якщо тариф змінився
    setViewProps({ timestamp: Date.now() });
  };
  
  const handleCloseModal = () => {
    setModal(null);
  };
  
  const handleDataUpdate = () => {
      setViewProps({ timestamp: Date.now() });
  };

  const renderPage = () => {
    const defaultProps = { 
      email: email, 
      onLogout: onLogout, 
      navigateTo: navigateTo, 
      viewProps: viewProps 
    };
    switch (activePage) {
      case 'overview': return <Overview {...defaultProps} />;
      case 'transactions': return <Transactions {...defaultProps} />;
      case 'budget': return <Budget {...defaultProps} />;
      case 'wealth': return <Wealth {...defaultProps} />;
      case 'profile': return <Profile {...defaultProps} />;
      default: return <Overview {...defaultProps} />;
    }
  };

  const renderSubPage = () => {
    if (!subPage) return null;
    const defaultProps = { 
      onBack: handleBack, 
      onLogout: onLogout, 
      navigateTo: navigateTo, 
      onUpdate: handleDataUpdate, 
      ...subPage,
      email: email 
    };
    switch (subPage.page) {
      case 'settings': return <Settings {...defaultProps} />;
      case 'cardDetails': return <CardDetails {...defaultProps} />;
      case 'cardFreeze': return <CardFreeze {...defaultProps} />;
      case 'cardSecurity': return <CardSecurity {...defaultProps} />;
      case 'cardLimits': return <CardLimits {...defaultProps} />;
      case 'cardPin': return <CardPin {...defaultProps} />;
      case 'transactionDetails': return <TransactionDetails {...defaultProps} />;
      case 'cardTariff': return <CardTariff {...defaultProps} />; // <-- (НОВЕ v18.0)
      default:
        return (
          <div className="sub-page">
            <button onClick={handleBack} className="back-button">←</button>
            <h1>Помилка 404</h1>
          </div>
        );
    }
  };
  
  const renderModal = () => {
    if (!modal) return null;
    const defaultProps = { 
      onClose: handleCloseModal, 
      onLogout: onLogout, 
      onUpdate: handleDataUpdate, 
      ...modal 
    };
    switch (modal.type) {
      case 'depositModal': return <DepositModal {...defaultProps} />;
      case 'transferModal': return <TransferModal {...defaultProps} />;
      case 'openAccountModal': return <OpenAccountModal {...defaultProps} />;
      case 'payBillModal': return <PayBillModal {...defaultProps} />;
      case 'exchangeModal': return <ExchangeModal {...defaultProps} />;
      default: return null;
    }
  };
  
  const pageToShow = renderSubPage();

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content" style={{ display: pageToShow ? 'none' : 'block' }}>
        {renderPage()}
      </div>
      {pageToShow && (
        <div className="dashboard-content" style={{ animation: 'slideIn 0.3s ease-out' }}>
          {pageToShow}
        </div>
      )}
      {renderModal()}
      {!subPage && (
        <div className="navbar-bottom">
          <ul className="navbar-menu">
            <li><a href="#overview" onClick={() => navigateTo('overview')} className={`navbar-item ${activePage === 'overview' ? 'active' : ''}`}>
              <span className="navbar-icon">🏠</span><span className="navbar-label">Головна</span>
            </a></li>
            <li><a href="#transactions" onClick={() => navigateTo('transactions')} className={`navbar-item ${activePage === 'transactions' ? 'active' : ''}`}>
              <span className="navbar-icon">🧾</span><span className="navbar-label">Історія</span>
            </a></li>
            <li><a href="#services" onClick={() => navigateTo('transferModal')} className="navbar-item services-button">
              <span className="navbar-icon main-button">⇄</span>
            </a></li>
            <li><a href="#budget" onClick={() => navigateTo('budget')} className={`navbar-item ${activePage === 'budget' ? 'active' : ''}`}>
              <span className="navbar-icon">📊</span><span className="navbar-label">Бюджет</span>
            </a></li>
            <li><a href="#wealth" onClick={() => navigateTo('wealth')} className={`navbar-item ${activePage === 'wealth' ? 'active' : ''}`}>
              <span className="navbar-icon">🏦</span><span className="navbar-label">Сервіси</span>
            </a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;