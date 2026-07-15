function getEditTaskDialogTemplate(task) {
  return `
    <div class="task-dialog-backdrop" id="editTaskDialog" role="dialog" aria-modal="true">
      <section class="dialog-creator edit-task-dialog" data-task-id="${task.id}">
        <button class="edit-task-close" type="button" aria-label="Close dialog">&times;</button>
        <label for="editTaskTitle">Title</label>
        <input id="editTaskTitle" class="edit-task-title" type="text" value="${task.title}">
        <label for="editTaskDescription">Description</label>
        <textarea id="editTaskDescription" class="edit-task-description">${task.description}</textarea>
      </section>
    </div>
  `;
}