async function deleteContact() {
    const contact = contacts[currentContactIndex];

    if (!contact) {
        return;
    }

    await fetch(BASE_URL + "users/" + currentUserId + "/contacts/" + contact.id + ".json", {
        method: "DELETE"
    });

    currentContactIndex = null;

    closeMobileOptionsMenu();
    closeAddContactOverlay();
    closeMobileContactView();
    loadContacts();

    document.getElementById("contact-details").innerHTML = `
        <div class="contacts-header">
            <h1>Contacts</h1>
            <span>Better with a team</span>
            <div class="header-divider"></div>
        </div>
    `;
}

function renderContactDetails(contact) {
    const contactDetails = document.getElementById("contact-details");

    contactDetails.innerHTML = `
        <div class="contacts-header">
            <h1>Contacts</h1>
            <span>Better with a team</span>
            <div class="header-divider"></div>
        </div>

        <div class="contact-mobile-detail">
            <div class="selected-contact">
                <div class="contact-avatar" style="background:${contact.color || "#FF7A00"}">
                    ${getInitials(contact.name)}
                </div>

                <h2>${contact.name}</h2>
            </div>

            <div class="contact-information" style="font-family: 'Inter'; font-style: regular; font-weight: 400;">
                <h3>Contact Information</h3>

                <h4>Email</h4>
                <a href="mailto:${contact.email}">${contact.email}</a>

                <h4>Phone</h4>
                <p>${contact.phone || ""}</p>
            
            </div>
        </div>
    `;
}

function renderContacts() {
    const contactsList = document.getElementById("contacts-list");
    contactsList.innerHTML = "";

    contacts.forEach(function (contact, index) {
        contactsList.innerHTML += `
            <div class="contact-card" onclick="showContact(${index})">
                <div class="contact-avatar" style="background:${contact.color || "#FF7A00"}">
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