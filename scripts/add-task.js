/**
 * @fileoverview Handles the Add Task page:
 * dropdowns, required field validation, subtasks, selected contacts,
 * posting a new task and showing the success toast.
 */

const assignetToInput = document.getElementById("assignetTo");
const categoryInput = document.getElementById("category");
const titleInput = document.getElementById("title");
const titleError = document.getElementById("titleError");
const dueDateInput = document.getElementById("dueDate");
const dueDateError = document.getElementById("dueDateError");
const categoryError = document.getElementById("categoryError");
const descriptionInput = document.getElementById("description");
const subtaskInput = document.getElementById("subtasks");
const subtaskWrapper = subtaskInput.closest(".subtaskInputWrapper");
const subtaskCancel = subtaskWrapper.querySelector(".subtaskCancel");
const subtaskCheck = subtaskWrapper.querySelector(".subtaskCheck");
const subtaskList = subtaskWrapper.parentElement.querySelector(".subtaskList");
const createTaskButton = document.querySelector(".createTask");
const taskAddedToast = document.querySelector(".taskAddedToast");

/**
 * Resets the assigned-to dropdown input and shows all contacts again.
 */
function resetAssignetToDropdown() {
    assignetToInput.value = "";

    assignetToInput
        .closest(".dropdownList")
        .querySelectorAll(".dropdownContent label")
        .forEach((label) => {
            label.style.display = "";
        });

    renderSelectedContacts();
}


setupDropdownToggle(assignetToInput, resetAssignetToDropdown);
closeDropdown(assignetToInput, resetAssignetToDropdown);


/**
 * Filters contacts inside the assigned-to dropdown.
 */
assignetToInput.addEventListener("input", () => {
    const query = assignetToInput.value.toLowerCase();
    const dropdownContent = assignetToInput
        .closest(".dropdownList")
        .querySelector(".dropdownContent");

    dropdownContent.style.display = "block";
    assignetToInput.parentElement.classList.add("open");

    dropdownContent.querySelectorAll("label").forEach((label) => {
        const name = label.querySelector("span").textContent.toLowerCase();
        label.style.display = name.startsWith(query) ? "" : "none";
    });
});


setupDropdownToggle(categoryInput);
closeDropdown(categoryInput);

const categoryDropdownContent = categoryInput
    .closest(".dropdownList")
    .querySelector(".dropdownContent");

categoryDropdownContent.querySelectorAll("a").forEach((option) => {
    option.addEventListener("click", (event) => {
        event.preventDefault();

        categoryInput.value = option.textContent;
        categoryDropdownContent.style.display = "none";

        clearErrorWhenFilled(categoryInput, categoryError);
        updateCreateTaskButtonState();
    });
});


/**
 * Renders the selected contact avatars below the assigned-to field.
 */
function renderSelectedContacts() {
    const selectedContacts = document.querySelector(".selectedContacts");
    selectedContacts.innerHTML = "";
    const checkedBoxes = document.querySelectorAll(".contactCheckbox:checked");
    checkedBoxes.forEach((checkbox) => {
        const avatar = document.createElement("div");
        avatar.className = "contactAvatar";
        avatar.style.background = checkbox.dataset.color;
        avatar.style.color = checkbox.dataset.textColor;
        avatar.textContent = checkbox.dataset.initials;

        selectedContacts.appendChild(avatar);
    });
}


/**
 * Renders the contacts into the assigned-to dropdown.
 *
 * @param {Object} contacts - The contact data from the database.
 */
function renderAssignetToContacts(contacts) {
    const dropdownContent = assignetToInput
        .closest(".dropdownList")
        .querySelector(".dropdownContent");
    dropdownContent.innerHTML = "";
    for (let key in contacts) {
        dropdownContent.appendChild(buildContactRow(key, contacts[key]));
    }
}


fetch(BASE_URL + "contacts.json")
    .then((response) => response.json())
    .then((contacts) => renderAssignetToContacts(contacts));


/**
 * Shows an error message for an input field.
 *
 * @param {HTMLElement} input - The input that should receive the error style.
 * @param {HTMLElement} errorEl - The error element that should show the message.
 */
function showError(input, errorEl) {
    input.classList.add("inputError");
    errorEl.textContent = "This field is required";
}


/**
 * Clears the error message and error style from an input field.
 *
 * @param {HTMLElement} input - The input that should lose the error style.
 * @param {HTMLElement} errorEl - The error element that should be cleared.
 */
function clearError(input, errorEl) {
    input.classList.remove("inputError");
    errorEl.textContent = "";
}


/**
 * Keeps the Create Task button clickable so validation can run on submit.
 */
function updateCreateTaskButtonState() {
    createTaskButton.disabled = false;
}


/**
 * Validates one required field and updates its error message.
 *
 * @param {HTMLInputElement} input - The required input.
 * @param {HTMLElement} errorEl - The matching error element.
 * @returns {boolean} True if the field is filled.
 */
function validateRequiredField(input, errorEl) {
    if (input.value.trim()) {
        clearError(input, errorEl);
        return true;
    }

    showError(input, errorEl);
    return false;
}


/**
 * Validates all required Add Task fields.
 *
 * @returns {HTMLInputElement|null} The first invalid input or null.
 */
