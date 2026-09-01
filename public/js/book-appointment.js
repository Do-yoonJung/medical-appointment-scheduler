const appointmentForm = document.getElementById('appointmentForm');
const appointmentError = document.getElementById('appointmentError');

appointmentForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const response = await fetch('/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            doctor: doctor,
            date: date,
            time: time
        })
    });

    const data = await response.json();

    if (data.success) {
        window.location.href = '/booking-success.html';
    } else {
        appointmentError.textContent = data.message;
    }
});