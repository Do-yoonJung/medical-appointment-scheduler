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

            ${
    appointment.status !== 'Cancelled'
        ? `
            <a class="edit-button"
              href="/edit-appointment.html?id=${appointment._id}">
              Edit Appointment
            </a>

            <button class="cancel-button"
                onclick="cancelAppointment('${appointment._id}')">
                Cancel Appointment
            </button>
          `
        : ''
    }
        `;

        appointmentList.appendChild(card);
    });
}

loadAppointments();

async function cancelAppointment(id) {
    const confirmed = confirm(
        'Are you sure you want to cancel this appointment?'
    );

    if (!confirmed) {
        return;
    }

    const response = await fetch(`/appointments/${id}/cancel`, {
        method: 'PUT'
    });

    const data = await response.json();

    if (data.success) {
        loadAppointments();
    } else {
        alert(data.message);
    }
}