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
