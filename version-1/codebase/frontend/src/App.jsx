import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Comonents/MainPages/HomePage';
import LoginPage from './Comonents/MainPages/LoginPage';
import SignupPage from './Comonents/MainPages/SignupPage';
import InfluencerPage from './Comonents/MainPages/SignUpForms/InfluencerPage';
import AlmostPage from './Comonents/MainPages/SignUpForms/AlmostPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/influencer" element={<InfluencerPage />} />
        <Route path="/almostthere" element={<AlmostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
