function checkLogin() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    const invalid = !email.value.trim() || !password.value.trim();

    email.classList.toggle('error', invalid);
    password.classList.toggle('error', invalid);
    errorMsg.textContent = invalid ? 'Check your email and password. Please try again.' : '';
    errorMsg.classList.toggle('show', invalid);
}

function togglePasswordIcon() {
    const password = document.getElementById('password');
    const icon = document.getElementById('toggle-icon');
    const visible = password.type === 'text';

    if (password.value.length === 0) return icon.src = '../assets/icons/lock.png';
    icon.src = visible ? '../assets/icons/visability.png' : '../assets/icons/visability_off.png';
}

document.getElementById('password').addEventListener('input', togglePasswordIcon);
document.getElementById('toggle-icon').addEventListener('click', () => {
    const password = document.getElementById('password');
    if (!password.value.length) return;
    password.type = password.type === 'password' ? 'text' : 'password';
    togglePasswordIcon();
});

document.getElementById('email').addEventListener('focus', clearError);
document.getElementById('password').addEventListener('focus', clearError);

function clearError() {
  document.getElementById('email').classList.remove('error');
  document.getElementById('password').classList.remove('error');
  const errorMsg = document.getElementById('error-msg');
  errorMsg.classList.remove('show');
  errorMsg.textContent = '';
}