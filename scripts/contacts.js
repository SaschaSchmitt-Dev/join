let contacts = [];
let currentContactIndex = null;
let modalMode = "add";
let selectedContactColor = "var(--profile-orange)";


const overlay = document.getElementById("add-contact-overlay");
const modal = document.querySelector(".add-contact-modal");
const addContactBtn = document.getElementById("add-contact-btn");
const mobileAddContactBtn = document.getElementById("mobile-add-contact-btn");
const mobileMoreBtn = document.querySelector(".mobile-more-btn");
const mobileBackBtn = document.querySelector(".mobile-back-btn");
const closeContactModal = document.getElementById("close-contact-modal");
const cancelContactBtn = document.getElementById("cancel-contact-btn");
const addContactForm = document.getElementById("add-contact-form");
const contactsPage = document.querySelector(".contacts-page");
const modalTitle = document.getElementById("contact-modal-title");
const modalSubtitle = document.getElementById("contact-modal-subtitle");
const contactPlaceholder = document.getElementById("contact-placeholder");
const contactAvatarInitials = document.getElementById("contact-avatar-initials");
const secondaryBtnText = document.getElementById("secondary-btn-text");
const secondaryBtnIcon = document.getElementById("secondary-btn-icon");
const submitBtnText = document.getElementById("submit-btn-text");
const colorOptions = document.getElementById("color-options");
const mobileOptionsMenu = document.getElementById("mobile-options-menu");
const mobileEditContactBtn = document.getElementById("mobile-edit-contact-btn");
const mobileDeleteContactBtn = document.getElementById("mobile-delete-contact-btn");
const contactToast = document.getElementById("contact-toast");

if (addContactBtn) addContactBtn.addEventListener("click", openAddContactOverlay);
if (mobileAddContactBtn) mobileAddContactBtn.addEventListener("click", openAddContactOverlay);
if (mobileMoreBtn) mobileMoreBtn.addEventListener("click", toggleMobileOptionsMenu);
if (mobileBackBtn) mobileBackBtn.addEventListener("click", closeMobileContactView);
if (closeContactModal) closeContactModal.addEventListener("click", closeAddContactOverlay);
if (cancelContactBtn) cancelContactBtn.addEventListener("click", handleSecondaryButton);
if (addContactForm) addContactForm.addEventListener("submit", handleContactSubmit);

if (mobileEditContactBtn) {
    mobileEditContactBtn.addEventListener("click", function () {
        closeMobileOptionsMenu();
        openEditContactOverlay();
    });
}

if (mobileDeleteContactBtn) {
    mobileDeleteContactBtn.addEventListener("click", function () {
        closeMobileOptionsMenu();
        deleteContact();
    });
}

if (overlay) {
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeAddContactOverlay();
        }
    });
}

if (modal) {
    modal.addEventListener("click", function (event) {
        event.stopPropagation();
    });
}

document.addEventListener("click", function (event) {
    if (!mobileOptionsMenu || !mobileMoreBtn) return;

    const clickedInsideMenu = mobileOptionsMenu.contains(event.target);
    const clickedMoreButton = mobileMoreBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedMoreButton) {
        closeMobileOptionsMenu();
    }
});


/**
 * Opens the add contact overlay.
 */
function openAddContactOverlay() {
    modalMode = "add";
    closeMobileOptionsMenu();
    setAddMode();
    addContactForm.reset();
    addContactForm.classList.remove("submitted");
    overlay.classList.add("active");
}


/**
 * Opens the edit contact overlay.
 */
function openEditContactOverlay() {
    if (currentContactIndex === null) return;

    const contact = contacts[currentContactIndex];

    if (!contact) return;
    modalMode = "edit";
    closeMobileOptionsMenu();
    setEditMode(contact);
    overlay.classList.add("active");
}


/**
 * Closes the contact overlay.
 */
function closeAddContactOverlay() {
    overlay.classList.remove("active");
}


/**
 * Toggles the mobile options menu.
 * @param {Event} event - The click event.
 */
function toggleMobileOptionsMenu(event) {
    event.stopPropagation();

    if (!mobileOptionsMenu) return;

    mobileOptionsMenu.classList.toggle("active");
}


/**
 * Closes the mobile options menu.
 */
function closeMobileOptionsMenu() {
    if (!mobileOptionsMenu) return;

    mobileOptionsMenu.classList.remove("active");
}


/**
 * Loads and renders all contacts.
 */
async function loadContacts() {
    const data = await getContactsData();
    contacts = createContactsArray(data);
    sortContactsByName();
    renderContacts();
    renderInitialContactDetails();
}


/**
 * Gets the contacts data.
 * @returns {Promise<Object|null>} The contacts data.
 */
async function getContactsData() {
    const response = await fetch(getContactsUrl());
    return await response.json();
}


/**
 * Returns the contacts database URL.
 * @param {string} contactId - The optional contact id.
 * @returns {string} The contacts database URL.
 */
function getContactsUrl(contactId = "") {
    const path = contactId ? "/" + contactId : "";
    if (getCurrentUserId() === guestUserId) {
        return getUserDatabaseUrl(guestUserId, "contacts" + path);
    }
    return getDatabaseUrl("contacts" + path);
}


