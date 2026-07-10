function dropdownToggle(element, onClose) {
    const dropdown = element.parentElement.querySelector('.dropdownContent');
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
    element.classList.toggle('open', !isOpen);
    if (isOpen && onClose) onClose();
}

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

function setupDropdownToggle(input, onClose) {
    const wrapper = input.parentElement;
    const arrow = wrapper.querySelector('.inputIcon');
    input.addEventListener('click', () => dropdownToggle(wrapper, onClose));
    arrow.addEventListener('click', () => dropdownToggle(wrapper, onClose));
}

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

function renderAssignetToContacts(contacts) {
    const dropdownContent = assignetToInput.closest('.dropdownList').querySelector('.dropdownContent');
    dropdownContent.innerHTML = '';
    for (let key in contacts) {
        const contact = contacts[key];
        const contactColor = getUserColor(contact.color);
        const row = document.createElement('label');
        row.innerHTML = `
            <div class="contactInfoWrapper">
                <div class="contactAvatar" style="background:${contactColor}; color:${getUserTextColor(contactColor)}">${getUserInitials(contact.name)}</div>
                <span>${contact.name}</span>
            </div>
            <input type="checkbox" class="contactCheckbox" data-id="${key}" data-name="${contact.name}" data-initials="${getUserInitials(contact.name)}" data-color="${contactColor}" data-text-color="${getUserTextColor(contactColor)}">
        `;
        dropdownContent.appendChild(row);
    }
}

fetch(BASE_URL + 'contacts.json')
    .then((response) => response.json())
    .then((contacts) => renderAssignetToContacts(contacts));

function showError(input, errorEl) {
    input.classList.add('inputError');
    errorEl.textContent = 'This field is required';
}

function clearError(input, errorEl) {
    input.classList.remove('inputError');
    errorEl.textContent = '';
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

function addSubtask() {
    const subtaskText = subtaskInput.value.trim();
    if (!subtaskText) return;
    const listItem = document.createElement('li');

    const row = document.createElement('div');
    row.className = 'subtaskRow';

    const textGroup = document.createElement('div');
    textGroup.className = 'subtaskTextGroup';

    const bullet = document.createElement('span');
    bullet.className = 'subtaskBullet';
    bullet.textContent = '•';

    const textSpan = document.createElement('span');
    textSpan.className = 'subtaskText';
    textSpan.textContent = subtaskText;

    textGroup.append(bullet, textSpan);

    const actions = document.createElement('div');
    actions.className = 'subtaskItemActions';
    actions.innerHTML = `
        <img class="subtaskEdit" src="../assets/icons/edit.png" alt="edit">
        <img class="subtaskDelete" src="../assets/icons/delete.png" alt="delete">
    `;

    row.append(textGroup, actions);
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

function editSubtask(listItem) {
    const textSpan = listItem.querySelector('.subtaskText');
    if (!textSpan) return;
    const currentText = textSpan.textContent;
    const editIcon = listItem.querySelector('.subtaskEdit');

    listItem.classList.add('isEditing');
    editIcon.src = '../assets/icons/check.png';
    editIcon.alt = 'save';
    editIcon.classList.replace('subtaskEdit', 'subtaskSaveEdit');

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'subtaskEditInput';
    editInput.value = currentText;
    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    function stopEditing(newText) {
        const newSpan = document.createElement('span');
        newSpan.className = 'subtaskText';
        newSpan.textContent = newText;
        editInput.replaceWith(newSpan);
        listItem.classList.remove('isEditing');
        editIcon.src = '../assets/icons/edit.png';
        editIcon.alt = 'edit';
        editIcon.classList.replace('subtaskSaveEdit', 'subtaskEdit');
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

function getAddTaskUrl() {
    if (getCurrentUserId() === guestUserId) {
        return getUserDatabaseUrl(guestUserId, 'tasks');
    }
    return getDatabaseUrl('tasks');
}

function getTaskFormData() {
    const assignedTo = Array.from(document.querySelectorAll('.contactCheckbox:checked')).map((checkbox) => ({
        id: checkbox.dataset.id,
        type: 'contact'
    }));
    const subtasks = {};
    subtaskList.querySelectorAll('.subtaskText').forEach((textSpan, index) => {
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

const createTaskButton = document.querySelector('.createTask');

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
