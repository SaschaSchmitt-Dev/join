const loginRedirectDelay = 1000;
const loginLogoTransitionKey = 'joinLoginLogoTransition';


/**
 * Redirects the start page to the login page.
 */
function redirectToLoginPage() {
    sessionStorage.setItem(loginLogoTransitionKey, 'true');
    window.location.href = "./subpages/login.html";
}


setTimeout(redirectToLoginPage, loginRedirectDelay);
