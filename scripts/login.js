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
    window.location.href = './summary.html';
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
    window.location.href = './summary.html';
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
    const visible = password.type === 'text';

    if (password.value.length === 0) return icon.src = '../assets/icons/lock.png';
    icon.src = visible ? '../assets/icons/visability.png' : '../assets/icons/visability-off.png';
}


document.getElementById('password').addEventListener('input', togglePasswordIcon);
document.getElementById('toggleIcon').addEventListener('click', () => {
    const password = document.getElementById('password');
    if (!password.value.length) return;
    password.type = password.type === 'password' ? 'text' : 'password';
    togglePasswordIcon();
});
document.getElementById('email').addEventListener('focus', clearError);
document.getElementById('password').addEventListener('focus', clearError);
document.querySelector('.guest-btn').addEventListener('click', loginAsGuest);
animateLoginLogoFromIndex();


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


function animateLoginLogoFromIndex() {
    const logo = document.getElementById('loginLogo');

    if (!canAnimateLoginLogo(logo)) return;

    requestAnimationFrame(function () {
        playResponsiveLoginLogoAnimation(logo);
    });
}


function canAnimateLoginLogo(logo) {
    if (!logo || !shouldAnimateLoginLogo()) return false;

    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


function playResponsiveLoginLogoAnimation(logo) {
    if (window.matchMedia('(max-width: 768px)').matches) {
        playMobileLoginLogoAnimation(logo);
        return;
    }

    playLoginLogoAnimation(logo);
}


function shouldAnimateLoginLogo() {
    const shouldAnimate = sessionStorage.getItem('joinLoginLogoTransition') === 'true';

    sessionStorage.removeItem('joinLoginLogoTransition');

    return shouldAnimate;
}


function playLoginLogoAnimation(logo) {
    logo.animate(getLogoAnimationKeyframes(logo, 274), getLogoAnimationOptions());
}


function playMobileLoginLogoAnimation(logo) {
    const animatedLogo = createAnimatedLoginLogo(logo);
    const animation = animatedLogo.animate(getLogoAnimationKeyframes(animatedLogo, 100), getLogoAnimationOptions());

    logo.style.opacity = '0';
    animation.addEventListener('finish', function () {
        finishMobileLogoAnimation(logo, animatedLogo);
    });
}


function finishMobileLogoAnimation(logo, animatedLogo) {
    logo.style.opacity = '';
    animatedLogo.remove();
}


function createAnimatedLoginLogo(logo) {
    const rect = logo.getBoundingClientRect();
    const animatedLogo = document.createElement('img');

    setAnimatedLogoImage(animatedLogo);
    setAnimatedLogoPosition(animatedLogo, rect);
    document.body.appendChild(animatedLogo);

    return animatedLogo;
}


function setAnimatedLogoImage(animatedLogo) {
    animatedLogo.src = '../assets/icons/join-logo-light.png';
    animatedLogo.alt = '';
}


function setAnimatedLogoPosition(animatedLogo, rect) {
    animatedLogo.style.cssText = `position: fixed; left: ${rect.left}px; top: ${rect.top}px; width: ${rect.width}px; height: ${rect.height}px; z-index: 1000; pointer-events: none; transform-origin: center;`;
}


function getLogoAnimationKeyframes(logo, startWidth) {
    const data = getLogoAnimationData(logo, startWidth);

    return [getLogoStartFrame(data), getLogoEndFrame()];
}


function getLogoAnimationData(logo, startWidth) {
    const rect = logo.getBoundingClientRect();

    return {
        moveX: window.innerWidth / 2 - (rect.left + rect.width / 2),
        moveY: window.innerHeight / 2 - (rect.top + rect.height / 2),
        scale: startWidth / rect.width
    };
}


function getLogoStartFrame(data) {
    return {
        transform: `translate(${data.moveX}px, ${data.moveY}px) scale(${data.scale})`
    };
}


function getLogoEndFrame() {
    return {
        transform: 'translate(0, 0) scale(1)'
    };
}


function getLogoAnimationOptions() {
    return {
        duration: 650,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fill: 'both'
    };
}
