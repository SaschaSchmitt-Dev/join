const currentUserId = "users";
let contacts = [];
const overlay = document.getElementById("add-contact-overlay");
const modal = document.querySelector(".add-contact-modal");
const addContactBtn = document.getElementById("add-contact-btn");
const closeContactModal = document.getElementById("close-contact-modal");
const cancelContactBtn = document.getElementById("cancel-contact-btn");
const addContactForm = document.getElementById("add-contact-form");

addContactBtn.addEventListener("click", openAddContactOverlay);
closeContactModal.addEventListener("click", closeAddContactOverlay);
cancelContactBtn.addEventListener("click", closeAddContactOverlay);
addContactForm.addEventListener("submit", createContact);

overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
        closeAddContactOverlay();
    }
});

modal.addEventListener("click", function (event) {
    event.stopPropagation();
});

function openAddContactOverlay() {
    overlay.classList.add("active");
}

function closeAddContactOverlay() {
    overlay.classList.remove("active");
}

async function loadContacts() {
    const response = await fetch(BASE_URL + "users/" + currentUserId + "/contacts.json");
    const data = await response.json();

    contacts = [];

    if (data) {
        contacts = Object.values(data);
    }

    renderContacts();
}

async function createContact(event) {
    event.preventDefault();

    const newContact = {
        name: document.getElementById("contact-name").value,
        email: document.getElementById("contact-email").value,
        phone: document.getElementById("contact-phone").value,
        color: "#FF7A00"
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
    loadContacts();
}

function renderContacts() {
    const contactsList = document.getElementById("contacts-list");
    contactsList.innerHTML = "";

    contacts.forEach(function (contact) {
        contactsList.innerHTML += `
            <div class="contact-card">
                <div class="contact-avatar" style="background:${contact.color}">
                    ${getInitials(contact.name)}
                </div>

                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <a href="mailto:${contact.email}">${contact.email}</a>
                </div>
            </div>
        `;
    });
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

loadContacts();