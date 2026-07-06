const BASE_URL = "https://join-94aa0-default-rtdb.europe-west1.firebasedatabase.app/";
const activeUserStorageKey = "joinActiveUser";
const guestUserId = "guest";
const brightProfileColors = [
    "var(--profile-yellow)",
    "var(--profile-lime)",
    "var(--profile-gold)",
    "var(--profile-cyan)",
    "var(--profile-turquoise)",
    "var(--profile-peach)",
    "var(--profile-amber)"
];

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

function getUserTextColor(userColor) {
    const avatarColor = getUserColor(userColor);

    return brightProfileColors.includes(avatarColor) ? "var(--text-primary)" : "var(--text-white)";
}
