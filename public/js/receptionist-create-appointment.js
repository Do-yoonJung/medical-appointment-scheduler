const form = document.getElementById('receptionistAppointmentForm');
const patientSelect = document.getElementById('patient');
const appointmentError = document.getElementById('appointmentError');

async function loadPatients() {
    const response = await fetch('/patients');
    const data = await response.json();

    if (!data.success) {
        appointmentError.textContent = 'Unable to load patients.';
        return;
    }

    data.patients.forEach(function (patient) {
        const option = document.createElement('option');

        option.value = patient._id;
        option.textContent = `${patient.name} (${patient.email})`;

        patientSelect.appendChild(option);
    });
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const patientId = patientSelect.value;
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const response = await fetch('/appointments/receptionist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            patientId: patientId,
            doctor: doctor,
            date: date,
            time: time
        })
    });

    const data = await response.json();

    if (data.success) {
        window.location.href = '/receptionist-appointment-success.html';
    } else {
        appointmentError.textContent = data.message;
    }
});

loadPatients();