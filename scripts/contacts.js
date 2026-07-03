const overlay = document.getElementById("add-contact-overlay");
const modal = document.querySelector(".add-contact-modal");
const addContactBtn = document.getElementById("add-contact-btn");
const closeContactModal = document.getElementById("close-contact-modal");
const cancelContactBtn = document.getElementById("cancel-contact-btn");

function openAddContactOverlay() {
    overlay.classList.add("active");
}

function closeAddContactOverlay() {
    overlay.classList.remove("active");
}

addContactBtn.addEventListener("click", openAddContactOverlay);
closeContactModal.addEventListener("click", closeAddContactOverlay);
cancelContactBtn.addEventListener("click", closeAddContactOverlay);

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        closeAddContactOverlay();
    }
});

modal.addEventListener("click", (event) => {
    event.stopPropagation();
});