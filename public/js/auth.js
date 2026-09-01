async function checkAuth(requiredRole) {
    try {
        const response = await fetch('/session');
        const data = await response.json();

        if (!data.success || data.role !== requiredRole) {
            window.location.href = '/';
        }
    } catch (error) {
        window.location.href = '/';
    }
}