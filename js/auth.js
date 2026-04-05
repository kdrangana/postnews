const login = async (username, password) => {
    try {
        const user = await getAppUserByCredentials(username, password);
        if (user) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', user.username);
            localStorage.setItem('userRole', user.role);
            return true;
        }
    } catch (e) {
        console.error(e);
    }
    return false;
};

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
};

const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
};

const requireAuth = () => {
    if (!isAuthenticated()) {
        window.location.href = 'admin-login.html';
    }
};

const requireAdmin = () => {
    if (localStorage.getItem('userRole') !== 'admin') {
        alert("ඔබට මෙම පිටුවට පිවිසීමට අවසර නැත.");
        window.location.href = 'dashboard.html';
    }
};

const getCurrentUser = () => localStorage.getItem('currentUser') || 'Admin';
const getUserRole = () => localStorage.getItem('userRole') || 'admin';

const changePassword = async (newPassword) => {
    const username = localStorage.getItem('currentUser');
    if (!username) return false;
    try {
        return await updateUserPassword(username, newPassword);
    } catch (e) {
        console.error(e);
        return false;
    }
};
