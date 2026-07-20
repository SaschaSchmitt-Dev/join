const boardColumns = {
    todo: { elementId: "toDoTasks", label: "To do" },
    inprogress: { elementId: "inProgressTasks", label: "In progress" },
    awaitfeedback: { elementId: "awaitFeedbackTasks", label: "Await feedback" },
    done: { elementId: "doneTasks", label: "Done" }
};

let boardTasks = [];
let boardContacts = {};
let draggedTaskId = null
let currentDropZone = null
let dropIndicatorElement = null

/**
 * Starts the task search.
 */
function initializeTaskSearch() {
    const searchInput = document.getElementById("taskSearch");

    searchInput.addEventListener("input", filterTasks);
}


/**
 * Filters tasks by title and description.
 */
function filterTasks() {
    const searchText = document.getElementById("taskSearch").value.toLowerCase();
    const filteredTasks = boardTasks.filter((task) => {
        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();

        return title.includes(searchText) || description.includes(searchText);
    });

    renderBoardTasks(filteredTasks, boardContacts);
}


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
        const columnTasks = tasks
            .filter((task) => task.column === name)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
        priorityIcon: `${priority}-priority.webp`
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
 * Sets up the drag and drop events for the board.
 */
function setupBoardDragAndDrop() {
    const boardColumnsElement = document.querySelector('.board-columns')

    if (!boardColumnsElement) {
        return;
    }

    boardColumnsElement.addEventListener("dragstart", handleDragStart)
    boardColumnsElement.addEventListener("dragover", handleDragOver)
    boardColumnsElement.addEventListener("drop", handleDrop)
    boardColumnsElement.addEventListener("dragend", handleDragEnd)
}


/**
 * Handles the drag start event for a task card.
 * @param {DragEvent} event - The drag event.
 */
function handleDragStart(event) {
    const taskCard = event.target.closest('.task-card');

    if (taskCard) {
        draggedTaskId = taskCard.dataset.taskId;
        taskCard.classList.add('dragging');
    }
}


/**
 * Handles the drag end event for a task card.
 * @param {DragEvent} event - The drag event.
 */
function handleDragEnd(event) {
    const taskCard = event.target.closest(".task-card");

    if (taskCard) {
        taskCard.classList.remove("dragging");
    }

    if (currentDropZone) {
        currentDropZone.classList.remove('drag-over');
        currentDropZone = null;
    }

    removeDropIndicator();
    draggedTaskId = null;
}


/**
 * Gets all task cards in a list, excluding the one currently being dragged.
 * @param {HTMLElement} taskList - The task list element.
 * @returns {Array<HTMLElement>} The task cards.
 */
function getCardsInList(taskList) {
    return [...taskList.querySelectorAll('.task-card:not(.dragging)')];
}


/**
 * Finds the card the dragged task should be inserted before.
 * Task lists lay out as a column (>=1440px) or a horizontally scrolling row (<1440px),
 * so the cursor is compared against the axis that is actually stacking the cards.
 * @param {HTMLElement} taskList - The task list element.
 * @param {number} clientX - The horizontal cursor position.
 * @param {number} clientY - The vertical cursor position.
 * @returns {HTMLElement|null} The card to insert before, or null to insert at the end.
 */
function getDropTargetCard(taskList, clientX, clientY) {
    const isRow = getComputedStyle(taskList).flexDirection === 'row';

    return getCardsInList(taskList).find((card) => {
        const rect = card.getBoundingClientRect();

        return isRow
            ? clientX < rect.left + rect.width / 2
            : clientY < rect.top + rect.height / 2;
    }) || null;
}


/**
 * Gets the index of a card within a task list's cards, excluding the dragged one.
 * @param {HTMLElement} taskList - The task list element.
 * @param {HTMLElement|null} targetCard - The card to find, or null for the end.
 * @returns {number} The insertion index.
 */
function getDropIndex(taskList, targetCard) {
    const cards = getCardsInList(taskList);

    return targetCard ? cards.indexOf(targetCard) : cards.length;
}


