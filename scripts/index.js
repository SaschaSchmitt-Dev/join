const loginRedirectDelay = 1000;


/**
 * Redirects the start page to the login page.
 */
function redirectToLoginPage() {
    window.location.href = "./subpages/login.html";
}


setTimeout(redirectToLoginPage, loginRedirectDelay);
