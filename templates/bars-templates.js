function getSidebarTemplate(activePage) {
    return `
        <div class="logo">
            <img src="../assets/icons/join-logo-light.png" alt="Join Logo">
        </div>

        <nav class="menu">
            <a class="${activePage.summary}" href="./summary.html">
                <img class="icons-sidebar" src="../assets/icons/summary.png" alt="Summary Icon">
                <span>Summary</span>
            </a>
            <a class="${activePage.addTask}" href="./add-task.html">
                <img class="icons-sidebar" src="../assets/icons/add-task.png" alt="Add Task Icon">
                <span>Add Task</span>
            </a>
            <a class="${activePage.board}" href="./board.html">
                <img class="icons-sidebar" src="../assets/icons/board.png" alt="Board Icon">
                <span>Board</span>
            </a>
            <a class="${activePage.contacts}" href="./contacts.html">
                <img class="icons-sidebar" src="../assets/icons/contacts.png" alt="Contacts Icon">
                <span>Contacts</span>
            </a>
        </nav>

        <div class="legal-links">
            <a class="${activePage.privacyPolicy}" href="./privacy-policy.html">Privacy Policy</a>
            <a class="${activePage.legalNotice}" href="./legal-notice.html">Legal notice</a>
        </div>
    `;
}

function getNotLoggedInLegalSidebarTemplate(activePage) {
    return `
        <div class="logo">
            <img src="../assets/icons/join-logo-light.png" alt="Join Logo">
        </div>

        <nav class="menu not-logged-in-menu">
            <a class="login-link" href="./login.html">
                <img src="../assets/icons/login.png" alt="Login Icon">
                <span>Log In</span>
            </a>
        </nav>

        <div class="legal-links">
            <a class="${activePage.privacyPolicy}" href="./privacy-policy.html">Privacy Policy</a>
            <a class="${activePage.legalNotice}" href="./legal-notice.html">Legal notice</a>
        </div>
    `;
}

function getHelpLinkTemplate() {
    return `
        <a class="help-link mobile-hide" href="./help.html">
            <img src="../assets/icons/help.png" alt="Help Icon">
        </a>
    `;
}

function getTopbarTemplate(helpLink) {
    return `
        <div class="topbar-left">
            <p class="mobile-hide">Kanban Project Management Tool</p>
            <img class="desktop-hide" src="../assets/icons/join-logo-dark.png" alt="Join Logo">
        </div>
        <div class="topbar-right">
            ${helpLink}
            <div class="user-circle">SM</div>
        </div>
    `;
}

function getNotLoggedInLegalTopbarTemplate() {
    return `
        <div class="topbar-left">
            <p>Kanban Project Management Tool</p>
        </div>
    `;
}
