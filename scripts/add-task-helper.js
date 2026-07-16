/**
 * @fileoverview Helper functions for the Add Task page: dropdown toggling, contact/subtask DOM builders, and form validation.
 */

/**
 * Toggles the dropdown open/closed for the given wrapper element.
 * @param {HTMLElement} element - The dropdown's wrapper element (e.g. .inputWrapper).
 * @param {Function} [onClose] - Optional callback function to execute when the dropdown is closed.
 */
function dropdownToggle(element, onClose) {
    const dropdown = element.parentElement.querySelector('.dropdownContent');
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
    element.classList.toggle('open', !isOpen);
    if (isOpen && onClose) onClose();
}


/**
 * Closes the dropdown when clicking outside of it.
 * @param {HTMLElement} input - The input element associated with the dropdown.
 * @param {Function} [onClose] - Optional callback function to execute when the dropdown is closed.
 */
function closeDropdown(input, onClose) {
    document.addEventListener('click', (event) => {
        const dropdownList = input.closest('.dropdownList');
        if (!dropdownList.contains(event.target)) {
            dropdownList.querySelector('.dropdownContent').style.display = 'none';
            dropdownList.querySelector('.inputWrapper').classList.remove('open');
            if (onClose) onClose();
        }
    });
}


/**
 * Sets up the dropdown toggle functionality for the specified input element.
 * @param {HTMLElement} input - The input element associated with the dropdown.
 * @param {Function} [onClose] - Optional callback function to execute when the dropdown is closed.
 */
function setupDropdownToggle(input, onClose) {
    const wrapper = input.parentElement;
    const arrow = wrapper.querySelector('.inputIcon');
    input.addEventListener('click', () => dropdownToggle(wrapper, onClose));
    arrow.addEventListener('click', () => dropdownToggle(wrapper, onClose));
}


/**
 * Builds a contact row element for the dropdown list.
 * @param {string} key - The unique identifier for the contact.
 * @param {Object} contact - The contact object containing name and color information.
 * @returns {HTMLElement} The constructed contact row element.
 */
function buildContactRow(key, contact) {
    const contactColor = getUserColor(contact.color);
    const displayName = getContactDisplayName(contact);
    const row = document.createElement('label');

    row.innerHTML = `
        <div class="contactInfoWrapper">
            <div class="contactAvatar" style="background:${contactColor}; color:${getUserTextColor(contactColor)}">${getUserInitials(contact.name)}</div>
            <span>${displayName}</span>
        </div>
        <input type="checkbox" class="contactCheckbox" data-id="${key}" data-name="${contact.name}" data-initials="${getUserInitials(contact.name)}" data-color="${contactColor}" data-text-color="${getUserTextColor(contactColor)}">
    `;

    return row;
}


/**
 * Builds a subtask text group element with a bullet point and the provided text.
 * @param {string} text - The text for the subtask.
 * @returns {HTMLElement} The constructed subtask text group element.
 */
function buildSubtaskTextGroup(text) {
    const textGroup = document.createElement('div');
    textGroup.className = 'subtaskTextGroup';
    const bullet = document.createElement('span');
    bullet.className = 'subtaskBullet';
    bullet.textContent = '•';
    const textSpan = document.createElement('span');
    textSpan.className = 'subtaskText';
    textSpan.textContent = text;
    textGroup.append(bullet, textSpan);
    return textGroup;
}


/**
 * Builds a subtask actions element with edit and delete icons.
 * @returns {HTMLElement} The constructed subtask actions element.
 */
function buildSubtaskActions() {
    const actions = document.createElement('div');
    actions.className = 'subtaskItemActions';
    actions.innerHTML = `
        <img class="subtaskEdit" src="../assets/icons/edit.png" alt="edit">
        <img class="subtaskDelete" src="../assets/icons/delete.png" alt="delete">
    `;
    return actions;
}


/**
 * Changes the edit icon to a save icon when entering edit mode for a subtask.
 * @param {HTMLElement} editIcon - The edit icon element to change.
 */
function enterSubtaskEditIcon(editIcon) {
    editIcon.src = '../assets/icons/check.png';
    editIcon.alt = 'save';
    editIcon.classList.replace('subtaskEdit', 'subtaskSaveEdit');
}


/**
 * Changes the save icon back to an edit icon when exiting edit mode for a subtask.
 * @param {HTMLElement} editIcon - The edit icon element to change.
 */
function exitSubtaskEditIcon(editIcon) {
    editIcon.src = '../assets/icons/edit.png';
    editIcon.alt = 'edit';
    editIcon.classList.replace('subtaskSaveEdit', 'subtaskEdit');
}


