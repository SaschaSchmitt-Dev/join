function resetAddModalText() {
    modal.classList.remove("edit-mode");
    modalTitle.textContent = "Add contact";
    modalSubtitle.textContent = "Tasks are better with a team!";
    modalSubtitle.style.display = "block";
}


function resetAddAvatar() {
    contactPlaceholder.classList.remove("edit-mode");
    contactPlaceholder.style.background = "#D1D1D1";
    contactAvatarInitials.style.color = "";
    contactAvatarInitials.textContent = "";
}


function setAddButtons() {
    secondaryBtnText.textContent = "Cancel";
    secondaryBtnIcon.style.display = "block";
    submitBtnText.textContent = "Create contact";
}


function clearColorOptions() {
    if (colorOptions) {
        colorOptions.innerHTML = "";
    }
}


function setEditMode(contact) {
    modal.classList.add("edit-mode");
    setEditModalText();
    fillContactForm(contact);
    setEditAvatar(contact);
    setEditButtons();
    renderColorOptions();
}


function setEditModalText() {
    modalTitle.textContent = "Edit contact";
    modalSubtitle.style.display = "none";
}


function fillContactForm(contact) {
    document.getElementById("contact-name").value = contact.name;
    document.getElementById("contact-email").value = contact.email;
    document.getElementById("contact-phone").value = contact.phone || "";
}


function setEditAvatar(contact) {
    selectedContactColor = contact.color || contact.contactColor || "var(--profile-orange)";
    contactPlaceholder.classList.add("edit-mode");
    contactPlaceholder.style.background = selectedContactColor;
    contactAvatarInitials.style.color = getUserTextColor(selectedContactColor);
    contactAvatarInitials.textContent = getUserInitials(contact.name);
}


function setEditButtons() {
    secondaryBtnText.textContent = "Delete";
    secondaryBtnIcon.style.display = "none";
    submitBtnText.textContent = "Save";
}


function selectContactColor(color) {
    selectedContactColor = color;

    contactPlaceholder.style.background = color;
    contactAvatarInitials.style.color = getUserTextColor(color);

    renderColorOptions();
}


function getRandomContactColor() {
    return getRandomProfileColor();
}

function renderContactDetails(contact) {
    const contactDetails = document.getElementById("contact-details");
    const contactColor = getContactAvatarColor(contact);

    contactDetails.innerHTML = getContactsHeaderTemplate() + getContactDetailTemplate(contact, contactColor);
}


function renderContacts() {
    const contactsList = document.getElementById("contacts-list");
    contactsList.innerHTML = "";

    let currentLetter = "";

    contacts.forEach(function (contact, index) {
        currentLetter = renderContactEntry(contactsList, contact, index, currentLetter);
    });
}


function renderContactEntry(contactsList, contact, index, currentLetter) {
    const firstLetter = contact.name.charAt(0).toUpperCase();

    if (firstLetter !== currentLetter) {
        contactsList.innerHTML += getContactGroupTemplate(firstLetter);
        currentLetter = firstLetter;
    }

    contactsList.innerHTML += getRenderedContactCard(contact, index);
    return currentLetter;
}


function getRenderedContactCard(contact, index) {
    const activeClass = index === currentContactIndex ? "active" : "";
    const contactColor = getContactAvatarColor(contact);

    return getContactCardTemplate(contact, index, activeClass, contactColor);
}


function getContactAvatarColor(contact) {
    return contact.color || contact.contactColor || "var(--profile-orange)";
}


function renderColorOptions() {
    if (!colorOptions) return;

    colorOptions.innerHTML = "";

    profileColors.forEach(function (color) {
        colorOptions.innerHTML += getRenderedColorOption(color);
    });
}


function getRenderedColorOption(color) {
    const activeClass = color === selectedContactColor ? "active" : "";

    return getColorOptionTemplate(color, activeClass);
}


function renderEmptyContactDetails() {
    const contactDetails = document.getElementById("contact-details");

    contactDetails.innerHTML = getContactsHeaderTemplate();
}
