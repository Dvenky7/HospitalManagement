import React from 'react';
import { Navigate } from 'react-router-dom';
import PatientDashboard from '../components/PatientDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import AdminDashboard from '../components/AdminDashboard';

export default function DashboardPage() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.role) {
        return <Navigate to="/login" />;
    }

    const userRole = user.role.toUpperCase();

    switch (userRole) {
        case 'PATIENT':
            return <PatientDashboard />;
        case 'DOCTOR':
            return <DoctorDashboard />;
        case 'HOSPITAL_ADMIN':
            return <AdminDashboard />;
        default:
            console.error("Unknown user role:", user.role);
            return <Navigate to="/login" />;
    }
}
