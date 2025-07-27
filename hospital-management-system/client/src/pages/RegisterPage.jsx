import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'PATIENT',
        qualifications: '',
        yearsOfExperience: '',
        specializations: '',
        gender: '',
        dateOfBirth: '',
        uniqueId: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === formData.email);

        if (userExists) {
            setMessage('Email already exists. Please use a different email.');
            return;
        }

        const newUser = {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            role: formData.role,
        };

        if (formData.role === 'DOCTOR') {
            newUser.qualifications = formData.qualifications;
            newUser.yearsOfExperience = formData.yearsOfExperience;
            newUser.specializations = formData.specializations.split(',').map(s => s.trim());
        } else if (formData.role === 'PATIENT') {
            newUser.gender = formData.gender;
            newUser.dateOfBirth = formData.dateOfBirth;
            newUser.uniqueId = formData.uniqueId;
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="form-container">
            <h2>Register New User</h2>
            <form onSubmit={handleSubmit}>
                {/* --- "Register as" block moved to the top --- */}
                <div className="form-group">
                    <label>Register as</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="HOSPITAL_ADMIN">Hospital Admin</option>
                    </select>
                </div>

                {/* --- Standard Fields --- */}
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>

                {/* --- Patient-Specific Fields --- */}
                {formData.role === 'PATIENT' && (
                    <>
                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">-- Select Gender --</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Unique ID (e.g., Aadhar, Passport)</label>
                            <input type="text" name="uniqueId" value={formData.uniqueId} onChange={handleChange} required />
                        </div>
                    </>
                )}

                {/* --- Doctor-Specific Fields --- */}
                {formData.role === 'DOCTOR' && (
                    <>
                        <div className="form-group">
                            <label>Qualifications (e.g., MBBS, MD)</label>
                            <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Specializations (comma-separated)</label>
                            <input type="text" name="specializations" placeholder="e.g., Cardiology, Orthopedics" value={formData.specializations} onChange={handleChange} required />
                        </div>
                    </>
                )}

                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
            <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}
