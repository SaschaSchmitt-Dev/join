/**
 * Updates a password field icon based on its content and visibility state.
 * @param {string} inputId - The id of the password input.
 * @param {string} iconId - The id of the icon image.
 */
function togglePasswordIcon(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    const toggleButton = icon.closest('button');
    const visible = input.type === 'text';

    toggleButton.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    if (input.value.length === 0) return icon.src = '../assets/icons/lock.png';
    icon.src = visible ? '../assets/icons/visability.png' : '../assets/icons/visability-off.png';
}


/**
 * Switches a password field between hidden and clear text.
 * @param {string} inputId - The id of the password input.
 * @param {string} iconId - The id of the icon image.
 */
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);

    if (!input.value.length) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    togglePasswordIcon(inputId, iconId);
}


document.getElementById('password').addEventListener('input', () => togglePasswordIcon('password', 'passwordIcon'));
document.getElementById('passwordToggle').addEventListener('click', () => togglePasswordVisibility('password', 'passwordIcon'));

document.getElementById('confirmPassword').addEventListener('input', () => togglePasswordIcon('confirmPassword', 'confirmPasswordIcon'));
document.getElementById('confirmPasswordToggle').addEventListener('click', () => togglePasswordVisibility('confirmPassword', 'confirmPasswordIcon'));


/**
 * Enables or disables the signup button based on the terms checkbox state.
 */
function updateSignupButtonState() {
    const termsCheckbox = document.getElementById('termsCheckbox');
    const signupBtn = document.getElementById('signupBtn');
    signupBtn.disabled = !termsCheckbox.checked;
}


document.getElementById('termsCheckbox').addEventListener('change', updateSignupButtonState);
updateSignupButtonState();


/**
 * Checks whether the password and confirm password fields match.
 * Marks the confirm password field and shows an error message if they do not.
 * @returns {boolean} True if the passwords match.
 */
function checkPasswordsMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const matches = password.value === confirmPassword.value;

    confirmPassword.classList.toggle('error', !matches);
    document.getElementById('errorMessage').textContent = matches ? '' : 'Your passwords don\'t match. Please try again.';

    return matches;
}


/**
 * Clears the signup password error state.
 */
function clearPasswordError() {
    document.getElementById('confirmPassword').classList.remove('error');
    document.getElementById('errorMessage').textContent = '';
}


document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    handleSignup();
});

document.getElementById('password').addEventListener('input', clearPasswordError);
document.getElementById('confirmPassword').addEventListener('input', clearPasswordError);


/**
 * Handles the signup form submission: validates the input, creates the
 * new user in the database and redirects to the login page.
 */
async function handleSignup() {
    if (!checkPasswordsMatch()) return;

    const signupBtn = document.getElementById('signupBtn');
    signupBtn.disabled = true;

    try {
        const email = document.getElementById('email').value.trim();

        if (await isEmailTaken(email)) return showSignupError('An account with this email already exists.');

        await createNewUser(getSignupFormData());
        showSignupToast();
    } catch (error) {
        showSignupError('Signup is currently not available. Please try again.');
    } finally {
        signupBtn.disabled = !document.getElementById('termsCheckbox').checked;
    }
}


/**
 * Reads the signup form fields into a new user object.
 * @returns {Object} The new user data.
 */
function getSignupFormData() {
    return {
        name: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim(),
        userColor: getRandomProfileColor()
    };
}


/**
 * Checks whether a user with the given email already exists.
 * @param {string} email - The email to check.
 * @returns {boolean} True if the email is already taken.
 */
async function isEmailTaken(email) {
    const response = await fetch(getDatabaseUrl('users'));
    const users = await response.json();

    if (!users) return false;

    return Object.values(users).some((user) => user.email === email);
}


/**
 * Creates a new user in the database.
 * @param {Object} user - The new user data.
 * @returns {Promise} The fetch promise.
 */
function createNewUser(user) {
    return fetch(getDatabaseUrl('users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
}


/**
 * Shows a signup error message.
 * @param {string} message - The error message.
 */
function showSignupError(message) {
    document.getElementById('errorMessage').textContent = message;
}


/**
 * Shows the signup success toast and redirects to the login page.
 */
function showSignupToast() {
    const toast = document.querySelector('.signup-toast');

    if (!toast) return;
    toast.textContent = 'You signed up successfully';
    toast.classList.add('show');

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 2000);
}
