/**
 * Checks the login data.
 */
async function checkLogin() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (hasInvalidLoginInput(email, password)) return showLoginError('Check your email and password. Please try again.');

    const userEntry = await getUserByLogin(email.value.trim(), password.value.trim());

    if (!userEntry) return showLoginError('Check your email and password. Please try again.');

    completeUserLogin(userEntry);
}


/**
 * Checks if the login inputs are empty.
 * @param {Object} email - The email input.
 * @param {Object} password - The password input.
 * @returns {boolean} True if the input is invalid.
 */
function hasInvalidLoginInput(email, password) {
    const invalid = !email.value.trim() || !password.value.trim();

    email.classList.toggle('error', invalid);
    password.classList.toggle('error', invalid);

    return invalid;
}


/**
 * Gets a user by email and password.
 * @param {string} email - The email.
 * @param {string} password - The password.
 * @returns {Object} The user entry.
 */
async function getUserByLogin(email, password) {
    const response = await fetch(getDatabaseUrl('users'));
    const users = await response.json();

    if (!users) return null;

    const matchingUser = getMatchingUser(users, email, password);

    return matchingUser ? getUserEntry(matchingUser) : null;
}


/**
 * Finds the matching user.
 * @param {Object} users - The users.
 * @param {string} email - The email.
 * @param {string} password - The password.
 * @returns {Array} The matching user.
 */
function getMatchingUser(users, email, password) {
    return Object.entries(users).find(function ([, user]) {
        return user.email === email && user.password === password;
    });
}


/**
 * Creates a user entry object.
 * @param {Array} userEntry - The user entry.
 * @returns {Object} The user entry object.
 */
function getUserEntry(userEntry) {
    return {
        id: userEntry[0],
        user: userEntry[1]
    };
}


/**
 * Finishes the user login.
 * @param {Object} userEntry - The user entry.
 */
function completeUserLogin(userEntry) {
    setActiveUser(userEntry.id, userEntry.user);
    sessionStorage.setItem('joinShowMobileGreeting', 'true');
    window.location.href = './subpages/summary.html';
}


/**
 * Logs in as guest.
 */
async function loginAsGuest() {
    try {
        setGuestButtonDisabled(true);
        clearError();
        await completeGuestLogin();
    } catch (error) {
        showLoginError('Guest login is currently not available. Please try again.');
    } finally {
        setGuestButtonDisabled(false);
    }
}


/**
 * Disables or enables the guest button.
 * @param {boolean} isDisabled - True if the button is disabled.
 */
function setGuestButtonDisabled(isDisabled) {
    const guestButton = document.querySelector('.guest-btn');

    guestButton.disabled = isDisabled;
}


/**
 * Finishes the guest login.
 */
async function completeGuestLogin() {
    const guestUser = await resetGuestUser();

    setActiveUser(guestUserId, guestUser);
    sessionStorage.setItem('joinShowMobileGreeting', 'true');
    window.location.href = './subpages/summary.html';
}


/**
 * Resets the guest user.
 * @returns {Object} The guest user.
 */
async function resetGuestUser() {
    const guestUser = await getGuestUser();
    guestUser.contacts = await getGlobalData('contacts');
    guestUser.tasks = await getGlobalData('tasks');

    await putGuestUser(guestUser);

    return guestUser;
}


/**
 * Gets the guest user.
 * @returns {Object} The guest user.
 */
async function getGuestUser() {
    const response = await fetch(getUserDatabaseUrl(guestUserId));
    const guestUser = await response.json();

    return guestUser || getDefaultGuestUser();
}


/**
 * Gets default guest data.
 * @returns {Object} The default guest user.
 */
function getDefaultGuestUser() {
    return {
        email: 'guest@login.com',
        name: 'Guest',
        password: 'guest123!',
        userColor: 'var(--profile-blue)'
    };
}


/**
 * Gets global data from the database.
 * @param {string} path - The database path.
 * @returns {Object} The data.
 */
async function getGlobalData(path) {
    const response = await fetch(getDatabaseUrl(path));
    const data = await response.json();

    return data || {};
}


/**
 * Saves the guest user in the database.
 * @param {Object} guestUser - The guest user.
 */
async function putGuestUser(guestUser) {
    await fetch(getUserDatabaseUrl(guestUserId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guestUser)
    });
}


/**
 * Shows a login error.
 * @param {string} message - The error message.
 */
function showLoginError(message) {
    document.getElementById('email').classList.add('error');
    document.getElementById('password').classList.add('error');

    const errorMsg = document.getElementById('errorMessage');

    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}


/**
 * Changes the password icon.
 */
function togglePasswordIcon() {
    const password = document.getElementById('password');
    const icon = document.getElementById('toggleIcon');
    const toggleButton = document.getElementById('togglePasswordButton');
    const visible = password.type === 'text';

    toggleButton.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    if (password.value.length === 0) return icon.src = './assets/icons/lock.png';
    icon.src = visible ? './assets/icons/visability.png' : './assets/icons/visability-off.png';
}


document.getElementById('password').addEventListener('input', togglePasswordIcon);
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    checkLogin();
});
document.getElementById('togglePasswordButton').addEventListener('click', () => {
    const password = document.getElementById('password');
    if (!password.value.length) return;
    password.type = password.type === 'password' ? 'text' : 'password';
    togglePasswordIcon();
});
document.getElementById('email').addEventListener('focus', clearError);
document.getElementById('password').addEventListener('focus', clearError);
document.querySelector('.guest-btn').addEventListener('click', loginAsGuest);


/**
 * Clears the login error.
 */
function clearError() {
    document.getElementById('email').classList.remove('error');
    document.getElementById('password').classList.remove('error');
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.classList.remove('show');
    errorMsg.textContent = '';
}


const introLayer = document.querySelector('.intro-layer');


/**
 * Finishes the intro and reveals the complete login page.
 */
function finishLoginIntro() {
    document.body.classList.remove('intro-running');
    introLayer?.remove();
}


if (!introLayer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishLoginIntro();
} else {
    introLayer.addEventListener('animationend', finishLoginIntro, { once: true });
}
