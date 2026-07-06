const mobileSummaryMediaQuery = window.matchMedia("(max-width: 1024px)");
const mobileGreetingDuration = 1500;
let mobileGreetingTimeout;

function renderActiveUser() {
    const activeUserElement = document.getElementById("activeUser");
    const activeUser = getActiveUser();

    if (!activeUserElement || !activeUser) return;

    activeUserElement.textContent = activeUser.name;
    activeUserElement.style.color = getUserColor(activeUser.userColor);
}

function getSummarySection() {
    return document.querySelector(".summary-section");
}

function hideMobileGreeting(summarySection) {
    summarySection.classList.remove("mobile-greeting-active");
}

function showMobileGreeting() {
    const summarySection = getSummarySection();

    if (!summarySection || !mobileSummaryMediaQuery.matches) {
        return;
    }

    summarySection.classList.add("mobile-greeting-active");
    clearTimeout(mobileGreetingTimeout);
    mobileGreetingTimeout = setTimeout(() => hideMobileGreeting(summarySection), mobileGreetingDuration);
}

function handleSummaryViewportChange(event) {
    const summarySection = getSummarySection();
    clearTimeout(mobileGreetingTimeout);

    if (!summarySection) {
        return;
    }

    if (event.matches) {
        showMobileGreeting();
        return;
    }
    hideMobileGreeting(summarySection);
}

showMobileGreeting();
renderActiveUser();
mobileSummaryMediaQuery.addEventListener("change", handleSummaryViewportChange);
