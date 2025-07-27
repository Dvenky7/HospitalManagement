import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === formData.email && user.password === formData.password);

        if (foundUser) {
            const userToSave = {
                name: foundUser.fullName,
                email: foundUser.email,
                role: foundUser.role
            };
            localStorage.setItem('user', JSON.stringify(userToSave));
            navigate('/dashboard');
            window.location.reload();
        } else {
            setMessage('Invalid email or password.');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p className="message">{message}</p>}
            <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}
