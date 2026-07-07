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

closeDropdown(assignetToInput, renderSelectedContacts);

categoryInput.addEventListener('click',()=>{
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