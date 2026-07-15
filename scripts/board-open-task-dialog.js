/** Connects task cards with the task detail dialog. */
function initializeOpenTaskDialog() {
    const boardColumns = document.querySelector(".board-columns");

    boardColumns.addEventListener("click", handleTaskCardClick);
    boardColumns.addEventListener("keydown", handleTaskCardKeydown);
}


function handleTaskCardClick(event) {
    const card = event.target.closest(".task-card");
    if (!card) return;
    openTaskCard(card);
}


/** Opens a focused task card with Enter or Space. */
function handleTaskCardKeydown(event) {
    const card = event.target.closest(".task-card");

    if (!card || event.target !== card || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    openTaskCard(card);
}


/** Opens the task represented by a board card. */
function openTaskCard(card) {
    const task = boardTasks.find((item) => String(item.id) === card.dataset.taskId);
    if (task) openTaskDialog(task);
}


/** Opens the detail view for one board task. */
function openTaskDialog(task) {
    closeOpenTaskDialog();
    document.body.insertAdjacentHTML("beforeend", getOpenTaskDialogTemplate(getOpenTaskView(task)));
    const backdrop = document.getElementById("openTaskDialog");
    backdrop.querySelector(".open-task-close").addEventListener("click", closeOpenTaskDialog);
    backdrop.querySelector(".open-task-delete").addEventListener("click", deleteOpenTask);
    backdrop.querySelector(".open-task-subtasks").addEventListener("change", changeOpenTaskSubtaskStatus);
    backdrop.addEventListener("click", closeOpenTaskOnBackdrop);
    document.addEventListener("keydown", closeOpenTaskOnEscape);
}


/** Saves a changed subtask checkbox in Firebase and refreshes the task card. */
async function changeOpenTaskSubtaskStatus(event) {
    const checkbox = event.target.closest("input[data-subtask-id]");
    if (!checkbox) return;
    const taskId = document.querySelector(".dialog-creator").dataset.taskId;
    const task = boardTasks.find((item) => String(item.id) === taskId);
    if (!task?.subtasks?.[checkbox.dataset.subtaskId]) return;
    checkbox.disabled = true;
    try {
        await updateSubtaskCompletion(taskId, checkbox.dataset.subtaskId, checkbox.checked);
        task.subtasks[checkbox.dataset.subtaskId].completed = checkbox.checked;
        renderBoardTasks(boardTasks, boardContacts);
    } catch (error) {
        checkbox.checked = !checkbox.checked;
        console.error(error);
    } finally {
        checkbox.disabled = false;
    }
}


function getOpenTaskView(task) {
    const priority = getTaskPriority(task.priority);
    return {
        id: escapeBoardHtml(task.id), title: escapeBoardHtml(task.title),
        description: escapeBoardHtml(task.description || ""),
        category: escapeBoardHtml(task.category), categoryClass: getTaskCategoryClass(task.category),
        dueDate: getOpenTaskDate(task.dueDate), priorityLabel: priority[0].toUpperCase() + priority.slice(1),
        priorityIcon: `${priority}-priority.png`, contacts: getOpenTaskContacts(task.assignedTo),
        subtasks: getOpenTaskSubtasks(task.subtasks)
    };
}


function getOpenTaskDate(value) {
    if (!value) return "";
    const parts = value.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : escapeBoardHtml(value);
}


function getOpenTaskContacts(assignments = []) {
    return assignments.map((assignment) => {
        const contact = boardContacts[assignment.id];
        if (!contact) return "";
        const color = getUserColor(contact.color);
        return getOpenTaskContactTemplate({ name: escapeBoardHtml(contact.name),
            initials: escapeBoardHtml(getUserInitials(contact.name)), color, textColor: getUserTextColor(color) });
    }).join("");
}


function getOpenTaskSubtasks(subtasks = {}) {
    return Object.entries(subtasks).map(([id, subtask]) => getOpenTaskSubtaskTemplate({
        id: escapeBoardHtml(id), title: escapeBoardHtml(subtask.title), completed: Boolean(subtask.completed)
    })).join("");
}


function closeOpenTaskOnBackdrop(event) {
    closeBoardDialogOnBackdrop(event, "openTaskDialog", closeOpenTaskDialog);
}


function closeOpenTaskOnEscape(event) {
    closeBoardDialogOnEscape(event, closeOpenTaskDialog);
}


function closeOpenTaskDialog() {
    removeBoardDialog("openTaskDialog");
    document.removeEventListener("keydown", closeOpenTaskOnEscape);
}


async function deleteOpenTask() {
    const id = document.querySelector(".dialog-creator").dataset.taskId;
    await fetch(getTasksUrl(id), { method: "DELETE" });
    boardTasks = boardTasks.filter((task) => String(task.id) !== id);
    renderBoardTasks(boardTasks, boardContacts);
    closeOpenTaskDialog();
}


initializeOpenTaskDialog();
