import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Import the new home page
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

// Navbar component remains the same
function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Hospital System</Link>
            <div className="navbar-links">
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span>Welcome, {user.name}!</span>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main>
                    <Routes>
                        {/* The default route is now HomePage for non-logged-in users */}
                        <Route path="/" element={localStorage.getItem('user') ? <DashboardPage /> : <HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
