function getContactsHeaderTemplate() {
    return `
        <div class="contacts-header">
            <h1>Contacts</h1>
            <div class="header-divider"></div>
            <span>Better with a team</span>
        </div>
    `;
}


function getContactDetailTemplate(contact, contactColor) {
    return `
        <div class="contact-detail-content">
            <div class="contact-detail-top">
                ${getContactDetailAvatarTemplate(contact, contactColor)}
                ${getContactDetailNameTemplate(contact)}
            </div>
            ${getContactInformationTemplate(contact)}
        </div>
    `;
}


function getContactDetailAvatarTemplate(contact, contactColor) {
    return `
        <div class="contact-detail-avatar" style="background:${contactColor}; color:${getUserTextColor(contactColor)}">
            ${getUserInitials(contact.name)}
        </div>
    `;
}


function getContactDetailNameTemplate(contact) {
    return `
        <div class="contact-detail-name-box">
            <h2>${contact.name}</h2>
            ${getContactActionsTemplate()}
        </div>
    `;
}


function getContactActionsTemplate() {
    return `
        <div class="contact-actions">
            <button type="button" onclick="openEditContactOverlay()">
                <img src="../assets/icons/edit.png" alt="Edit">
                <span>Edit</span>
            </button>

            <button type="button" onclick="deleteContact()">
                <img src="../assets/icons/delete.png" alt="Delete">
                <span>Delete</span>
            </button>
        </div>
    `;
}


function getContactInformationTemplate(contact) {
    return `
        <div class="contact-information">
            <h3>Contact Information</h3>
            <h4>Email</h4>
            <p class="contact-email">${contact.email}</p>
            <h4>Phone</h4>
            <p>${contact.phone || ""}</p>
        </div>
    `;
}


function getContactGroupTemplate(letter) {
    return `
        <div class="contact-group">
            <h3>${letter}</h3>
        </div>
    `;
}


function getContactCardTemplate(contact, index, activeClass, contactColor) {
    return `
        <div class="contact-card ${activeClass}" onclick="showContact(${index})">
            ${getContactAvatarTemplate(contact, contactColor)}
            ${getContactInfoTemplate(contact)}
        </div>
    `;
}


function getContactAvatarTemplate(contact, contactColor) {
    return `
        <div class="contact-avatar" style="background:${contactColor}; color:${getUserTextColor(contactColor)}">
            ${getUserInitials(contact.name)}
        </div>
    `;
}


function getContactInfoTemplate(contact) {
    return `
        <div class="contact-info">
            <h4>${contact.name}</h4>
            <p class="contact-email-detail">${contact.email}</p>
        </div>
    `;
}


function getColorOptionTemplate(color, activeClass) {
    return `
        <button
            type="button"
            class="color-option ${activeClass}"
            style="background:${color}"
            onclick="selectContactColor('${color}')">
        </button>
    `;
}