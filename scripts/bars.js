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
}

renderBars();
