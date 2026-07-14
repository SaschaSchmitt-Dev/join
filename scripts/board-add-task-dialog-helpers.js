/**
 * Gets the required dialog fields.
 * @returns {Array} The required fields.
 */
function getRequiredDialogFields() {
    return [
        getDialogField("title", "titleError"),
        getDialogField("dueDate", "dueDateError"),
        getDialogField("category", "categoryError")
    ];
}


/**
 * Gets one field and its error element.
 * @param {string} inputId - The input id.
 * @param {string} errorId - The error id.
 * @returns {Object} The field data.
 */
function getDialogField(inputId, errorId) {
    return {
        input: document.getElementById(inputId),
        error: document.getElementById(errorId)
    };
}


/**
 * Sets one field validity state.
 * @param {HTMLInputElement} input - The input.
 * @param {HTMLElement} error - The error element.
 */
function setDialogFieldValidity(input, error) {
    const isValid = isValidDialogField(input);
    input.classList.toggle("input-error", !isValid);
    error.textContent = getDialogErrorText(input, isValid);
}


/**
 * Checks one required dialog field.
 * @param {HTMLInputElement} input - The input.
 * @returns {boolean} True when the field is valid.
 */
function isValidDialogField(input) {
    if (input.id === "dueDate" && input.type === "date") return Boolean(input.value);
    if (input.id === "dueDate") return isValidDialogDate(input.value);
    return Boolean(input.value.trim());
}


/**
 * Gets the error text for one field.
 * @param {HTMLInputElement} input - The input.
 * @param {boolean} isValid - The field state.
 * @returns {string} The error text.
 */
function getDialogErrorText(input, isValid) {
    if (isValid) return "";
    if (input.id === "dueDate" && input.value) return "Use dd/mm/yyyy";
    return "This field is required";
}


/**
 * Checks the visible date format.
 * @param {string} value - The visible date.
 * @returns {boolean} True when the date is valid.
 */
function isValidDialogDate(value) {
    const parts = value.split("/");
    if (parts.length !== 3) return false;
    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return day > 0 && month > 0 && year > 999
        && date.getDate() === day && date.getMonth() === month - 1;
}


/**
 * Converts dd/mm/yyyy to yyyy-mm-dd.
 * @param {string} value - The visible date.
 * @returns {string} The database date.
 */
function formatDialogDate(value) {
    if (value.includes("-")) return value;
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}`;
}


/**
 * Connects the dialog date input.
 * @param {HTMLElement} dialog - The dialog element.
 */
function initializeDialogDateInput(dialog) {
    const input = dialog.querySelector("#dueDate");
    input.addEventListener("focus", showDialogDatePicker);
    input.addEventListener("blur", resetEmptyDialogDate);
}


/**
 * Shows the browser date picker.
 * @param {FocusEvent} event - The focus event.
 */
function showDialogDatePicker(event) {
    event.currentTarget.type = "date";
}


/**
 * Restores the placeholder when no date was selected.
 * @param {FocusEvent} event - The blur event.
 */
function resetEmptyDialogDate(event) {
    if (!event.currentTarget.value) event.currentTarget.type = "text";
}


/**
 * Clears one field error.
 * @param {HTMLInputElement} input - The input.
 * @param {HTMLElement} error - The error element.
 */
function clearDialogFieldError(input, error) {
    input.classList.remove("input-error");
    error.textContent = "";
}

