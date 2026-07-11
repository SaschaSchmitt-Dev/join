/**
 * @fileoverview This script handles the task addition functionality, including dropdowns for assignees and categories, error handling, and rendering selected contacts.
 */
const assignetToInput = document.getElementById('assignetTo');
const categoryInput = document.getElementById('category');
function resetAssignetToDropdown() {
    assignetToInput.value = '';
    assignetToInput.closest('.dropdownList').querySelectorAll('.dropdownContent label').forEach((label) => {
        label.style.display = '';
    });
    renderSelectedContacts();
}


setupDropdownToggle(assignetToInput, resetAssignetToDropdown);
closeDropdown(assignetToInput, resetAssignetToDropdown);
assignetToInput.addEventListener('input', () => {
    const query = assignetToInput.value.toLowerCase();
    const dropdownContent = assignetToInput.closest('.dropdownList').querySelector('.dropdownContent');
    dropdownContent.style.display = 'block';
    assignetToInput.parentElement.classList.add('open');
    dropdownContent.querySelectorAll('label').forEach((label) => {
        const name = label.querySelector('span').textContent.toLowerCase();
        label.style.display = name.startsWith(query) ? '' : 'none';
    });
});


setupDropdownToggle(categoryInput);
closeDropdown(categoryInput);
const categoryDropdownContent = categoryInput.closest('.dropdownList').querySelector('.dropdownContent');
categoryDropdownContent.querySelectorAll('a').forEach((option) => {
    option.addEventListener('click', (event) => {
        event.preventDefault();
        categoryInput.value = option.textContent;
        categoryDropdownContent.style.display = 'none';
        clearError(categoryInput, categoryError);
        updateCreateTaskButtonState();
    });
});


function renderSelectedContacts() {
    const selectedContacts = document.querySelector('.selectedContacts');
    selectedContacts.innerHTML = '';
    const checkedBoxes = document.querySelectorAll('.contactCheckbox:checked');
    checkedBoxes.forEach((checkbox) => {
        const avatar = document.createElement('div');
        avatar.className = 'contactAvatar';
        avatar.style.background = checkbox.dataset.color;
        avatar.style.color = checkbox.dataset.textColor;
        avatar.textContent = checkbox.dataset.initials;
        selectedContacts.appendChild(avatar);
    });
}


/** * Renders the list of contacts in the "Assigned To" dropdown.
 * @param {Object} contacts - An object containing contact information.
 */
function renderAssignetToContacts(contacts) {
    const dropdownContent = assignetToInput.closest('.dropdownList').querySelector('.dropdownContent');
    dropdownContent.innerHTML = '';
    for (let key in contacts) {
        dropdownContent.appendChild(buildContactRow(key, contacts[key]));
    }
}


fetch(BASE_URL + 'contacts.json')
    .then((response) => response.json())
    .then((contacts) => renderAssignetToContacts(contacts));


/** * Displays an error message for the specified input field.
 * @param {HTMLElement} input - The input element to show the error for.
 * @param {HTMLElement} errorEl - The element to display the error message in.
 */
function showError(input, errorEl) {
    input.classList.add('inputError');
    errorEl.textContent = 'This field is required';
}


/** * Clears the error message for the specified input field.
 * @param {HTMLElement} input - The input element to clear the error for.
 * @param {HTMLElement} errorEl - The element to clear the error message from.
 */
function clearError(input, errorEl) {
    input.classList.remove('inputError');
    errorEl.textContent = '';
}

/** * Updates the state of the "Create Task" button based on the required fields.
 */
function updateCreateTaskButtonState() {
    const isFilled = titleInput.value.trim() && dueDateInput.value && categoryInput.value.trim();
    createTaskButton.disabled = !isFilled;
}


const titleInput = document.getElementById('title');
const titleError = document.getElementById('titleError');
titleInput.addEventListener('blur', () => {
    if (!titleInput.value.trim()) showError(titleInput, titleError);
});
titleInput.addEventListener('input', () => {
    if (titleInput.value.trim()) clearError(titleInput, titleError);
    updateCreateTaskButtonState();
});


const dueDateInput = document.getElementById('dueDate');
const dueDateError = document.getElementById('dueDateError');
dueDateInput.addEventListener('focus', () => { dueDateInput.type = 'date'; });
dueDateInput.addEventListener('blur', () => {
    if (!dueDateInput.value) {
        dueDateInput.type = 'text';
        showError(dueDateInput, dueDateError);
    } else {
        clearError(dueDateInput, dueDateError);
    }
});
dueDateInput.addEventListener('change', () => {
    if (dueDateInput.value) clearError(dueDateInput, dueDateError);
    updateCreateTaskButtonState();
});


