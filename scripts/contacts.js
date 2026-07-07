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


function openAddContactOverlay() {
    modalMode = "add";

    closeMobileOptionsMenu();
    setAddMode();
    addContactForm.reset();

    overlay.classList.add("active");
}


function openEditContactOverlay() {
    if (currentContactIndex === null) return;

    const contact = contacts[currentContactIndex];

    if (!contact) return;

    modalMode = "edit";

    closeMobileOptionsMenu();
    setEditMode(contact);

    overlay.classList.add("active");
}


function closeAddContactOverlay() {
    overlay.classList.remove("active");
}


function toggleMobileOptionsMenu(event) {
    event.stopPropagation();

    if (!mobileOptionsMenu) return;

    mobileOptionsMenu.classList.toggle("active");
}


function closeMobileOptionsMenu() {
    if (!mobileOptionsMenu) return;

    mobileOptionsMenu.classList.remove("active");
}


async function loadContacts() {
    const data = await getContactsData();
    contacts = createContactsArray(data);
    sortContactsByName();
    renderContacts();
    renderInitialContactDetails();
}


async function getContactsData() {
    const response = await fetch(getContactsUrl());
    return await response.json();
}


function getContactsUrl(contactId = "") {
    const path = contactId ? "/" + contactId : "";
    if (getCurrentUserId() === guestUserId) {
        return getUserDatabaseUrl(guestUserId, "contacts" + path);
    }
    return getDatabaseUrl("contacts" + path);
}


function createContactsArray(data) {
    if (!data) return [];
    return Object.entries(data).map(function ([id, contact]) {
        return { id: id, ...contact };
    });
}


function sortContactsByName() {
    contacts.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}


function renderInitialContactDetails() {
    if (currentContactIndex === null) {
        renderEmptyContactDetails();
    }
}


function showContact(index) {
    const contact = contacts[index];
    if (!contact) return;
    currentContactIndex = index;
    renderContacts();
    renderContactDetails(contact);
    openMobileContactDetails();
}


function openMobileContactDetails() {
    if (window.innerWidth <= 1024) {
        contactsPage.classList.add("mobile-detail-open");
    }
}


function closeMobileContactView() {
    contactsPage.classList.remove("mobile-detail-open");
    closeMobileOptionsMenu();
}


function handleContactSubmit(event) {
    event.preventDefault();
    if (modalMode === "edit") {
        saveContact();
        return;
    }
    createContact();
}


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


function deleteContactFromFirebase(contactId) {
    return fetch(getContactsUrl(contactId), {
        method: "DELETE"
    });
}


async function removeContactFromAssignedTasks(contactId) {
    const tasks = await getContactTasks();
    const updates = getTaskAssignmentUpdates(tasks, contactId);

    await Promise.all(updates.map(updateTaskAssignments));
}


async function getContactTasks() {
    const response = await fetch(getContactTasksUrl());
    const tasks = await response.json();

    return Object.entries(tasks || {});
}


function getContactTasksUrl(taskId = "") {
    const path = taskId ? "/" + taskId : "";

    if (getCurrentUserId() === guestUserId) {
        return getUserDatabaseUrl(guestUserId, "tasks" + path);
    }
    return getDatabaseUrl("tasks" + path);
}


function getTaskAssignmentUpdates(tasks, contactId) {
    return tasks
        .map(([taskId, task]) => getTaskAssignmentUpdate(taskId, task, contactId))
        .filter(Boolean);
}


function getTaskAssignmentUpdate(taskId, task, contactId) {
    const assignedTo = getAssignmentsWithoutContact(task, contactId);

    if (assignedTo.length === (task.assignedTo || []).length) return null;

    return { taskId, assignedTo };
}


function getAssignmentsWithoutContact(task, contactId) {
    return (task.assignedTo || []).filter(function (assignedUser) {
        return assignedUser.id !== contactId || assignedUser.type !== "contact";
    });
}


function updateTaskAssignments(update) {
    return fetch(getContactTasksUrl(update.taskId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: update.assignedTo })
    });
}


function closeContactInterfaces() {
    closeMobileOptionsMenu();
    closeAddContactOverlay();
    closeMobileContactView();
}


function handleSecondaryButton() {
    if (modalMode === "edit") {
        deleteContact();
        return;
    }
    closeAddContactOverlay();
}


async function createContact() {
    const newContact = getContactFormData();
    await postNewContact(newContact);
    addContactForm.reset();
    closeAddContactOverlay();
    await loadContacts();
    showContactToast("Contact successfully created");
}


function getContactFormData() {
    return {
        name: document.getElementById("contact-name").value.trim(),
        email: document.getElementById("contact-email").value.trim(),
        phone: document.getElementById("contact-phone").value.trim(),
        color: selectedContactColor || getRandomContactColor()
    };
}


function postNewContact(contact) {
    return fetch(getContactsUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    });
}


async function saveContact() {
    const contact = contacts[currentContactIndex];
    if (!contact) return;
    await patchContact(contact.id, getUpdatedContactData(contact));
    await loadContacts();
    currentContactIndex = getContactIndexById(contact.id);
    renderSavedContact();
    closeAddContactOverlay();
}


function getUpdatedContactData(contact) {
    return {
        name: document.getElementById("contact-name").value.trim(),
        email: document.getElementById("contact-email").value.trim(),
        phone: document.getElementById("contact-phone").value.trim(),
        color: selectedContactColor || contact.color || getRandomContactColor(),
        contactColor: null
    };
}


function patchContact(contactId, updatedContact) {
    return fetch(getContactsUrl(contactId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContact)
    });
}


function getContactIndexById(contactId) {
    return contacts.findIndex(function (contact) {
        return contact.id === contactId;
    });
}


function renderSavedContact() {
    if (currentContactIndex === -1) return;
    renderContacts();
    renderContactDetails(contacts[currentContactIndex]);
}


function setAddMode() {
    resetAddModalText();
    resetAddAvatar();
    setAddButtons();
    selectedContactColor = getRandomContactColor();
    clearColorOptions();
}


function showContactToast(message) {
    if (!contactToast) return;

    contactToast.textContent = message;
    contactToast.classList.add("active");

    setTimeout(function () {
        contactToast.classList.remove("active");
    }, 2000);
}

loadContacts();
