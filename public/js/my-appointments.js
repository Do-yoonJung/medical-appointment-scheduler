async function loadAppointments() {
    const appointmentList = document.getElementById('appointmentList');

    const response = await fetch('/appointments/my');
    const data = await response.json();

    if (!data.success) {
        appointmentList.innerHTML = '<p>Unable to load appointments.</p>';
        return;
    }

    if (data.appointments.length === 0) {
        appointmentList.innerHTML = `
            <div class="dashboard-card">
                <h3>No Appointments</h3>
                <p>You do not have any upcoming appointments.</p>
            </div>
        `;
        return;
    }

    appointmentList.innerHTML = '';

    data.appointments.forEach(function (appointment) {
        const card = document.createElement('div');
        card.className = 'dashboard-card appointment-card';

        card.innerHTML = `
            <h3>${appointment.doctor}</h3>
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Status:</strong> ${appointment.status}</p>
        `;

        appointmentList.appendChild(card);
    });
}

loadAppointments();