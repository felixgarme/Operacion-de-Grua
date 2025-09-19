async function safeRedirect(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
            window.location.href = url;
        } else {
            window.location.href = '../menu_principal/error.html';
        }
    } catch (e) {
        window.location.href = '../menu_principal/error.html';
    }
}