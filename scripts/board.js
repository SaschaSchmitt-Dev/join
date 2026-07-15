const boardColumns = {
    todo: { elementId: "toDoTasks", label: "To do" },
    inprogress: { elementId: "inProgressTasks", label: "In progress" },
    awaitfeedback: { elementId: "awaitFeedbackTasks", label: "Await feedback" },
    done: { elementId: "doneTasks", label: "Done" }
};

let boardTasks = [];
let boardContacts = {};


/**
 * Loads and renders all board data.
 */
async function initializeBoard() {
    try {
        boardTasks = await getTasks();
        boardContacts = await getBoardContacts();
        renderBoardTasks(boardTasks, boardContacts);
        initializeBoardCardDragScroll();
    } catch (error) {
        showBoardStatusMessage("Board data could not be loaded.");
        renderBoardTasks([], {});
        initializeBoardCardDragScroll();
    }
}


/**
 * Enables mouse dragging for horizontally arranged task-card rows.
 */
function initializeBoardCardDragScroll() {
    document.querySelectorAll(".task-list").forEach(initializeHorizontalDragScroll);
}


/**
 * Loads the contacts for the active board.
 * @returns {Promise<Object>} The contacts.
 */
async function getBoardContacts() {
    const isGuest = getCurrentUserId() === guestUserId;
    const url = isGuest
        ? getUserDatabaseUrl(guestUserId, "contacts")
        : getDatabaseUrl("contacts");

    const response = await fetch(url);

    return await response.json() || {};
}


/**
 * Renders all task columns.
 * @param {Array} tasks - The board tasks.
 * @param {Object} contacts - The board contacts.
 */
function renderBoardTasks(tasks, contacts) {
    Object.entries(boardColumns).forEach(([name, column]) => {
        const element = document.getElementById(column.elementId);
        const columnTasks = tasks.filter((task) => task.column === name);

        element.innerHTML = getBoardColumnContent(columnTasks, contacts, column.label);
    });
}


/**
 * Gets the content of one task column.
 * @param {Array} tasks - The column tasks.
 * @param {Object} contacts - The board contacts.
 * @param {string} label - The column label.
 * @returns {string} The column HTML.
 */
function getBoardColumnContent(tasks, contacts, label) {
    if (!tasks.length) {
        return getEmptyTaskColumnTemplate(label);
    }

    return tasks.map((task) => renderTaskCard(task, contacts)).join("");
}


/**
 * Renders one task card.
 * @param {Object} task - The task data.
 * @param {Object} contacts - The board contacts.
 * @returns {string} The task card HTML.
 */
function renderTaskCard(task, contacts) {
    const taskView = getTaskViewData(task);
    const progress = getTaskProgress(task.subtasks);
    const users = getTaskUsers(task.assignedTo, contacts);

    return getTaskCardTemplate(taskView, progress, users);
}


/**
 * Prepares one task for its template.
 * @param {Object} task - The task data.
 * @returns {Object} The task view data.
 */
function getTaskViewData(task) {
    const priority = getTaskPriority(task.priority);

    return {
        id: escapeBoardHtml(task.id),
        column: escapeBoardHtml(task.column),
        title: escapeBoardHtml(task.title),
        description: escapeBoardHtml(task.description || ""),
        category: escapeBoardHtml(task.category),
        categoryClass: getTaskCategoryClass(task.category),
        priority,
        priorityIcon: `${priority}-priority.png`
    };
}


/**
 * Gets a valid task priority.
 * @param {string} priority - The saved priority.
 * @returns {string} The valid priority.
 */
function getTaskPriority(priority) {
    const priorities = ["urgent", "medium", "low"];

    return priorities.includes(priority) ? priority : "medium";
}


/**
 * Gets the task category class.
 * @param {string} category - The task category.
 * @returns {string} The category class.
 */
function getTaskCategoryClass(category) {
    return category === "User Story" ? "user-story" : "technical-task";
}


/**
 * Creates the subtask progress HTML.
 * @param {Object} subtasks - The task subtasks.
 * @returns {string} The progress HTML.
 */
function getTaskProgress(subtasks) {
    const list = Object.values(subtasks || {});

    if (!list.length) {
        return "";
    }

    const completed = list.filter((subtask) => subtask.completed).length;
    const progress = Math.round((completed / list.length) * 100);

    return getTaskProgressTemplate(completed, list.length, progress);
}


/**
 * Creates all assigned contact avatars.
 * @param {Array} assignments - The assignments.
 * @param {Object} contacts - The contacts.
 * @returns {string} The avatar HTML.
 */
function getTaskUsers(assignments = [], contacts = {}) {
    const assignedContacts = assignments.map((item) => contacts[item.id]).filter(Boolean);
    const visibleContacts = assignedContacts.slice(0, 5);
    const remainingContacts = assignedContacts.length - visibleContacts.length;
    const avatars = visibleContacts.map((contact) => getTaskUser(contact)).join("");

    return avatars + (remainingContacts ? getTaskUserOverflowTemplate(remainingContacts) : "");
}


