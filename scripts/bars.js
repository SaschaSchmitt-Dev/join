const pagesWithHelpLink = ["summary", "add-task", "board", "contacts"];
const legalPages = ["privacy-policy", "legal-notice"];

function getCurrentPage() {
    return document.body.dataset.page;
}

function shouldShowNotLoggedInLegalLayout(currentPage) {
    return legalPages.includes(currentPage);
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

    return getTopbarTemplate(helpLink);
}

function renderMobileNav(activePage, isNotLoggedInLegalLayout) {
    const existingMobileNav = document.getElementById("mobileNav");

    if (isNotLoggedInLegalLayout) {
        existingMobileNav?.remove();
        return;
    }

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

    accountAvatar.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleAccountMenu();
    });

    document.addEventListener("click", (event) => {
        if (!accountMenuWrapper.contains(event.target)) {
            closeAccountMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAccountMenu();
        }
    });
}

function renderBars() {
    const currentPage = getCurrentPage();
    const sidebar = document.getElementById("sidebar");
    const topbar = document.getElementById("topbar");
    const isNotLoggedInLegalLayout = shouldShowNotLoggedInLegalLayout(currentPage);
    const activePage = getActivePage(currentPage);
    const sidebarTemplate = isNotLoggedInLegalLayout
        ? getNotLoggedInLegalSidebarTemplate(activePage)
        : getSidebarTemplate(activePage);

    document.body.classList.toggle("not-logged-in-legal-layout", isNotLoggedInLegalLayout);
    sidebar.innerHTML = sidebarTemplate;
    topbar.innerHTML = getRenderedTopbarTemplate(currentPage, isNotLoggedInLegalLayout);
    renderMobileNav(activePage, isNotLoggedInLegalLayout);
    initAccountMenu();
}

renderBars();
