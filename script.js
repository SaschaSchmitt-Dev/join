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
