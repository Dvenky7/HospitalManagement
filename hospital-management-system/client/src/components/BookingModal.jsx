import React from 'react';

export default function BookingModal({ slot, doctor, association, onConfirm, onCancel }) {
    if (!slot) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Appointment</h2>
                <div className="booking-details">
                    <p><strong>Doctor:</strong> Dr. {doctor.fullName}</p>
                    <p><strong>Hospital:</strong> {association.hospitalName}</p>
                    <p><strong>Date & Time:</strong> {new Date(slot.startTime).toLocaleString()}</p>
                    <p><strong>Consultation Fee:</strong> ${association.fee}</p>
                </div>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-btn">Confirm Booking</button>
                    <button onClick={onCancel} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
}
