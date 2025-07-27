import React, { useState, useEffect } from 'react';

const getHospitals = () => JSON.parse(localStorage.getItem('hospitals')) || [];
const getAssociations = () => JSON.parse(localStorage.getItem('doctorAssociations')) || [];
const saveAssociations = (associations) => localStorage.setItem('doctorAssociations', JSON.stringify(associations));
const getAvailability = () => JSON.parse(localStorage.getItem('availabilitySlots')) || [];
const saveAvailability = (slots) => localStorage.setItem('availabilitySlots', JSON.stringify(slots));

export default function DoctorDashboard() {
    const [currentUser, setCurrentUser] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [myAssociations, setMyAssociations] = useState([]);
    const [myAvailability, setMyAvailability] = useState([]);
    const [message, setMessage] = useState('');

    const [selectedHospital, setSelectedHospital] = useState('');
    const [consultationFee, setConsultationFee] = useState('');
    const [slotDate, setSlotDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) return;

        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const doctorProfile = allUsers.find(u => u.email === loggedInUser.email && u.role === 'DOCTOR');

        if (doctorProfile) {
            setCurrentUser(doctorProfile);
            const allAssociations = getAssociations();
            setMyAssociations(allAssociations.filter(a => a.doctorId === doctorProfile.email));
            const allSlots = getAvailability();
            setMyAvailability(allSlots.filter(s => s.doctorId === doctorProfile.email));
        }

        setHospitals(getHospitals());
    }, []);

    const handleAssociate = (e) => {
        e.preventDefault();
        setMessage('');

        const hospitalToJoin = hospitals.find(h => h.id === selectedHospital);
        if (!hospitalToJoin) {
            setMessage('Please select a valid hospital.');
            return;
        }

        const hasMatchingDept = (currentUser.specializations || []).some(spec =>
            hospitalToJoin.departments.map(d => d.toLowerCase()).includes(spec.toLowerCase())
        );

        if (!hasMatchingDept) {
            setMessage(`Your specializations do not match any department at ${hospitalToJoin.name}.`);
            return;
        }

        const allAssociations = getAssociations();
        const newAssociation = {
            id: `assoc_${Date.now()}`,
            doctorId: currentUser.email,
            hospitalId: hospitalToJoin.id,
            hospitalName: hospitalToJoin.name,
            fee: consultationFee,
        };

        const updatedAssociations = [...allAssociations, newAssociation];
        saveAssociations(updatedAssociations);
        setMyAssociations(updatedAssociations.filter(a => a.doctorId === currentUser.email));
        setMessage(`Successfully associated with ${hospitalToJoin.name}.`);
    };

    const handleAddSlot = (e) => {
        e.preventDefault();
        setMessage('');

        const allSlots = getAvailability();
        const newStart = new Date(`${slotDate}T${startTime}`);
        const newEnd = new Date(`${slotDate}T${endTime}`);

        const hasConflict = allSlots.filter(s => s.doctorId === currentUser.email).some(slot => {
            const existingStart = new Date(slot.startTime);
            const existingEnd = new Date(slot.endTime);
            return newStart < existingEnd && newEnd > existingStart;
        });

        if (hasConflict) {
            setMessage('This time slot conflicts with an existing one.');
            return;
        }

        const newSlot = {
            id: `slot_${Date.now()}`,
            doctorId: currentUser.email,
            startTime: newStart.toISOString(),
            endTime: newEnd.toISOString(),
            isBooked: false,
        };

        const updatedSlots = [...allSlots, newSlot];
        saveAvailability(updatedSlots);
        setMyAvailability(updatedSlots.filter(s => s.doctorId === currentUser.email));
        setMessage('Availability slot added successfully.');
    };

    if (!currentUser) {
        return (
            <div className="dashboard-container">
                <h1>Doctor Dashboard</h1>
                <p>Loading doctor profile...</p>
                <p className="message">If this message persists, your profile may be incomplete. Please log out and register again as a Doctor to create a complete profile.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Doctor Dashboard</h1>
            <p>Welcome, Dr. {currentUser.fullName || 'N/A'}!</p>

            <div className="doctor-profile-details">
                <strong>Qualifications:</strong> {currentUser.qualifications || 'N/A'} |
                <strong> Experience:</strong> {currentUser.yearsOfExperience || '0'} years |
                <strong> Specializations:</strong> {(currentUser.specializations || []).join(', ') || 'N/A'}
            </div>

            <hr className="divider" />

            <div className="doctor-management-section">
                <div className="management-card">
                    <h2>Associate with a Hospital</h2>
                    <form onSubmit={handleAssociate}>
                        <div className="form-group">
                            <label>Select Hospital</label>
                            <select value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)} required>
                                <option value="">-- Choose a hospital --</option>
                                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Consultation Fee (per visit)</label>
                            <input type="number" value={consultationFee} onChange={e => setConsultationFee(e.target.value)} required />
                        </div>
                        <button type="submit">Associate</button>
                    </form>
                </div>
                <div className="management-card">
                    <h2>Add Availability Slot</h2>
                    <form onSubmit={handleAddSlot}>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Start Time</label>
                            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                        </div>
                        <button type="submit">Add Slot</button>
                    </form>
                </div>
            </div>

            {message && <p className="message">{message}</p>}
            <hr className="divider" />
            <div className="doctor-view-section">
                <div className="view-card">
                    <h3>My Hospital Associations</h3>
                    {myAssociations.length > 0 ? (
                        <ul>{myAssociations.map(a => <li key={a.id}>{a.hospitalName} (Fee: ${a.fee})</li>)}</ul>
                    ) : <p>You are not associated with any hospitals yet.</p>}
                </div>
                <div className="view-card">
                    <h3>My Upcoming Availability</h3>
                    {myAvailability.length > 0 ? (
                        <ul>{myAvailability.map(s => <li key={s.id}>{new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleTimeString()}</li>)}</ul>
                    ) : <p>You have not added any availability slots.</p>}
                </div>
            </div>
        </div>
    );
}
