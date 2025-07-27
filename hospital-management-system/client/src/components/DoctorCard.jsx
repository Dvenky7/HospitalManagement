import React from 'react';

export default function DoctorCard({ doctor, associations, availability, onBookSlot }) {

    const doctorAssociations = associations.filter(a => a.doctorId === doctor.email);

    return (
        <div className="doctor-card">
            <div className="doctor-info">
                <h3>Dr. {doctor.fullName}</h3>
                <p><strong>Specializations:</strong> {(doctor.specializations || []).join(', ')}</p>
                <p><strong>Experience:</strong> {doctor.yearsOfExperience || 'N/A'} years</p>
                <p><strong>Qualifications:</strong> {doctor.qualifications || 'N/A'}</p>
            </div>
            <div className="doctor-availability">
                <h4>Availability</h4>
                {doctorAssociations.length > 0 ? (
                    doctorAssociations.map(assoc => {
                        const hospitalSlots = availability.filter(slot =>
                            slot.doctorId === doctor.email &&
                            !slot.isBooked &&
                            new Date(slot.startTime) > new Date()
                        );

                        return (
                            <div key={assoc.id} className="hospital-section">
                                <h5>{assoc.hospitalName} (Fee: ${assoc.fee})</h5>
                                <div className="slots-container">
                                    {hospitalSlots.length > 0 ? (
                                        hospitalSlots.map(slot => (
                                            <button
                                                key={slot.id}
                                                className="slot-button"
                                                onClick={() => onBookSlot(slot, doctor, assoc)}
                                            >
                                                {new Date(slot.startTime).toLocaleString()}
                                            </button>
                                        ))
                                    ) : (
                                        <p>No available slots.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>This doctor is not yet associated with any hospitals.</p>
                )}
            </div>
        </div>
    );
}
