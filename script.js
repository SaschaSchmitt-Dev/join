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

function getUserDatabaseUrl(userId, path = "") {
    const cleanPath = path ? "/" + path.replace(/^\/+/, "") : "";

    return getDatabaseUrl("users/" + userId + cleanPath);
}

function getCurrentUserId() {
    return getActiveUserId() || guestUserId;
}

function setActiveUser(userId, user) {
    const activeUser = {
        id: userId,
        name: user.name || userId,
        email: user.email || "",
        userColor: user.userColor || "blue"
    };

    localStorage.setItem(activeUserStorageKey, JSON.stringify(activeUser));
}

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

function clearActiveUser() {
    localStorage.removeItem(activeUserStorageKey);
}

function getActiveUserId() {
    const activeUser = getActiveUser();

    return activeUser ? activeUser.id : null;
}

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

function getUserColor(userColor) {
    if (!userColor) return "var(--profile-blue)";
    if (userColor.startsWith("var(") || userColor.startsWith("#") || userColor.startsWith("rgb")) return userColor;

    return `var(--profile-${userColor})`;
}

function getRandomProfileColor() {
    const randomIndex = Math.floor(Math.random() * profileColors.length);

    return profileColors[randomIndex];
}

function getUserTextColor(userColor) {
    const avatarColor = getUserColor(userColor);

    return brightProfileColors.includes(avatarColor) ? "var(--text-primary)" : "var(--text-white)";
}