function validateRequiredFields() {
    let firstInvalidInput = null;

    if (!validateRequiredField(titleInput, titleError)) {
        firstInvalidInput = titleInput;
    }

    if (!validateRequiredField(dueDateInput, dueDateError) && !firstInvalidInput) {
        firstInvalidInput = dueDateInput;
    }

    if (!validateRequiredField(categoryInput, categoryError) && !firstInvalidInput) {
        firstInvalidInput = categoryInput;
    }

    return firstInvalidInput;
}


/**
 * Clears an error as soon as the matching field contains text.
 *
 * @param {HTMLInputElement} input - The input to check.
 * @param {HTMLElement} errorEl - The matching error element.
 */
function clearErrorWhenFilled(input, errorEl) {
    if (input.value.trim()) {
        clearError(input, errorEl);
    }
}


titleInput.addEventListener("input", () => {
    clearErrorWhenFilled(titleInput, titleError);
});


dueDateInput.addEventListener("focus", () => {
    dueDateInput.type = "date";
});


dueDateInput.addEventListener("blur", () => {
    if (!dueDateInput.value) {
        dueDateInput.type = "text";
    }

    clearErrorWhenFilled(dueDateInput, dueDateError);
});


dueDateInput.addEventListener("change", () => {
    clearErrorWhenFilled(dueDateInput, dueDateError);
});


categoryInput.addEventListener("input", () => {
    clearErrorWhenFilled(categoryInput, categoryError);
});


categoryInput.addEventListener("change", () => {
    clearErrorWhenFilled(categoryInput, categoryError);
});


subtaskInput.addEventListener("input", () => {
    subtaskWrapper.classList.toggle("isWriting", subtaskInput.value.trim() !== "");
});


subtaskCancel.addEventListener("click", () => {
    subtaskInput.value = "";
    subtaskWrapper.classList.remove("isWriting");
    subtaskInput.focus();
});


/**
 * Adds a new subtask to the subtask list.
 */
function addSubtask() {
    const subtaskText = subtaskInput.value.trim();

    if (!subtaskText) return;

    const listItem = document.createElement("li");
    const row = document.createElement("div");
    row.className = "subtaskRow";
    row.append(buildSubtaskTextGroup(subtaskText), buildSubtaskActions());
    listItem.append(row);
    subtaskList.appendChild(listItem);
    subtaskInput.value = "";
    subtaskWrapper.classList.remove("isWriting");
    subtaskInput.focus();
}


subtaskCheck.addEventListener("click", addSubtask);
subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtask();
    }
});


/**
 * Starts editing a subtask.
 *
 * @param {HTMLElement} listItem - The subtask list item.
 */
function editSubtask(listItem) {
    const textSpan = listItem.querySelector(".subtaskText");

    if (!textSpan) return;

    const currentText = textSpan.textContent;
    const editIcon = listItem.querySelector(".subtaskEdit");
    listItem.classList.add("isEditing");
    enterSubtaskEditIcon(editIcon);
    const editInput = createSubtaskEditInput(currentText);
    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    const stopEditing = (newText) => finishSubtaskEdit(listItem, editIcon, editInput, currentText, newText);
    wireSubtaskEditEvents(editInput, stopEditing);
    listItem._saveEdit = () => stopEditing(editInput.value.trim());
}


subtaskList.addEventListener("dblclick", (event) => {
    if (event.target.closest(".subtaskEditInput")) return;

    const listItem = event.target.closest("li");

    if (!listItem) return;
    editSubtask(listItem);
});


subtaskList.addEventListener("mousedown", (event) => {
    if (event.target.closest(".subtaskItemActions")) {
        event.preventDefault();
    }
});


subtaskList.addEventListener("click", (event) => {
    const listItem = event.target.closest("li");

    if (!listItem) return;

    if (event.target.classList.contains("subtaskEdit")) {
        editSubtask(listItem);
        return;
    }

    if (event.target.classList.contains("subtaskDelete")) {
        listItem.remove();
        return;
    }

    if (event.target.classList.contains("subtaskSaveEdit")) {
        listItem._saveEdit();
    }
});


/**
 * Returns the database URL for new tasks.
 *
 * @returns {string} The task database URL.
 */
function getAddTaskUrl() {
    if (getCurrentUserId() === guestUserId) {
        return getUserDatabaseUrl(guestUserId, 'tasks');
    }
    return getDatabaseUrl("tasks");
}


/**
 * Collects all data for the new task.
 *
 * @returns {Object} The task data.
 */
function getTaskFormData() {
    const subtasks = getSubtasksData();
    const task = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        dueDate: dueDateInput.value,
        priority: document.querySelector('input[name="priority"]:checked').value,
        category: categoryInput.value.trim(),
        assignedTo: getAssignedContacts(),
        column: "todo"
    };

    if (Object.keys(subtasks).length) {
        task.subtasks = subtasks;
    }

    return task;
}


updateCreateTaskButtonState();
createTaskButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const firstInvalidInput = validateRequiredFields();
    if (firstInvalidInput) {
        firstInvalidInput.focus();
        return;
    }
    createTaskButton.disabled = true;
    try {
        await postNewTask(getTaskFormData());
        clearForm();
        showTaskAddedToast();
    } catch (error) {
        console.error("Task could not be created:", error);
        createTaskButton.disabled = false;
    }
});