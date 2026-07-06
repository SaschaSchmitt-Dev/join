function renderContactDetails(contact) {
    const contactDetails = document.getElementById("contact-details");

    contactDetails.innerHTML = `
       <div class="contacts-header">
           <h1>Contacts</h1>
         <div class="header-divider"></div>
              <span>Better with a team</span>
         </div>

        <div class="contact-detail-content">
            <div class="contact-detail-top">
                <div class="contact-detail-avatar" style="background:${contact.color || "var(--profile-orange)"}">
                    ${getUserInitials(contact.name)}
                </div>

                <div class="contact-detail-name-box">
                    <h2>${contact.name}</h2>

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
                </div>
            </div>

            <div class="contact-information">
                <h3>Contact Information</h3>

                <h4>Email</h4>
                <p class="contact-email">${contact.email}</p>

                <h4>Phone</h4>
                <p>${contact.phone || ""}</p>
            </div>
        </div>
    `;
}

function renderContacts() {
    const contactsList = document.getElementById("contacts-list");
    contactsList.innerHTML = "";

    let currentLetter = "";

    contacts.forEach(function (contact, index) {
        const firstLetter = contact.name.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;

            contactsList.innerHTML += `
                <div class="contact-group">
                    <h3>${currentLetter}</h3>
                </div>
            `;
        }

        const activeClass = index === currentContactIndex ? "active" : "";

        contactsList.innerHTML += `
            <div class="contact-card ${activeClass}" onclick="showContact(${index})">
                <div class="contact-avatar" style="background:${contact.color || "var(--profile-orange)"}">
                    ${getUserInitials(contact.name)}
                </div>

                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p class="contact-email-detail">${contact.email}</p>
                </div>
            </div>
        `;
    });
}

function renderColorOptions() {
    if (!colorOptions) return;

    colorOptions.innerHTML = "";

    profileColors.forEach(function (color) {
        const activeClass = color === selectedContactColor ? "active" : "";

        colorOptions.innerHTML += `
            <button
                type="button"
                class="color-option ${activeClass}"
                style="background:${color}"
                onclick="selectContactColor('${color}')">
            </button>
        `;
    });
}

function renderEmptyContactDetails() {
    const contactDetails = document.getElementById("contact-details");

    contactDetails.innerHTML = `
        <div class="contacts-header">
            <h1>Contacts</h1>
            <div class="header-divider"></div>
            <span>Better with a team</span>
        </div>
    `;
}
