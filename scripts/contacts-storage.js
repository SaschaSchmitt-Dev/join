/**
 * Creates a new contact.
 */
async function createContact() {
    const newContact = getContactFormData();

    await postNewContact(newContact);
    addContactForm.reset();
    closeAddContactOverlay();
    await loadContacts();
    showContactToast("Contact successfully created");
}


/**
 * Gets the contact form data.
 * @returns {Object} The contact form data.
 */
function getContactFormData() {
    return {
        name: document.getElementById("contactName").value.trim(),
        email: document.getElementById("contactEmail").value.trim(),
        phone: document.getElementById("contactPhone").value.trim(),
        color: selectedContactColor || getRandomContactColor()
    };
}


/**
 * Saves a new contact.
 * @param {Object} contact - The new contact data.
 * @returns {Promise<Response>} The post request.
 */
function postNewContact(contact) {
    return fetch(getContactsUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    });
}


/**
 * Saves the edited contact.
 */
async function saveContact() {
    const contact = contacts[currentContactIndex];

    if (!contact) return;

    const updatedContact = getUpdatedContactData(contact);

    await patchContact(contact.id, updatedContact);
    await updateActiveUserAfterContactEdit(contact, updatedContact);
    await loadContacts();

    currentContactIndex = getContactIndexById(contact.id);
    renderSavedContact();
    closeAddContactOverlay();
}


/**
 * Gets the updated contact data.
 * @param {Object} contact - The selected contact.
 * @returns {Object} The updated contact data.
 */
function getUpdatedContactData(contact) {
    return {
        name: document.getElementById("contactName").value.trim(),
        email: document.getElementById("contactEmail").value.trim(),
        phone: document.getElementById("contactPhone").value.trim(),
        color: selectedContactColor || contact.color || getRandomContactColor(),
        contactColor: null
    };
}


/**
 * Updates a contact in the database.
 * @param {string} contactId - The contact id.
 * @param {Object} updatedContact - The updated contact data.
 * @returns {Promise<Response>} The patch request.
 */
function patchContact(contactId, updatedContact) {
    return fetch(getContactsUrl(contactId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContact)
    });
}


/**
 * Gets the index of a contact by id.
 * @param {string} contactId - The contact id.
 * @returns {number} The contact index.
 */
function getContactIndexById(contactId) {
    return contacts.findIndex(function (contact) {
        return contact.id === contactId;
    });
}


/**
 * Renders the saved contact.
 */
function renderSavedContact() {
    if (currentContactIndex === -1) return;

    renderContacts();
    renderContactDetails(contacts[currentContactIndex]);
}