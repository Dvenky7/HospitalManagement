// File: src/pages/HomePage.jsx
import React from 'react';
import './HomePage.css';
import hospitalImage from '../assets/new-logo.jpg'; // ✅ Local image

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <img src={hospitalImage} alt="Hospital Banner" className="hero-image" />
        <div className="hero-text">
          <h1>Welcome to Hospital System</h1>
          <p>Your complete healthcare management platform. Book appointments, consult doctors, and manage hospital records with ease.</p>
          <a href="/register" className="cta-btn">Get Started</a>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h2>For Patients</h2>
          <p>Find doctors, book appointments, and view your medical history.</p>
        </div>
        <div className="feature-card">
          <h2>For Doctors</h2>
          <p>Manage schedules, view appointments, and consult patients online.</p>
        </div>
        <div className="feature-card">
          <h2>For Admins</h2>
          <p>Register hospitals, manage departments, and access real-time reports.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
