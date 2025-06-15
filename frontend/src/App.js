import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HouseholdPage from './pages/HouseholdPage';
import ResidentPage from './pages/ResidentPage';
import VehiclePage from './pages/VehiclePage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import CollectionPeriodPage from './pages/CollectionPeriodPage';
import FeedbackPage from './pages/FeedbackPage';
import FeePage from './pages/FeePage';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            {/* Redirect from root to household page */}
            <Route path="/" element={<Navigate to="/household" replace />} />
            
            {/* Main routes */}
            <Route path="/household" element={<HouseholdPage />} />
            <Route path="/resident" element={<ResidentPage />} />
            <Route path="/vehicle" element={<VehiclePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/collection-period" element={<CollectionPeriodPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/fee" element={<FeePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
