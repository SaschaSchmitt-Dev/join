const BASE_URL = "https://join-94aa0-default-rtdb.europe-west1.firebasedatabase.app/";
const activeUserStorageKey = "joinActiveUser";
const guestUserId = "guest";
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
const brightProfileColors = [
    "var(--profile-yellow)",
    "var(--profile-lime)",
    "var(--profile-gold)",
    "var(--profile-cyan)",
    "var(--profile-turquoise)",
    "var(--profile-peach)",
    "var(--profile-amber)"
];


/**
 * Gets the database url.
 * @param {string} path - The path to the database.
 * @returns {string} The database url.
 */
function getDatabaseUrl(path) {
    let normalizedPath = path || "";

    if (normalizedPath.startsWith("/")) {
        normalizedPath = normalizedPath.slice(1);
    }

    if (normalizedPath.endsWith(".json")) {
        normalizedPath = normalizedPath.slice(0, -5);
    }

    return BASE_URL + normalizedPath + ".json";
}


/**
 * Gets the database url for one user.
 * @param {string} userId - The user id.
 * @param {string} path - The path for this user.
 * @returns {string} The user database url.
 */
function getUserDatabaseUrl(userId, path = "") {
    const cleanPath = path ? "/" + path.replace(/^\/+/, "") : "";

    return getDatabaseUrl("users/" + userId + cleanPath);
}


/**
 * Gets the current user id.
 * @returns {string} The current user id.
 */
function getCurrentUserId() {
    return getActiveUserId() || guestUserId;
}


/**
 * Saves the active user in local storage.
 * @param {string} userId - The user id.
 * @param {Object} user - The user data.
 */
function setActiveUser(userId, user) {
    const activeUser = {
        id: userId,
        name: user.name || userId,
        email: user.email || "",
        userColor: user.userColor || "blue"
    };

    localStorage.setItem(activeUserStorageKey, JSON.stringify(activeUser));
}


/**
 * Gets the active user from local storage.
 * @returns {Object} The active user.
 */
function getActiveUser() {
    const activeUser = localStorage.getItem(activeUserStorageKey);

    if (!activeUser) return null;

    try {
        return JSON.parse(activeUser);
    } catch (error) {
        clearActiveUser();
        return null;
    }
}


/**
 * Removes the active user from local storage.
 */
function clearActiveUser() {
    localStorage.removeItem(activeUserStorageKey);
}


/**
 * Gets the active user id.
 * @returns {string} The active user id.
 */
function getActiveUserId() {
    const activeUser = getActiveUser();

    return activeUser ? activeUser.id : null;
}


/**
 * Normalizes a value for safe text comparisons.
 *
 * @param {string} value - The value to normalize.
 * @returns {string} The normalized value.
 */
function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
}


/**
 * Checks if a contact belongs to the currently logged in user.
 *
 * @param {Object} contact - The contact to check.
 * @returns {boolean} True if the contact is the current user.
 */
function isCurrentUserContact(contact) {
    const activeUser = getActiveUser();

    if (!activeUser || !contact) return false;
    if (!activeUser.email || !contact.email) return false;

    return normalizeText(contact.email) === normalizeText(activeUser.email);
}


/**
 * Gets the contact name and adds "(You)" for the current user.
 *
 * @param {Object} contact - The contact data.
 * @returns {string} The contact display name.
 */
function getContactDisplayName(contact) {
    if (!contact) return "";

    if (isCurrentUserContact(contact)) {
        return `${contact.name} (You)`;
    }

    return contact.name;
}


/**
 * Updates the active user if their own contact was edited.
 *
 * @param {Object} oldContact - The contact before editing.
 * @param {Object} updatedContact - The edited contact.
 * @returns {Promise<void>}
 */
async function updateActiveUserAfterContactEdit(oldContact, updatedContact) {
    const activeUser = getActiveUser();

    if (!activeUser || !isCurrentUserContact(oldContact)) return;

    const updatedUser = { ...activeUser, name: updatedContact.name || activeUser.name, email: updatedContact.email || activeUser.email, userColor: updatedContact.color || activeUser.userColor };
    const userData = { name: updatedUser.name, email: updatedUser.email, userColor: updatedUser.userColor };

    await fetch(getUserDatabaseUrl(activeUser.id), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userData) });
    setActiveUser(activeUser.id, updatedUser);
}


/**
 * Gets the initials from a user name.
 * @param {string} name - The user name.
 * @returns {string} The initials.
 */
function getUserInitials(name) {
    return (name || "Guest")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}


/**
 * Gets the color for a user.
 * @param {string} userColor - The saved user color.
 * @returns {string} The css color.
 */
