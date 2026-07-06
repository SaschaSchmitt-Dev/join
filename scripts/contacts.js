const currentUserId = "guest";
let contacts = [];
let currentContactIndex = null;
let modalMode = "add";
let selectedContactColor = "var(--profile-orange)";
const profileColors = [
    "var(--profile-orange)",
    "var(--profile-pink)",
    "var(--profile-violet)",
    "var(--profile-purple)",
    "var(--profile-cyan)",
    "var(--profile-turquoise)",
    "var(--profile-salmon)",
    "var(--profile-peach)",
    "var(--profile-magenta)",
    "var(--profile-gold)",
    "var(--profile-blue)",
    "var(--profile-lime)",
    "var(--profile-yellow)",
    "var(--profile-red)",
    "var(--profile-amber)"
];

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
    const response = await fetch(BASE_URL + "users/" + currentUserId + "/contacts.json");
    const data = await response.json();

    contacts = [];

    if (data) {
        contacts = Object.entries(data).map(function ([id, contact]) {
            return {
                id: id,
                ...contact
            };
        });
    }

    contacts.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

    renderContacts();

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

function handleSecondaryButton() {
    if (modalMode === "edit") {
        deleteContact();
        return;
    }

    closeAddContactOverlay();
}

async function createContact() {
    const newContact = {
        name: document.getElementById("contact-name").value.trim(),
        email: document.getElementById("contact-email").value.trim(),
        phone: document.getElementById("contact-phone").value.trim(),
        color: getRandomContactColor()
    };

    await fetch(BASE_URL + "users/" + currentUserId + "/contacts.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newContact)
    });

    addContactForm.reset();
    closeAddContactOverlay();
    await loadContacts();
    showContactToast("Contact successfully created");
}

async function saveContact() {
    const contact = contacts[currentContactIndex];

    if (!contact) return;

    const contactId = contact.id;

    const updatedContact = {
        name: document.getElementById("contact-name").value.trim(),
        email: document.getElementById("contact-email").value.trim(),
        phone: document.getElementById("contact-phone").value.trim(),
        color: selectedContactColor || contact.color || getRandomContactColor()
    };

    await fetch(BASE_URL + "users/" + currentUserId + "/contacts/" + contactId + ".json", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedContact)
    });

    await loadContacts();

    currentContactIndex = contacts.findIndex(function (item) {
        return item.id === contactId;
    });

    if (currentContactIndex !== -1) {
        renderContactDetails(contacts[currentContactIndex]);
    }

    closeAddContactOverlay();
}

function setAddMode() {
    modal.classList.remove("edit-mode");
    modalTitle.textContent = "Add contact";
    modalSubtitle.textContent = "Tasks are better with a team!";
    modalSubtitle.style.display = "block";
    contactPlaceholder.classList.remove("edit-mode");
    contactPlaceholder.style.background = "#D1D1D1";
    contactAvatarInitials.textContent = "";
    secondaryBtnText.textContent = "Cancel";
    secondaryBtnIcon.style.display = "block";
    submitBtnText.textContent = "Create contact";
    selectedContactColor = getRandomContactColor();

    if (colorOptions) {
        colorOptions.innerHTML = "";
    }
}

function setEditMode(contact) {
    modal.classList.add("edit-mode");
    modalTitle.textContent = "Edit contact";
    modalSubtitle.style.display = "none";
    document.getElementById("contact-name").value = contact.name;
    document.getElementById("contact-email").value = contact.email;
    document.getElementById("contact-phone").value = contact.phone || "";
    selectedContactColor = contact.color || "var(--profile-orange)";
    contactPlaceholder.classList.add("edit-mode");
    contactPlaceholder.style.background = selectedContactColor;
    contactAvatarInitials.textContent = getInitials(contact.name);
    secondaryBtnText.textContent = "Delete";
    secondaryBtnIcon.style.display = "none";
    submitBtnText.textContent = "Save";

    renderColorOptions();
}

function selectContactColor(color) {
    selectedContactColor = color;

    contactPlaceholder.style.background = color;

    renderColorOptions();
}

function getInitials(name) {
    return name
        .split(" ")
        .map(function (word) {
            return word[0];
        })
        .join("")
        .toUpperCase();
}

function getRandomContactColor() {
    const randomIndex = Math.floor(Math.random() * profileColors.length);

    return profileColors[randomIndex];
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