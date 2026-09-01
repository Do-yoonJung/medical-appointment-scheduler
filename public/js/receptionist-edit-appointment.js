const editForm = document.getElementById('editAppointmentForm');
const editError = document.getElementById('editError');

const params = new URLSearchParams(window.location.search);
const appointmentId = params.get('id');

async function loadAppointment() {
    const response = await fetch(`/appointments/${appointmentId}`);
    const data = await response.json();

    if (!data.success) {
        editError.textContent = data.message;
        return;
    }

    document.getElementById('patient').value =
        `${data.appointment.patient.name} (${data.appointment.patient.email})`;

    document.getElementById('doctor').value =
        data.appointment.doctor;

    document.getElementById('date').value =
        data.appointment.date;

    document.getElementById('time').value =
        data.appointment.time;
}

editForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    editError.textContent = '';

    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const response = await fetch(
        `/appointments/receptionist/${appointmentId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doctor: doctor,
                date: date,
                time: time
            })
        }
    );

    const data = await response.json();

    if (data.success) {
        window.location.href = '/manage-appointments.html';
    } else {
        editError.textContent = data.message;
    }
});

loadAppointment();