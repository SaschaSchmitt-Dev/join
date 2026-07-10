function dropdownToggle(element, onClose) {
    const dropdown = element.parentElement.querySelector('.dropdown-content');
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
    element.classList.toggle('open', !isOpen);
    if (isOpen && onClose) onClose();
}

function closeDropdown(input, onClose) {
    document.addEventListener('click', (event) => {
        const dropdownList = input.closest('.dropdown-list');
        if (!dropdownList.contains(event.target)) {
            dropdownList.querySelector('.dropdown-content').style.display = 'none';
            dropdownList.querySelector('.input-wrapper').classList.remove('open');
            if (onClose) onClose();
        }
    });
}

const assignetToInput = document.getElementById('assignet-to');
const categoryInput = document.getElementById('category')

function resetAssignetToDropdown() {
    assignetToInput.value = '';
    assignetToInput.closest('.dropdown-list').querySelectorAll('.dropdown-content label').forEach((label) => {
        label.style.display = '';
    });
    renderSelectedContacts();
}

assignetToInput.addEventListener('click', () => {
    dropdownToggle(assignetToInput.parentElement, resetAssignetToDropdown);
});

const assignetToArrow = assignetToInput.parentElement.querySelector('.input-icon');
assignetToArrow.addEventListener('click', () => {
    dropdownToggle(assignetToArrow.parentElement, resetAssignetToDropdown);
});

closeDropdown(assignetToInput, resetAssignetToDropdown);

assignetToInput.addEventListener('input', () => {
    const query = assignetToInput.value.toLowerCase();
    const dropdownContent = assignetToInput.closest('.dropdown-list').querySelector('.dropdown-content');
    dropdownContent.style.display = 'block';
    assignetToInput.parentElement.classList.add('open');
    dropdownContent.querySelectorAll('label').forEach((label) => {
        const name = label.querySelector('span').textContent.toLowerCase();
        label.style.display = name.startsWith(query) ? '' : 'none';
    });
});

categoryInput.addEventListener('click', () => {
    dropdownToggle(categoryInput.parentElement)
})

const categoryArrow = categoryInput.parentElement.querySelector('.input-icon');
categoryArrow.addEventListener('click', () => {
    dropdownToggle(categoryArrow.parentElement);
});

closeDropdown(categoryInput);

const categoryDropdownContent = categoryInput.closest('.dropdown-list').querySelector('.dropdown-content');

categoryDropdownContent.querySelectorAll('a').forEach((option) => {
    option.addEventListener('click', (event) => {
        event.preventDefault();
        categoryInput.value = option.textContent;
        categoryDropdownContent.style.display = 'none';
    });
});

function renderSelectedContacts() {
    const selectedContacts = document.querySelector('.selected-contacts');
    selectedContacts.innerHTML = '';
    const checkedBoxes = document.querySelectorAll('.contact-checkbox:checked');
    checkedBoxes.forEach((checkbox) => {
        const avatar = document.createElement('div');
        avatar.className = 'contact-avatar';
        avatar.style.background = checkbox.dataset.color;
        avatar.style.color = checkbox.dataset.textColor;
        avatar.textContent = checkbox.dataset.initials;
        selectedContacts.appendChild(avatar);
    });
}

function renderAssignetToContacts(contacts) {
    const dropdownContent = assignetToInput.closest('.dropdown-list').querySelector('.dropdown-content');
    dropdownContent.innerHTML = '';
    for (let key in contacts) {
        const contact = contacts[key];
        const contactColor = getUserColor(contact.color);
        const row = document.createElement('label');
        row.innerHTML = `
            <div class="contact-info-wrapper">
                <div class="contact-avatar" style="background:${contactColor}; color:${getUserTextColor(contactColor)}">${getUserInitials(contact.name)}</div>
                <span>${contact.name}</span>
            </div>
            <input type="checkbox" class="contact-checkbox" data-id="${key}" data-name="${contact.name}" data-initials="${getUserInitials(contact.name)}" data-color="${contactColor}" data-text-color="${getUserTextColor(contactColor)}">
        `;
        dropdownContent.appendChild(row);
    }
}

fetch(BASE_URL + 'contacts.json')
    .then((response) => response.json())
    .then((contacts) => renderAssignetToContacts(contacts));

function showError(input, errorEl) {
    input.classList.add('input-error');
    errorEl.textContent = 'This field is required';
}

function clearError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.textContent = '';
}

const titleInput = document.getElementById('title');
const titleError = document.getElementById('title-error');

titleInput.addEventListener('blur', () => {
    if (!titleInput.value.trim()) showError(titleInput, titleError);
});
titleInput.addEventListener('input', () => {
    if (titleInput.value.trim()) clearError(titleInput, titleError);
    updateCreateTaskButtonState();
});

const dueDateInput = document.getElementById('due-date');
const dueDateError = document.getElementById('due-date-error');

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

const categoryError = document.getElementById('category-error');

categoryInput.addEventListener('blur', () => {
    if (!categoryInput.value.trim()) showError(categoryInput, categoryError);
});
categoryDropdownContent.querySelectorAll('a').forEach((option) => {
    option.addEventListener('click', () => {
        clearError(categoryInput, categoryError);
        updateCreateTaskButtonState();
    });
});

function getAddTaskUrl() {
    if (getCurrentUserId() === guestUserId) {
        return getUserDatabaseUrl(guestUserId, 'tasks');
    }
    return getDatabaseUrl('tasks');
}