function getUserColor(userColor) {
    if (!userColor) return "var(--profile-blue)";
    if (userColor.startsWith("var(") || userColor.startsWith("#") || userColor.startsWith("rgb")) return userColor;

    return `var(--profile-${userColor})`;
}


/**
 * Gets a random profile color.
 * @returns {string} A random profile color.
 */
function getRandomProfileColor() {
    const randomIndex = Math.floor(Math.random() * profileColors.length);

    return profileColors[randomIndex];
}


/**
 * Gets the text color for a profile color.
 * @param {string} userColor - The profile color.
 * @returns {string} The text color.
 */
function getUserTextColor(userColor) {
    const avatarColor = getUserColor(userColor);

    return brightProfileColors.includes(avatarColor) ? "var(--text-primary)" : "var(--text-white)";
}


/**
 * Makes a horizontal overflow container draggable with the mouse.
 * Native touch scrolling remains available on touch devices.
 * @param {HTMLElement} container - The scrollable element.
 */
function initializeHorizontalDragScroll(container) {
    if (!container) return;
    if (container.dataset.dragScrollInitialized) return;
    container.dataset.dragScrollInitialized = "true";
    container.dragScrollState = { startX: 0, startScrollLeft: 0, didDrag: false, pointerId: null };
    container.addEventListener("pointerdown", (event) => startHorizontalDrag(event, container));
    container.addEventListener("pointermove", (event) => moveHorizontalDrag(event, container));
    container.addEventListener("pointerup", () => stopHorizontalDrag(container, true));
    container.addEventListener("pointercancel", () => stopHorizontalDrag(container, false));
    container.addEventListener("click", (event) => preventClickAfterDrag(event, container), true);
}


/**
 * Saves the starting position for horizontal mouse dragging.
 * @param {PointerEvent} event - The pointer event.
 * @param {HTMLElement} element - The scrollable element.
 */
function startHorizontalDrag(event, element) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const state = element.dragScrollState;
    state.startX = event.clientX;
    state.startScrollLeft = element.scrollLeft;
    state.didDrag = false;
    state.pointerId = event.pointerId;
}


/**
 * Moves the element while the mouse is being dragged.
 * @param {PointerEvent} event - The pointer event.
 * @param {HTMLElement} element - The scrollable element.
 */
function moveHorizontalDrag(event, element) {
    const state = element.dragScrollState;
    if (event.pointerId !== state.pointerId) return;
    if (!state.didDrag && Math.abs(event.clientX - state.startX) > 4) beginHorizontalDrag(event, element);
    if (!state.didDrag) return;
    element.scrollLeft = state.startScrollLeft - (event.clientX - state.startX);
}


/**
 * Activates the dragging state after the pointer has moved.
 * @param {PointerEvent} event - The pointer event.
 * @param {HTMLElement} element - The scrollable element.
 */
function beginHorizontalDrag(event, element) {
    element.dragScrollState.didDrag = true;
    element.classList.add("is-dragging");
    element.setPointerCapture(event.pointerId);
}


/**
 * Stops horizontal dragging and resets its state.
 * @param {HTMLElement} element - The scrollable element.
 * @param {boolean} keepDragState - Whether to delay resetting the drag flag.
 */
function stopHorizontalDrag(element, keepDragState) {
    const state = element.dragScrollState;
    element.classList.remove("is-dragging");
    state.pointerId = null;
    if (!keepDragState) state.didDrag = false;
    else setTimeout(() => { state.didDrag = false; }, 0);
}


/**
 * Prevents a click when the pointer was used for dragging.
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} element - The scrollable element.
 */
function preventClickAfterDrag(event, element) {
    if (!element.dragScrollState.didDrag) return;
    event.preventDefault();
    event.stopImmediatePropagation();
}


/**
 * Makes every visible priority option independently keyboard accessible.
 * @param {HTMLElement} group - The priority radio group.
 */
function initializePriorityKeyboard(group) {
    if (!group) return;
    const labels = group.querySelectorAll("label[for]");
    updatePriorityAriaState(group);
    labels.forEach((label) => {
        label.addEventListener("keydown", (event) => selectPriorityWithKeyboard(event, group));
    });
    group.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.addEventListener("change", () => updatePriorityAriaState(group));
    });
}


/**
 * Selects a priority when Enter or Space is pressed.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} group - The priority radio group.
 */
function selectPriorityWithKeyboard(event, group) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const input = event.currentTarget.control;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
}


/**
 * Updates the accessible selected state of all priorities.
 * @param {HTMLElement} group - The priority radio group.
 */
function updatePriorityAriaState(group) {
    group.querySelectorAll("label[for]").forEach((label) => {
        label.setAttribute("aria-checked", String(label.control.checked));
    });
}
