/** Initializes keyboard behavior shared by Add Task dropdown fields. */
function initializeKeyboardDropdown(input, toggleDropdown, closeDropdown) {
    input.setAttribute("aria-haspopup", "listbox");
    input.setAttribute("aria-expanded", "false");
    input.addEventListener("keydown", (event) => {
        handleKeyboardDropdown(event, input, toggleDropdown, closeDropdown);
    });
}


/** Handles Enter, Space and Escape on a dropdown input. */
function handleKeyboardDropdown(event, input, toggleDropdown, closeDropdown) {
    const canToggle = event.key === "Enter" || event.key === " " && input.readOnly;
    const canClose = event.key === "Escape" && input.getAttribute("aria-expanded") === "true";
    if (!canToggle && !canClose) return;
    event.preventDefault();
    if (canClose) event.stopPropagation();
    (canClose ? closeDropdown : toggleDropdown)();
}


/**
 * Runs a callback after focus leaves a complete dropdown component.
 * Clicking a label (e.g. a contact row) can activate its checkbox without
 * moving keyboard focus onto it (notably on macOS), which would otherwise
 * blur the dropdown's input and incorrectly close it. Tracking the last
 * mousedown target avoids that false close.
 */
function closeDropdownAfterFocusLeaves(dropdown, closeDropdown) {
    setTimeout(() => {
        const clickedInside = dropdown.dataset.pointerDownInside === "true";
        delete dropdown.dataset.pointerDownInside;
        if (clickedInside || dropdown.contains(document.activeElement)) return;
        closeDropdown();
    }, 0);
}


/** Marks a dropdown as having just received a mousedown inside it, for closeDropdownAfterFocusLeaves. */
function trackDropdownPointerDown(dropdown) {
    dropdown.addEventListener("mousedown", () => {
        dropdown.dataset.pointerDownInside = "true";
    });
}


/** Wires the keyboard behavior for dropdown fields in the board dialog. */
function initializeDialogDropdownAccessibility(dialog) {
    [dialog.querySelector("#assignedTo"), dialog.querySelector("#category")]
        .forEach(connectDialogDropdownInput);
    dialog.querySelectorAll(".dropdown-list").forEach((dropdown) => {
        trackDropdownPointerDown(dropdown);
        dropdown.addEventListener("focusout", () => closeDialogDropdownAfterFocus(dropdown));
        dropdown.addEventListener("keydown", (event) => closeDialogDropdownOnEscape(event, dropdown));
    });
}


/** Connects one board-dialog dropdown input. */
function connectDialogDropdownInput(input) {
    const toggleDropdown = () => toggleDialogDropdown({ currentTarget: input });
    const closeDropdown = () => closeOneDialogDropdown(input.closest(".dropdown-list"));
    initializeKeyboardDropdown(input, toggleDropdown, closeDropdown);
    input.addEventListener("click", toggleDropdown);
}


/** Closes one board-dialog dropdown. */
function closeOneDialogDropdown(dropdown) {
    dropdown.classList.remove("open");
    dropdown.querySelector("input").setAttribute("aria-expanded", "false");
}


/** Closes a board-dialog dropdown when keyboard focus leaves it. */
function closeDialogDropdownAfterFocus(dropdown) {
    closeDropdownAfterFocusLeaves(dropdown, () => closeOneDialogDropdown(dropdown));
}


/** Stops Escape from closing the dialog while a dropdown is open. */
function closeDialogDropdownOnEscape(event, dropdown) {
    if (event.key !== "Escape" || !dropdown.classList.contains("open")) return;
    event.preventDefault();
    event.stopPropagation();
    closeOneDialogDropdown(dropdown);
    dropdown.querySelector("input").focus();
}


/** Adds closing keys to a dropdown containing standalone contact checkboxes. */
function initializeContactDropdownKeys(dropdown, closeDropdown) {
    dropdown.addEventListener("keydown", (event) => {
        const confirmsContacts = event.key === "Enter" && event.target.matches(".contact-checkbox");
        if (event.key !== "Escape" && !confirmsContacts) return;
        event.preventDefault();
        event.stopPropagation();
        closeDropdown();
        dropdown.querySelector(".input-wrapper input").focus();
    });
}
