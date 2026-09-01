async function logout() {
    const response = await fetch('/logout', {
        method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
        window.location.href = '/';
    }
}