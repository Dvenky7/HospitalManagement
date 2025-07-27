import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import BookingModal from './BookingModal';

const getDoctors = () => JSON.parse(localStorage.getItem('users'))?.filter(u => u.role === 'DOCTOR') || [];
const getHospitals = () => JSON.parse(localStorage.getItem('hospitals')) || [];
const getAssociations = () => JSON.parse(localStorage.getItem('doctorAssociations')) || [];
const getAvailability = () => JSON.parse(localStorage.getItem('availabilitySlots')) || [];
const getAppointments = () => JSON.parse(localStorage.getItem('appointments')) || [];
const saveAvailability = (slots) => localStorage.setItem('availabilitySlots', JSON.stringify(slots));
const saveAppointments = (appointments) => localStorage.setItem('appointments', JSON.stringify(appointments));

export default function PatientDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [associations, setAssociations] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [myHistory, setMyHistory] = useState([]);

    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [specializationFilter, setSpecializationFilter] = useState('');
    const [hospitalFilter, setHospitalFilter] = useState('');

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedAssociation, setSelectedAssociation] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const allDoctors = getDoctors();
        setDoctors(allDoctors);
        setFilteredDoctors(allDoctors);
        setHospitals(getHospitals());
        setAssociations(getAssociations());
        setAvailability(getAvailability());

        const currentUser = JSON.parse(localStorage.getItem('user'));
        setMyHistory(getAppointments().filter(a => a.patientEmail === currentUser.email));
    }, []);

    const handleFilterChange = () => {
        let tempDoctors = [...doctors];

        if (specializationFilter) {
            tempDoctors = tempDoctors.filter(doc =>
                (doc.specializations || []).some(spec =>
                    spec.toLowerCase().includes(specializationFilter.toLowerCase())
                )
            );
        }

        if (hospitalFilter) {
            const associatedDoctorEmails = associations
                .filter(a => a.hospitalId === hospitalFilter)
                .map(a => a.doctorId);
            tempDoctors = tempDoctors.filter(doc => associatedDoctorEmails.includes(doc.email));
        }

        setFilteredDoctors(tempDoctors);
    };

    useEffect(() => {
        handleFilterChange();
    }, [specializationFilter, hospitalFilter]);

    const handleBookSlot = (slot, doctor, association) => {
        setSelectedSlot(slot);
        setSelectedDoctor(doctor);
        setSelectedAssociation(association);
    };

    const handleConfirmBooking = () => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const allSlots = getAvailability();
        const allAppointments = getAppointments();

        const slotIndex = allSlots.findIndex(s => s.id === selectedSlot.id);
        allSlots[slotIndex].isBooked = true;
        saveAvailability(allSlots);

        const newAppointment = {
            id: `appt_${Date.now()}`,
            slotId: selectedSlot.id,
            patientEmail: currentUser.email,
            doctorName: selectedDoctor.fullName,
            hospitalName: selectedAssociation.hospitalName,
            fee: selectedAssociation.fee,
            doctorRevenue: selectedAssociation.fee * 0.6,
            hospitalRevenue: selectedAssociation.fee * 0.4,
            bookedAt: new Date().toISOString(),
        };
        saveAppointments([...allAppointments, newAppointment]);

        setAvailability(allSlots);
        setMyHistory([...myHistory, newAppointment]);
        setMessage(`Appointment confirmed with Dr. ${selectedDoctor.fullName}!`);
        handleCancelBooking();
    };

    const handleCancelBooking = () => {
        setSelectedSlot(null);
        setSelectedDoctor(null);
        setSelectedAssociation(null);
    };

    return (
        <div className="dashboard-container patient-dashboard">
            <h1>Patient Dashboard</h1>
            <p>Welcome! Find and book your next appointment.</p>
            {message && <p className="message success">{message}</p>}

            <div className="search-and-filter">
                <h2>Find a Doctor</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Filter by specialization..."
                        value={specializationFilter}
                        onChange={e => setSpecializationFilter(e.target.value)}
                    />
                    <select value={hospitalFilter} onChange={e => setHospitalFilter(e.target.value)}>
                        <option value="">Filter by hospital...</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="doctor-list">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doc => (
                        <DoctorCard
                            key={doc.email}
                            doctor={doc}
                            associations={associations}
                            availability={availability}
                            onBookSlot={handleBookSlot}
                        />
                    ))
                ) : (
                    <p>No doctors found matching your criteria.</p>
                )}
            </div>

            <hr className="divider" />

            <div className="appointment-history">
                <h2>My Appointment History</h2>
                {myHistory.length > 0 ? (
                    <ul>
                        {myHistory.map(appt => (
                            <li key={appt.id}>
                                Appointment with <strong>Dr. {appt.doctorName}</strong> at <strong>{appt.hospitalName}</strong> on {new Date(appt.bookedAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have no past appointments.</p>
                )}
            </div>

            <BookingModal
                slot={selectedSlot}
                doctor={selectedDoctor}
                association={selectedAssociation}
                onConfirm={handleConfirmBooking}
                onCancel={handleCancelBooking}
            />
        </div>
    );
}