function getTaskFormData() {
    const assignedTo = Array.from(document.querySelectorAll('.contact-checkbox:checked')).map((checkbox) => ({
        id: checkbox.dataset.id,
        type: 'contact'
    }));
    const subtasks = {};
    subtaskList.querySelectorAll('.subtask-text').forEach((textSpan, index) => {
        const subtaskId = 's' + String(index + 1).padStart(3, '0');
        subtasks[subtaskId] = { title: textSpan.textContent, completed: false };
    });

    const task = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        dueDate: dueDateInput.value,
        priority: document.querySelector('input[name="priority"]:checked').value,
        category: categoryInput.value.trim(),
        assignedTo,
        column: 'todo'
    };
    if (Object.keys(subtasks).length) task.subtasks = subtasks;
    return task;
}

function postNewTask(task) {
    return fetch(getAddTaskUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
}

const createTaskButton = document.querySelector('.create-task');

function updateCreateTaskButtonState() {
    const isFilled = titleInput.value.trim() && dueDateInput.value && categoryInput.value.trim();
    createTaskButton.disabled = !isFilled;
}

updateCreateTaskButtonState();

createTaskButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const fields = [
        { input: titleInput, error: titleError, isEmpty: () => !titleInput.value.trim() },
        { input: dueDateInput, error: dueDateError, isEmpty: () => !dueDateInput.value },
        { input: categoryInput, error: categoryError, isEmpty: () => !categoryInput.value.trim() },
    ];
    let firstInvalid = null;
    fields.forEach(({ input, error, isEmpty }) => {
        if (isEmpty()) {
            if (input === dueDateInput) input.type = 'text';
            showError(input, error);
            firstInvalid = firstInvalid || input;
        }
    });
    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }
    await postNewTask(getTaskFormData());
    clearForm();
});

const descriptionInput = document.getElementById('description');

function clearForm() {
    titleInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    assignetToInput.value = '';
    categoryInput.value = '';
    document.querySelectorAll('.contact-checkbox:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });
    renderSelectedContacts();
    document.getElementById('medium').checked = true;
    subtaskList.innerHTML = '';
    updateCreateTaskButtonState();
}

const subtaskInput = document.getElementById('subtasks');
const subtaskWrapper = subtaskInput.closest('.subtask-input-wrapper');
const subtaskCancel = subtaskWrapper.querySelector('.subtask-cancel');
const subtaskCheck = subtaskWrapper.querySelector('.subtask-check');
const subtaskList = subtaskWrapper.parentElement.querySelector('.subtask-list');

subtaskInput.addEventListener('input', () => {
    subtaskWrapper.classList.toggle('is-writing', subtaskInput.value.trim() !== '');
});

subtaskCancel.addEventListener('click', () => {
    subtaskInput.value = '';
    subtaskWrapper.classList.remove('is-writing');
    subtaskInput.focus();
});

function addSubtask() {
    const subtaskText = subtaskInput.value.trim();
    if (!subtaskText) return;
    const listItem = document.createElement('li');

    const row = document.createElement('div');
    row.className = 'subtask-row';

    const textGroup = document.createElement('div');
    textGroup.className = 'subtask-text-group';

    const bullet = document.createElement('span');
    bullet.className = 'subtask-bullet';
    bullet.textContent = '•';

    const textSpan = document.createElement('span');
    textSpan.className = 'subtask-text';
    textSpan.textContent = subtaskText;

    textGroup.append(bullet, textSpan);

    const actions = document.createElement('div');
    actions.className = 'subtask-item-actions';
    actions.innerHTML = `
        <img class="subtask-edit" src="../assets/icons/edit.png" alt="edit">
        <img class="subtask-delete" src="../assets/icons/delete.png" alt="delete">
    `;

    row.append(textGroup, actions);
    listItem.append(row);
    subtaskList.appendChild(listItem);
    subtaskInput.value = '';
    subtaskWrapper.classList.remove('is-writing');
    subtaskInput.focus();
}

subtaskCheck.addEventListener('click', addSubtask);

subtaskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtask();
    }
});

function editSubtask(listItem) {
    const textSpan = listItem.querySelector('.subtask-text');
    if (!textSpan) return;
    const currentText = textSpan.textContent;
    const editIcon = listItem.querySelector('.subtask-edit');

    listItem.classList.add('is-editing');
    editIcon.src = '../assets/icons/check.png';
    editIcon.alt = 'save';
    editIcon.classList.replace('subtask-edit', 'subtask-save-edit');

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'subtask-edit-input';
    editInput.value = currentText;
    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    function stopEditing(newText) {
        const newSpan = document.createElement('span');
        newSpan.className = 'subtask-text';
        newSpan.textContent = newText;
        editInput.replaceWith(newSpan);
        listItem.classList.remove('is-editing');
        editIcon.src = '../assets/icons/edit.png';
        editIcon.alt = 'edit';
        editIcon.classList.replace('subtask-save-edit', 'subtask-edit');
    }

    editInput.addEventListener('blur', () => {
        stopEditing(editInput.value.trim() || currentText);
    });
    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            editInput.blur();
        }
    });

    listItem._saveEdit = () => stopEditing(editInput.value.trim() || currentText);
}

subtaskList.addEventListener('dblclick', (event) => {
    if (event.target.closest('.subtask-edit-input')) return;
    const listItem = event.target.closest('li');
    if (!listItem) return;
    editSubtask(listItem);
});

subtaskList.addEventListener('mousedown', (event) => {
    if (event.target.closest('.subtask-item-actions')) {
        event.preventDefault();
    }
});

subtaskList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (!listItem) return;
    if (event.target.classList.contains('subtask-edit')) {
        editSubtask(listItem);
    } else if (event.target.classList.contains('subtask-delete')) {
        listItem.remove();
    } else if (event.target.classList.contains('subtask-save-edit')) {
        listItem._saveEdit();
    }
});