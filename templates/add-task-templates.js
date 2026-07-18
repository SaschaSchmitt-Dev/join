/** Returns the selectable contact content for the standalone Add Task page. */
function getAddTaskContactRowTemplate(key, contact, color, displayName) {
    return `
        <div class="contactInfoWrapper">
            <div class="contactAvatar" style="background:${color}; color:${getUserTextColor(color)}">${getUserInitials(contact.name)}</div>
            <span>${displayName}</span>
        </div>
        <span class="custom-checkbox-wrapper">
            <input type="checkbox" class="contactCheckbox" data-id="${key}" data-name="${contact.name}" data-initials="${getUserInitials(contact.name)}" data-color="${color}" data-text-color="${getUserTextColor(color)}">
            <span class="custom-checkbox" aria-hidden="true"></span>
        </span>`;
}
