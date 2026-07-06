const pagesWithHelpLink = ["summary", "add-task", "board", "contacts"];
const legalPages = ["privacy-policy", "legal-notice"];

function getCurrentPage() {
    return document.body.dataset.page;
}

function shouldShowNotLoggedInLegalLayout(currentPage) {
    return legalPages.includes(currentPage);
}

function isProtectedPage(currentPage) {
    return !legalPages.includes(currentPage);
}

function redirectLoggedOutUser(currentPage) {
    if (isProtectedPage(currentPage) && !getActiveUser()) {
        window.location.replace("./login.html");
        return true;
    }

    return false;
}

function getActiveClass(currentPage, page) {
    return currentPage === page ? "active" : "";
}

function getActivePage(currentPage) {
    return {
        summary: getActiveClass(currentPage, "summary"),
        addTask: getActiveClass(currentPage, "add-task"),
        board: getActiveClass(currentPage, "board"),
        contacts: getActiveClass(currentPage, "contacts"),
        privacyPolicy: getActiveClass(currentPage, "privacy-policy"),
        legalNotice: getActiveClass(currentPage, "legal-notice"),
    };
}

function getRenderedTopbarTemplate(currentPage, isNotLoggedInLegalLayout) {
    if (isNotLoggedInLegalLayout) {
        return getNotLoggedInLegalTopbarTemplate();
    }

    const helpLink = pagesWithHelpLink.includes(currentPage) ? getHelpLinkTemplate() : "";
    const accountAvatar = getAccountAvatar();

    return getTopbarTemplate(helpLink, accountAvatar);
}

function getAccountAvatar() {
    const activeUser = getActiveUser();

    return {
        initials: getUserInitials(activeUser?.name),
        backgroundColor: getUserColor(activeUser?.userColor),
        textColor: getUserTextColor(activeUser?.userColor)
    };
}

function renderMobileNav(activePage, isNotLoggedInLegalLayout) {
    const existingMobileNav = document.getElementById("mobileNav");
    if (isNotLoggedInLegalLayout) {
        existingMobileNav?.remove();
        return;
    }
    updateMobileNav(existingMobileNav, activePage);
}

function updateMobileNav(existingMobileNav, activePage) {
    const mobileNav = existingMobileNav || document.createElement("nav");
    mobileNav.id = "mobileNav";
    mobileNav.className = "mobile-nav";
    mobileNav.setAttribute("aria-label", "Mobile navigation");
    mobileNav.innerHTML = getMobileNavTemplate(activePage);

    if (!existingMobileNav) {
        document.body.appendChild(mobileNav);
    }
}

function closeAccountMenu() {
    const accountMenuWrapper = document.querySelector(".account-menu-wrapper");
    const accountAvatar = document.querySelector(".account-avatar");

    accountMenuWrapper?.classList.remove("open");
    accountAvatar?.setAttribute("aria-expanded", "false");
}

function toggleAccountMenu() {
    const accountMenuWrapper = document.querySelector(".account-menu-wrapper");
    const accountAvatar = document.querySelector(".account-avatar");

    if (!accountMenuWrapper || !accountAvatar) {
        return;
    }

    const isOpen = accountMenuWrapper.classList.toggle("open");
    accountAvatar.setAttribute("aria-expanded", String(isOpen));
}

function initAccountMenu() {
    const accountMenuWrapper = document.querySelector(".account-menu-wrapper");
    const accountAvatar = document.querySelector(".account-avatar");
    if (!accountMenuWrapper || !accountAvatar) {
        return;
    }
    addAccountMenuEvents(accountMenuWrapper, accountAvatar);
    addLogoutEvent();
}

function addAccountMenuEvents(accountMenuWrapper, accountAvatar) {
    accountAvatar.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleAccountMenu();
    });
    document.addEventListener("click", (event) => closeMenuOnOutsideClick(event, accountMenuWrapper));
    document.addEventListener("keydown", closeMenuOnEscape);
}

function closeMenuOnOutsideClick(event, accountMenuWrapper) {
    if (!accountMenuWrapper.contains(event.target)) {
        closeAccountMenu();
    }
}

function closeMenuOnEscape(event) {
    if (event.key === "Escape") {
        closeAccountMenu();
    }
}

function addLogoutEvent() {
    const logoutLink = document.getElementById("logoutLink");

    if (!logoutLink) return;

    logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        clearActiveUser();
        window.location.replace("./login.html");
    });
}

function getSidebarTemplateByLayout(activePage, isNotLoggedInLegalLayout) {
    return isNotLoggedInLegalLayout
        ? getNotLoggedInLegalSidebarTemplate(activePage)
        : getSidebarTemplate(activePage);
}

function renderBars() {
    const currentPage = getCurrentPage();

    if (redirectLoggedOutUser(currentPage)) return;

    const sidebar = document.getElementById("sidebar");
    const topbar = document.getElementById("topbar");
    const isNotLoggedInLegalLayout = shouldShowNotLoggedInLegalLayout(currentPage);
    const activePage = getActivePage(currentPage);

    document.body.classList.toggle("not-logged-in-legal-layout", isNotLoggedInLegalLayout);
    sidebar.innerHTML = getSidebarTemplateByLayout(activePage, isNotLoggedInLegalLayout);
    topbar.innerHTML = getRenderedTopbarTemplate(currentPage, isNotLoggedInLegalLayout);
    renderMobileNav(activePage, isNotLoggedInLegalLayout);
    initAccountMenu();
}

renderBars();

window.addEventListener("pageshow", function () {
    redirectLoggedOutUser(getCurrentPage());
});