/**
 * Creates one assigned contact avatar.
 * @param {Object} contact - The assigned contact.
 * @returns {string} The avatar HTML.
 */
function getTaskUser(contact) {
    if (!contact) {
        return "";
    }

    const color = getUserColor(contact.color);
    const contactView = {
        color,
        textColor: getUserTextColor(color),
        initials: escapeBoardHtml(getUserInitials(contact.name))
    };

    return getTaskUserTemplate(contactView);
}


/**
 * Sets up the mobile task move events.
 */
function setupMobileTaskMoveEvents() {
    const boardColumnsElement = document.querySelector(".board-columns");

    if (!boardColumnsElement) {
        return;
    }

    boardColumnsElement.addEventListener("click", handleMobileTaskMoveClick);
    document.addEventListener("click", closeMobileMoveMenu);
}


/**
 * Handles clicks for the mobile task move menu.
 * @param {MouseEvent} event - The click event.
 */
function handleMobileTaskMoveClick(event) {
    const moveOption = event.target.closest(".mobile-move-option");
    const moveButton = event.target.closest(".mobile-move-task-btn");

    if (moveOption) {
        return handleMobileMoveOptionClick(event, moveOption);
    }

    if (moveButton) {
        return handleMobileMoveButtonClick(event, moveButton);
    }
}


/**
 * Handles the mobile move button click.
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} moveButton - The clicked move button.
 */
function handleMobileMoveButtonClick(event, moveButton) {
    event.stopImmediatePropagation();

    toggleMobileMoveMenu(moveButton);
}


/**
 * Handles the mobile move option click.
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} moveOption - The clicked move option.
 */
function handleMobileMoveOptionClick(event, moveOption) {
    event.stopImmediatePropagation();

    moveTaskMobile(moveOption.dataset.taskId, moveOption.dataset.column);
}


/**
 * Toggles the mobile move menu on a task card.
 * @param {HTMLElement} moveButton - The clicked move button.
 */
function toggleMobileMoveMenu(moveButton) {
    const taskCard = moveButton.closest(".task-card");
    const isOpen = taskCard.querySelector(".mobile-move-menu");
    const taskId = moveButton.dataset.taskId;
    const currentColumn = moveButton.dataset.column;

    closeMobileMoveMenu();

    if (!isOpen) {
        taskCard.appendChild(createMobileMoveMenu(taskId, currentColumn));
    }
}


/**
 * Creates the mobile move menu.
 * @param {string} taskId - The task id.
 * @param {string} currentColumn - The current task column.
 * @returns {HTMLElement} The created menu element.
 */
function createMobileMoveMenu(taskId, currentColumn) {
    const menu = document.createElement("div");

    menu.className = "mobile-move-menu";
    menu.innerHTML = getMobileMoveMenuTemplate(taskId, currentColumn);

    return menu;
}


/**
 * Moves a task to another column on mobile.
 * @param {string} taskId - The task id.
 * @param {string} column - The new column.
 */
async function moveTaskMobile(taskId, column) {
    if (!boardColumns[column]) {
        return;
    }

    await updateTaskColumn(taskId, column);
    updateLocalTaskColumn(taskId, column);
    renderBoardTasks(boardTasks, boardContacts);
    showBoardStatusMessage(`Task moved to ${boardColumns[column].label}.`);
}


/**
 * Updates the task column in the database.
 * @param {string} taskId - The task id.
 * @param {string} column - The new column.
 */
async function updateTaskColumn(taskId, column) {
    await fetch(getTasksUrl(`${taskId}/column`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(column)
    });
}


/**
 * Updates the task column locally.
 * @param {string} taskId - The task id.
 * @param {string} column - The new column.
 */
function updateLocalTaskColumn(taskId, column) {
    const task = boardTasks.find((task) => task.id === taskId);

    if (task) {
        task.column = column;
    }
}


/**
 * Closes the open mobile move menu.
 */
function closeMobileMoveMenu() {
    const openMenu = document.querySelector(".mobile-move-menu");

    if (openMenu) {
        openMenu.remove();
    }
}


/**
 * Shows a board status message for screen readers.
 * @param {string} message - The status message.
 */
function showBoardStatusMessage(message) {
    const statusMessage = document.getElementById("boardStatusMessage");

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;

    setTimeout(() => {
        statusMessage.textContent = "";
    }, 2000);
}


/**
 * Escapes a value for a board template.
 * @param {*} value - The value to escape.
 * @returns {string} The escaped value.
 */
function escapeBoardHtml(value) {
    const element = document.createElement("div");

    element.textContent = value == null ? "" : String(value);

    return element.innerHTML;
}


setupMobileTaskMoveEvents();
initializeBoard();