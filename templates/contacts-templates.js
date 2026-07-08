/**
 * Returns the contacts header template.
 * @returns {string} The contacts header HTML.
 */
function getContactsHeaderTemplate() {
    return `
        <div class="contacts-header">
            <h1>Contacts</h1>
            <div class="header-divider"></div>
            <span>Better with a team</span>
        </div>
    `;
}


/**
 * Returns the contact detail template.
 * @param {Object} contact - The selected contact.
 * @param {string} contactColor - The contact avatar color.
 * @returns {string} The contact detail HTML.
 */
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


/**
 * Returns the avatar template for the contact detail view.
 * @param {Object} contact - The selected contact.
 * @param {string} contactColor - The contact avatar color.
 * @returns {string} The contact detail avatar HTML.
 */
function getContactDetailAvatarTemplate(contact, contactColor) {
    return `
        <div class="contact-detail-avatar" style="background:${contactColor}; color:${getUserTextColor(contactColor)}">
            ${getUserInitials(contact.name)}
        </div>
    `;
}


/**
 * Returns the contact name section template.
 * @param {Object} contact - The selected contact.
 * @returns {string} The contact name HTML.
 */
function getContactDetailNameTemplate(contact) {
    return `
        <div class="contact-detail-name-box">
            <h2>${contact.name}</h2>
            ${getContactActionsTemplate()}
        </div>
    `;
}


/**
 * Returns the edit and delete button template.
 * @returns {string} The contact actions HTML.
 */
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


/**
 * Returns the contact information template.
 * @param {Object} contact - The selected contact.
 * @returns {string} The contact information HTML.
 */
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


/**
 * Returns the contact group template.
 * @param {string} letter - The contact group letter.
 * @returns {string} The contact group HTML.
 */
function getContactGroupTemplate(letter) {
    return `
        <div class="contact-group">
            <h3>${letter}</h3>
        </div>
    `;
}


/**
 * Returns one contact card template.
 * @param {Object} contact - The contact data.
 * @param {number} index - The contact index.
 * @param {string} activeClass - The active contact class.
 * @param {string} contactColor - The contact avatar color.
 * @returns {string} The contact card HTML.
 */
function getContactCardTemplate(contact, index, activeClass, contactColor) {
    return `
        <div class="contact-card ${activeClass}" onclick="showContact(${index})">
            ${getContactAvatarTemplate(contact, contactColor)}
            ${getContactInfoTemplate(contact)}
        </div>
    `;
}


/**
 * Returns the contact avatar template.
 * @param {Object} contact - The contact data.
 * @param {string} contactColor - The contact avatar color.
 * @returns {string} The contact avatar HTML.
 */
function getContactAvatarTemplate(contact, contactColor) {
    return `
        <div class="contact-avatar" style="background:${contactColor}; color:${getUserTextColor(contactColor)}">
            ${getUserInitials(contact.name)}
        </div>
    `;
}


/**
 * Returns the contact info template.
 * @param {Object} contact - The contact data.
 * @returns {string} The contact info HTML.
 */
function getContactInfoTemplate(contact) {
    return `
        <div class="contact-info">
            <h4>${contact.name}</h4>
            <p class="contact-email-detail">${contact.email}</p>
        </div>
    `;
}


/**
 * Returns one color option template.
 * @param {string} color - The contact color.
 * @param {string} activeClass - The active color class.
 * @returns {string} The color option HTML.
 */
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