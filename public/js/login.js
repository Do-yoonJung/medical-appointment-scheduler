const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (data.success) {
        if (data.role === 'patient') {
            window.location.href = '/patient-dashboard.html';
        } else if (data.role === 'receptionist') {
            window.location.href = '/receptionist-dashboard.html';
        }
    } else {
        errorMessage.textContent = data.message;
    }
});