/**
 * Creates an input element for editing a subtask with the current text.
 * @param {string} currentText - The current text of the subtask to edit.
 * @returns {HTMLElement} The constructed input element for editing the subtask.
 */
function createSubtaskEditInput(currentText) {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'subtaskEditInput';
    editInput.value = currentText;
    return editInput;
}


/**
 * Finalizes the editing of a subtask, replacing the input with the new text and updating the UI.
 * @param {HTMLElement} listItem - The list item element containing the subtask.
 * @param {HTMLElement} editIcon - The edit icon element to revert back to.
 * @param {HTMLElement} editInput - The input element used for editing the subtask.
 * @param {string} currentText - The original text of the subtask before editing.
 * @param {string} newText - The new text entered by the user for the subtask.
 */
function finishSubtaskEdit(listItem, editIcon, editInput, currentText, newText) {
    const newSpan = document.createElement('span');
    newSpan.className = 'subtaskText';
    newSpan.textContent = newText || currentText;
    editInput.replaceWith(newSpan);
    listItem.classList.remove('isEditing');
    exitSubtaskEditIcon(editIcon);
}


/**
 * Wires the necessary events for editing a subtask, including blur and keydown events.
 * @param {HTMLElement} editInput - The input element used for editing the subtask.
 * @param {Function} onDone - The callback function to execute when editing is done.
 */
function wireSubtaskEditEvents(editInput, onDone) {
    editInput.addEventListener('blur', () => onDone(editInput.value.trim()));
    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            editInput.blur();
        }
    });
}


/**
 * Retrieves the list of assigned contacts from the checked checkboxes in the "Assigned To" dropdown.
 * @returns {Array<Object>} An array of assigned contact objects, each containing an id and type.
 */
function getAssignedContacts() {
    return Array.from(document.querySelectorAll('.contactCheckbox:checked')).map((checkbox) => ({
        id: checkbox.dataset.id,
        type: 'contact'
    }));
}


/**
 * Retrieves the data for all subtasks currently in the subtask list.
 * @returns {Object} An object containing subtask data, with keys as subtask IDs and values as subtask details.
 */
function getSubtasksData() {
    const subtasks = {};
    subtaskList.querySelectorAll('.subtaskText').forEach((textSpan, index) => {
        const subtaskId = 's' + String(index + 1).padStart(3, '0');
        subtasks[subtaskId] = { title: textSpan.textContent, completed: false };
    });
    return subtasks;
}


/**
 * Validates the required fields in the task form and displays error messages for any empty fields.
 * @returns {HTMLElement|null} The first invalid input element, or null if all required fields are valid.
 */
function validateRequiredFields() {
    const fields = [
        { input: titleInput, error: titleError, isEmpty: () => !titleInput.value.trim() },
        { input: dueDateInput, error: dueDateError, isEmpty: () => !dueDateInput.value },
        { input: categoryInput, error: categoryError, isEmpty: () => !categoryInput.value.trim() },
    ];
    fields.forEach(({ input, error, isEmpty }) => {
        if (isEmpty()) {
            if (input === dueDateInput) input.type = 'text';
            showError(input, error);
        }
    });
    return fields.find(({ isEmpty }) => isEmpty())?.input || null;
}


/**
 * Saves a new task in the database.
 *
 * @param {Object} task - The task data to save.
 * @returns {Promise<Response>} The fetch response.
 */
function postNewTask(task) {
    return fetch(getAddTaskUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });
}


/**
 * Shows the success toast and redirects to the board.
 */
function showTaskAddedToast() {
    taskAddedToast.classList.add("show");

    setTimeout(() => {
        window.location.href = "board.html";
    }, 2000);
}


/**
 * Clears the task form and resets all dynamic UI elements.
 */
function clearForm() {
    clearTaskInputs();
    clearTaskErrors();
    resetTaskSelections();
    subtaskList.innerHTML = "";
    updateCreateTaskButtonState();
}


/**
 * Clears all basic task input values.
 */
function clearTaskInputs() {
    titleInput.value = "";
    descriptionInput.value = "";
    dueDateInput.value = "";
    dueDateInput.type = "text";
    assignetToInput.value = "";
    categoryInput.value = "";
}


/**
 * Clears all required-field error messages.
 */
function clearTaskErrors() {
    clearError(titleInput, titleError);
    clearError(dueDateInput, dueDateError);
    clearError(categoryInput, categoryError);
}


/**
 * Resets assigned contacts and the selected priority.
 */
function resetTaskSelections() {
    document.querySelectorAll(".contactCheckbox:checked").forEach((checkbox) => {
        checkbox.checked = false;
    });
    renderSelectedContacts();
    document.getElementById("medium").checked = true;
    updatePriorityAriaState(document.querySelector(".priorityGroup"));
}
