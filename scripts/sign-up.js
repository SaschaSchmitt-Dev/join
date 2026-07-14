/**
 * Updates a password field icon based on its content and visibility state.
 * @param {string} inputId - The id of the password input.
 * @param {string} iconId - The id of the icon image.
 */
function togglePasswordIcon(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    const visible = input.type === 'text';

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


document.getElementById('password').addEventListener('input', () => togglePasswordIcon('password', 'password-icon'));
document.getElementById('password-icon').addEventListener('click', () => togglePasswordVisibility('password', 'password-icon'));

document.getElementById('confirm-password').addEventListener('input', () => togglePasswordIcon('confirm-password', 'confirm-password-icon'));
document.getElementById('confirm-password-icon').addEventListener('click', () => togglePasswordVisibility('confirm-password', 'confirm-password-icon'));


/**
 * Enables or disables the signup button based on the terms checkbox state.
 */
function updateSignupButtonState() {
    const termsCheckbox = document.getElementById('terms-checkbox');
    const signupBtn = document.getElementById('signup-btn');
    signupBtn.disabled = !termsCheckbox.checked;
}


document.getElementById('terms-checkbox').addEventListener('change', updateSignupButtonState);
updateSignupButtonState();


/**
 * Checks whether the password and confirm password fields match.
 * Marks the confirm password field and shows an error message if they do not.
 * @returns {boolean} True if the passwords match.
 */
function checkPasswordsMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const matches = password.value === confirmPassword.value;

    confirmPassword.classList.toggle('error', !matches);
    document.getElementById('errorMessage').textContent = matches ? '' : 'Your passwords don\'t match. Please try again.';

    return matches;
}


/**
 * Clears the signup password error state.
 */
function clearPasswordError() {
    document.getElementById('confirm-password').classList.remove('error');
    document.getElementById('errorMessage').textContent = '';
}


document.getElementById('signup-form').addEventListener('submit', (event) => {
    if (checkPasswordsMatch()) return;
    event.preventDefault();
});

document.getElementById('password').addEventListener('input', clearPasswordError);
document.getElementById('confirm-password').addEventListener('input', clearPasswordError);