const categoryError = document.getElementById('categoryError');
categoryInput.addEventListener('blur', () => {
    if (!categoryInput.value.trim()) showError(categoryInput, categoryError);
});


const descriptionInput = document.getElementById('description');
const subtaskInput = document.getElementById('subtasks');
const subtaskWrapper = subtaskInput.closest('.subtaskInputWrapper');
const subtaskCancel = subtaskWrapper.querySelector('.subtaskCancel');
const subtaskCheck = subtaskWrapper.querySelector('.subtaskCheck');
const subtaskList = subtaskWrapper.parentElement.querySelector('.subtaskList');
subtaskInput.addEventListener('input', () => {
    subtaskWrapper.classList.toggle('isWriting', subtaskInput.value.trim() !== '');
});
subtaskCancel.addEventListener('click', () => {
    subtaskInput.value = '';
    subtaskWrapper.classList.remove('isWriting');
    subtaskInput.focus();
});


/** * Adds a new subtask to the subtask list based on the input value. */
function addSubtask() {
    const subtaskText = subtaskInput.value.trim();
    if (!subtaskText) return;
    const listItem = document.createElement('li');
    const row = document.createElement('div');
    row.className = 'subtaskRow';
    row.append(buildSubtaskTextGroup(subtaskText), buildSubtaskActions());
    listItem.append(row);
    subtaskList.appendChild(listItem);
    subtaskInput.value = '';
    subtaskWrapper.classList.remove('isWriting');
    subtaskInput.focus();
}


subtaskCheck.addEventListener('click', addSubtask);
subtaskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtask();
    }
});


/** * Initiates the editing of a subtask, replacing the text with an input field and setting up event handlers.
 * @param {HTMLElement} listItem - The list item element containing the subtask to edit.
 */
function editSubtask(listItem) {
    const textSpan = listItem.querySelector('.subtaskText');
    if (!textSpan) return;
    const currentText = textSpan.textContent;
    const editIcon = listItem.querySelector('.subtaskEdit');
    listItem.classList.add('isEditing');
    enterSubtaskEditIcon(editIcon);
    const editInput = createSubtaskEditInput(currentText);
    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    const stopEditing = (newText) => finishSubtaskEdit(listItem, editIcon, editInput, currentText, newText);
    wireSubtaskEditEvents(editInput, stopEditing);
    listItem._saveEdit = () => stopEditing(editInput.value.trim());
}


subtaskList.addEventListener('dblclick', (event) => {
    if (event.target.closest('.subtaskEditInput')) return;
    const listItem = event.target.closest('li');
    if (!listItem) return;
    editSubtask(listItem);
});


subtaskList.addEventListener('mousedown', (event) => {
    if (event.target.closest('.subtaskItemActions')) {
        event.preventDefault();
    }
});


subtaskList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (!listItem) return;
    if (event.target.classList.contains('subtaskEdit')) {
        editSubtask(listItem);
    } else if (event.target.classList.contains('subtaskDelete')) {
        listItem.remove();
    } else if (event.target.classList.contains('subtaskSaveEdit')) {
        listItem._saveEdit();
    }
});


/** * Retrieves the URL for adding a new task to the database.
 * @returns {string} The URL for adding a new task.
 */
function getAddTaskUrl() {
    return getDatabaseUrl('tasks');
}


/** * Retrieves the form data for creating a new task, including title, description, due date, priority, category, assigned contacts, and subtasks.
 * @returns {Object} An object containing the new task data.
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
        column: 'todo'
    };
    if (Object.keys(subtasks).length) task.subtasks = subtasks;
    return task;
}


/** * Sends a POST request to add a new task to the database.
 * @param {Object} task - The task data to be added.
 * @returns {Promise<Response>} A promise that resolves to the response of the fetch request.
 */
function postNewTask(task) {
    return fetch(getAddTaskUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
}


const createTaskButton = document.querySelector('.createTask');
updateCreateTaskButtonState();


createTaskButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const firstInvalid = validateRequiredFields();
    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }
    createTaskButton.disabled = true;
    await postNewTask(getTaskFormData());
    clearForm();
    showTaskAddedToast();
});


/** * Displays a toast notification indicating that a task has been added and redirects to the board page after a delay. */
const taskAddedToast = document.querySelector('.taskAddedToast');
function showTaskAddedToast() {
    taskAddedToast.classList.add('show');
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 2000);
}


/** * Clears the task form, resetting all input fields, checkboxes, and the subtask list to their default states. */
function clearForm() {
    titleInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    assignetToInput.value = '';
    categoryInput.value = '';
    document.querySelectorAll('.contactCheckbox:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });
    renderSelectedContacts();
    document.getElementById('medium').checked = true;
    subtaskList.innerHTML = '';
    updateCreateTaskButtonState();
}
