import React, { useState, useEffect } from 'react';

const getHospitals = () => JSON.parse(localStorage.getItem('hospitals')) || [];
const saveHospitals = (hospitals) => localStorage.setItem('hospitals', JSON.stringify(hospitals));

export default function AdminDashboard() {
    const [myHospital, setMyHospital] = useState(null);
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalLocation, setHospitalLocation] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const allHospitals = getHospitals();
        const adminHospital = allHospitals.find(h => h.adminId === currentUser.email);

        if (adminHospital) {
            setMyHospital(adminHospital);
        }
    }, []);

    const handleCreateHospital = (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const allHospitals = getHospitals();

        const newHospital = {
            id: `hosp_${Date.now()}`,
            name: hospitalName,
            location: hospitalLocation,
            adminId: currentUser.email,
            departments: []
        };

        saveHospitals([...allHospitals, newHospital]);
        setMyHospital(newHospital);
    };

    const handleAddDepartment = (e) => {
        e.preventDefault();
        setMessage('');

        if (!departmentName.trim()) {
            setMessage('Department name cannot be empty.');
            return;
        }

        const allHospitals = getHospitals();
        const hospitalIndex = allHospitals.findIndex(h => h.id === myHospital.id);

        if (hospitalIndex === -1) {
            setMessage('Error: Could not find your hospital.');
            return;
        }

        const updatedHospital = { ...allHospitals[hospitalIndex] };

        if (updatedHospital.departments.some(dep => dep.toLowerCase() === departmentName.toLowerCase())) {
            setMessage('This department already exists.');
            return;
        }

        updatedHospital.departments.push(departmentName.trim());
        allHospitals[hospitalIndex] = updatedHospital;
        saveHospitals(allHospitals);

        setMyHospital(updatedHospital);
        setDepartmentName('');
    };

    if (!myHospital) {
        return (
            <div className="dashboard-container">
                <h1>Register Your Hospital</h1>
                <p>You have not registered a hospital yet. Please enter the details below.</p>
                <form onSubmit={handleCreateHospital} className="dashboard-form">
                    <div className="form-group">
                        <label>Hospital Name</label>
                        <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" value={hospitalLocation} onChange={(e) => setHospitalLocation(e.target.value)} required />
                    </div>
                    <button type="submit">Create Hospital</button>
                </form>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>{myHospital.name}</h1>
            <p className="hospital-location">{myHospital.location}</p>
            <hr className="divider" />
            <h2>Manage Departments</h2>
            <div className="departments-section">
                <div className="department-list">
                    <h3>Existing Departments</h3>
                    {myHospital.departments.length > 0 ? (
                        <ul>
                            {myHospital.departments.map((dept, index) => <li key={index}>{dept}</li>)}
                        </ul>
                    ) : (
                        <p>No departments have been added yet.</p>
                    )}
                </div>
                <div className="add-department-form">
                    <h3>Add New Department</h3>
                    <form onSubmit={handleAddDepartment}>
                        <div className="form-group">
                            <label>Department Name</label>
                            <input type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} required />
                        </div>
                        <button type="submit">Add Department</button>
                        {message && <p className="message">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