/**
 * Gets the reusable drop-indicator placeholder element.
 * @returns {HTMLElement} The drop-indicator element.
 */
function getOrCreateDropIndicator() {
    if (!dropIndicatorElement) {
        dropIndicatorElement = document.createElement("div");
        dropIndicatorElement.className = "drop-indicator";
    }

    return dropIndicatorElement;
}


/**
 * Removes the drop-indicator placeholder from the DOM.
 */
function removeDropIndicator() {
    if (dropIndicatorElement && dropIndicatorElement.parentElement) {
        dropIndicatorElement.remove();
    }
}


function handleDragOver(event) {
    event.preventDefault();

    const taskList = event.target.closest('.task-list');

    if (taskList !== currentDropZone) {
        if (currentDropZone) {
            currentDropZone.classList.remove('drag-over');
        }

        if (taskList) {
            taskList.classList.add('drag-over');
        }

        currentDropZone = taskList;
    }

    if (!taskList) {
        removeDropIndicator();
        return;
    }

    const targetCard = getDropTargetCard(taskList, event.clientX, event.clientY);
    const indicator = getOrCreateDropIndicator();

    taskList.insertBefore(indicator, targetCard);
}


function handleDrop(event) {
    const taskList = event.target.closest('.task-list');

    if (!taskList || !draggedTaskId) {
        return;
    }

    const column = Object.keys(boardColumns).find(
        (key) => boardColumns[key].elementId === taskList.id
    )

    if (column) {
        const targetCard = getDropTargetCard(taskList, event.clientX, event.clientY);
        const targetIndex = getDropIndex(taskList, targetCard);

        moveTaskToPosition(draggedTaskId, column, targetIndex);
    }

    if (currentDropZone) {
        currentDropZone.classList.remove('drag-over');
        currentDropZone = null;
    }

    removeDropIndicator();
    draggedTaskId = null;
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
 * Moves a task to another column and appends it to the end (used by the mobile move menu).
 * @param {string} taskId - The task id.
 * @param {string} column - The new column.
 */
async function moveTaskMobile(taskId, column) {
    if (!boardColumns[column]) {
        return;
    }

    const endIndex = getSortedColumnTasks(column).filter((task) => task.id !== taskId).length;

    await moveTaskToPosition(taskId, column, endIndex);
}


/**
 * Moves a task to a specific position within a column, shifting the other tasks.
 * @param {string} taskId - The task id.
 * @param {string} targetColumn - The target column.
 * @param {number} targetIndex - The insertion index within the target column.
 */
async function moveTaskToPosition(taskId, targetColumn, targetIndex) {
    if (!boardColumns[targetColumn]) {
        return;
    }

    const task = boardTasks.find((task) => task.id === taskId);

    if (!task) {
        return;
    }

    task.column = targetColumn;
    const targetTasks = getSortedColumnTasks(targetColumn).filter((task) => task.id !== taskId);
    targetTasks.splice(targetIndex, 0, task);
    targetTasks.forEach((task, index) => { task.order = index; });

    await persistColumnOrder(targetColumn, targetTasks, taskId);
    renderBoardTasks(boardTasks, boardContacts);
    showBoardStatusMessage(`Task moved to ${boardColumns[targetColumn].label}.`);
}


/**
 * Gets the tasks of one column, sorted by their order.
 * @param {string} column - The column.
 * @returns {Array} The sorted column tasks.
 */
function getSortedColumnTasks(column) {
    return boardTasks
        .filter((task) => task.column === column)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}


/**
 * Persists the order of a column's tasks and the moved task's column in one request.
 * @param {string} column - The target column.
 * @param {Array} tasks - The target column tasks in their new order.
 * @param {string} movedTaskId - The id of the moved task.
 */
async function persistColumnOrder(column, tasks, movedTaskId) {
    const updates = {};

    tasks.forEach((task) => { updates[`${task.id}/order`] = task.order; });
    updates[`${movedTaskId}/column`] = column;

    await fetch(getTasksUrl(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
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
initializeTaskSearch();
initializeBoard();
setupBoardDragAndDrop();
