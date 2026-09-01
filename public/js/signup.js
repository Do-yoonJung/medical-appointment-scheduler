const signupForm = document.getElementById('signupForm');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');

signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    signupError.textContent = '';
    signupSuccess.textContent = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (data.success) {
        signupSuccess.textContent = 'Account created successfully. Redirecting to login...';

        setTimeout(function () {
            window.location.href = '/';
        }, 1200);

    } else {
        signupError.textContent = data.message;
    }
});