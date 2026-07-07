const mobileSummaryMediaQuery = window.matchMedia("(max-width: 1024px)");
const mobileGreetingDuration = 1500;
let mobileGreetingTimeout;

async function renderSummaryMetrics() {
    const tasks = await getSummaryTasks();
    const urgentTasks = tasks.filter((task) => task.priority === "urgent");

    setSummaryValue("summaryToDo", countTasksByColumn(tasks, "todo"));
    setSummaryValue("summaryDone", countTasksByColumn(tasks, "done"));
    setSummaryValue("summaryUrgent", urgentTasks.length);
    setSummaryValue("summaryUpcomingDeadline", getUpcomingDeadlineText(urgentTasks));
    setSummaryValue("summaryTasksInBoard", tasks.length);
    setSummaryValue("summaryTasksInProgress", countTasksByColumn(tasks, "inprogress"));
    setSummaryValue("summaryAwaitingFeedback", countTasksByColumn(tasks, "awaitfeedback"));
}

async function getSummaryTasks() {
    try {
        const response = await fetch(getSummaryTasksUrl());
        const tasks = await response.json();

        return Object.values(tasks || {});
    } catch (error) {
        return [];
    }
}

function getSummaryTasksUrl() {
    const currentUserId = getCurrentUserId();

    return currentUserId === guestUserId ? getUserDatabaseUrl(guestUserId, "tasks") : getDatabaseUrl("tasks");
}

function countTasksByColumn(tasks, column) {
    return tasks.filter((task) => task.column === column).length;
}

function getUpcomingDeadlineText(tasks) {
    const upcomingDeadline = tasks
        .map((task) => task.dueDate)
        .filter(Boolean)
        .sort()[0];

    return upcomingDeadline ? formatSummaryDate(upcomingDeadline) : "No deadline";
}

function formatSummaryDate(dateString) {
    return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
    });
}

function setSummaryValue(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = value;
}

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
renderSummaryMetrics();
mobileSummaryMediaQuery.addEventListener("change", handleSummaryViewportChange);
