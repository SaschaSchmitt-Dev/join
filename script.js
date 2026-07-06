const BASE_URL = "https://join-94aa0-default-rtdb.europe-west1.firebasedatabase.app/";
const activeUserStorageKey = "joinActiveUser";
const guestUserId = "guest";
const brightProfileColors = ["yellow", "lime", "gold", "cyan", "turquoise", "peach", "amber"];

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

function getUserColorName(userColor) {
    return String(userColor || "blue")
        .replace("var(--profile-", "")
        .replace("--profile-", "")
        .replace(")", "");
}

function getUserTextColor(userColor) {
    const colorName = getUserColorName(userColor);

    return brightProfileColors.includes(colorName) ? "var(--text-primary)" : "var(--text-white)";
}
