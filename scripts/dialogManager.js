let activeModal = null;
let modalTrigger = null;
let inertElements = [];


/** Returns the visible elements that can receive keyboard focus. */
function getModalFocusableElements(modal) {
    const selector = [
        "a[href]", "button:not([disabled])", "input:not([disabled])",
        "select:not([disabled])", "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    return [...modal.querySelectorAll(selector)].filter((element) => {
        return !element.hidden && element.getClientRects().length > 0;
    });
}


/** Makes every body child except the active modal unavailable. */
function setModalBackgroundInert(modal) {
    inertElements = [...document.body.children]
        .filter((element) => element !== modal)
        .map((element) => ({ element, wasInert: element.inert }));
    inertElements.forEach(({ element }) => element.inert = true);
}


/** Restores the inert state that existed before the modal opened. */
function restoreModalBackground() {
    inertElements.forEach(({ element, wasInert }) => element.inert = wasInert);
    inertElements = [];
}


/** Keeps Tab and Shift+Tab inside the active modal. */
function trapModalFocus(event) {
    if (event.key !== "Tab" || !activeModal) return;
    const focusableElements = getModalFocusableElements(activeModal);

    if (!focusableElements.length) {
        event.preventDefault();
        activeModal.focus();
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const focusOutsideModal = !activeModal.contains(document.activeElement);

    if (focusOutsideModal || event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}


/** Activates focus management and scroll locking for a modal. */
function activateModal(modal, initialFocusElement) {
    if (!modal) return;
    if (!activeModal && !modalTrigger) modalTrigger = document.activeElement;
    if (activeModal) restoreModalBackground();

    activeModal = modal;
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    setModalBackgroundInert(modal);
    document.addEventListener("keydown", trapModalFocus);

    const focusTarget = initialFocusElement || getModalFocusableElements(modal)[0] || modal;
    focusTarget.focus();
}


/** Deactivates a modal and optionally restores focus to its original trigger. */
function deactivateModal(modal, restoreFocus = true) {
    if (!modal || modal !== activeModal) return;

    document.removeEventListener("keydown", trapModalFocus);
    restoreModalBackground();
    activeModal = null;

    if (!restoreFocus) return;
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    if (modalTrigger?.isConnected) modalTrigger.focus();
    modalTrigger = null;
}