/**
 * Converts the contacts object to an array.
 * @param {Object|null} data - The contacts data.
 * @returns {Array} The contacts array.
 */
function createContactsArray(data) {
    if (!data) return [];
    return Object.entries(data).map(function ([id, contact]) {
        return { id: id, ...contact };
    });
}


/**
 * Sorts contacts by name.
 */
function sortContactsByName() {
    contacts.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}


/**
 * Renders the empty detail view if no contact is selected.
 */
function renderInitialContactDetails() {
    if (currentContactIndex === null) {
        renderEmptyContactDetails();
    }
}


/**
 * Shows the selected contact.
 * @param {number} index - The contact index.
 */
function showContact(index) {
    const contact = contacts[index];
    if (!contact) return;
    currentContactIndex = index;
    renderContacts();
    renderContactDetails(contact);
    openMobileContactDetails();
}


/**
 * Opens the mobile contact detail view.
 */
function openMobileContactDetails() {
    if (window.innerWidth <= 1024) {
        contactsPage.classList.add("mobile-detail-open");
    }
}


/**
 * Closes the mobile contact detail view.
 */
function closeMobileContactView() {
    contactsPage.classList.remove("mobile-detail-open");
    closeMobileOptionsMenu();
}


/**
 * Handles the contact form submit.
 * @param {Event} event - The submit event.
 */
function handleContactSubmit(event) {
    event.preventDefault();
    addContactForm.classList.add("submitted");
    if (!addContactForm.checkValidity()) return;
    if (modalMode === "edit") {
        saveContact();
        return;
    }
    createContact();
}

/**
 * Deletes the selected contact.
 */
async function deleteContact() {
    const contact = contacts[currentContactIndex];
    if (!contact) return;
    await deleteContactFromFirebase(contact.id);
    await removeContactFromAssignedTasks(contact.id);
    currentContactIndex = null;
    closeContactInterfaces();
    await loadContacts();
    renderEmptyContactDetails();
}


/**
 * Deletes a contact from the database.
 * @param {string} contactId - The contact id.
 * @returns {Promise<Response>} The delete request.
 */
function deleteContactFromFirebase(contactId) {
    return fetch(getContactsUrl(contactId), {
        method: "DELETE"
    });
}


/**
 * Removes a contact from assigned tasks.
 * @param {string} contactId - The contact id.
 */
async function removeContactFromAssignedTasks(contactId) {
    const tasks = await getContactTasks();
    const updates = getTaskAssignmentUpdates(tasks, contactId);

    await Promise.all(updates.map(updateTaskAssignments));
}


/**
 * Gets the task entries.
 * @returns {Promise<Array>} The task entries.
 */
async function getContactTasks() {
    const response = await fetch(getContactTasksUrl());
    const tasks = await response.json();
    return Object.entries(tasks || {});
}


/**
 * Returns the tasks database URL.
 * @param {string} taskId - The optional task id.
 * @returns {string} The tasks database URL.
 */
function getContactTasksUrl(taskId = "") {
    const path = taskId ? "/" + taskId : "";

    if (getCurrentUserId() === guestUserId) {
        return getUserDatabaseUrl(guestUserId, "tasks" + path);
    }
    return getDatabaseUrl("tasks" + path);
}


/**
 * Gets updates for assigned tasks.
 * @param {Array} tasks - The task entries.
 * @param {string} contactId - The contact id.
 * @returns {Array} The task updates.
 */
function getTaskAssignmentUpdates(tasks, contactId) {
    return tasks
        .map(([taskId, task]) => getTaskAssignmentUpdate(taskId, task, contactId))
        .filter(Boolean);
}


/**
 * Gets one task assignment update.
 * @param {string} taskId - The task id.
 * @param {Object} task - The task data.
 * @param {string} contactId - The contact id.
 * @returns {Object|null} The task update or null.
 */
function getTaskAssignmentUpdate(taskId, task, contactId) {
    const assignedTo = getAssignmentsWithoutContact(task, contactId);

    if (assignedTo.length === (task.assignedTo || []).length) return null;

    return { taskId, assignedTo };
}


/**
 * Removes a contact from a task assignment list.
 * @param {Object} task - The task data.
 * @param {string} contactId - The contact id.
 * @returns {Array} The filtered assignments.
 */
function getAssignmentsWithoutContact(task, contactId) {
    return (task.assignedTo || []).filter(function (assignedUser) {
        return assignedUser.id !== contactId || assignedUser.type !== "contact";
    });
}


/**
 * Updates the assigned contacts of a task.
 * @param {Object} update - The task update data.
 * @returns {Promise<Response>} The update request.
 */
function updateTaskAssignments(update) {
    return fetch(getContactTasksUrl(update.taskId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: update.assignedTo })
    });
}


/**
 * Closes all contact interfaces.
 */
function closeContactInterfaces() {
    closeMobileOptionsMenu();
    closeAddContactOverlay();
    closeMobileContactView();
}


/**
 * Handles the secondary modal button.
 */
function handleSecondaryButton() {
    if (modalMode === "edit") {
        deleteContact();
        return;
    }
    closeAddContactOverlay();
}
loadContacts();