function dropdownToggle(element) {
    const dropdown = element.parentElement.querySelector('.dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function closeDropdown(input, onClose) {
    document.addEventListener('click', (event) => {
        const dropdownList = input.closest('.dropdown-list');
        if (!dropdownList.contains(event.target)) {
            dropdownList.querySelector('.dropdown-content').style.display = 'none';
            if (onClose) onClose();
        }
    });
}

const assignetToInput = document.getElementById('assignet-to');
const categoryInput = document.getElementById('category')

assignetToInput.addEventListener('click', () => {
    dropdownToggle(assignetToInput.parentElement);
});

const assignetToArrow = assignetToInput.parentElement.querySelector('.input-icon');
assignetToArrow.addEventListener('click', () => {
    dropdownToggle(assignetToArrow.parentElement);
});

closeDropdown(assignetToInput, () => {
    assignetToInput.value = '';
    assignetToInput.closest('.dropdown-list').querySelectorAll('.dropdown-content label').forEach((label) => {
        label.style.display = '';
    });
    renderSelectedContacts();
});

assignetToInput.addEventListener('input', () => {
    const query = assignetToInput.value.toLowerCase();
    const dropdownContent = assignetToInput.closest('.dropdown-list').querySelector('.dropdown-content');
    dropdownContent.style.display = 'block';
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
            <input type="checkbox" class="contact-checkbox" data-initials="${getUserInitials(contact.name)}" data-color="${contactColor}" data-text-color="${getUserTextColor(contactColor)}">
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
});

const categoryError = document.getElementById('category-error');

categoryInput.addEventListener('blur', () => {
    if (!categoryInput.value.trim()) showError(categoryInput, categoryError);
});
categoryDropdownContent.querySelectorAll('a').forEach((option) => {
    option.addEventListener('click', () => clearError(categoryInput, categoryError));
});

document.querySelector('.create-task').addEventListener('click', (e) => {
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
    if (firstInvalid) firstInvalid.focus();
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
}