function getEditTaskDialogTemplate(task) {
  return /* html */ `
    <div class="task-dialog-backdrop" id="editTaskDialog" role="dialog" aria-modal="true" aria-label="Edit task" tabindex="-1">
      <section class="dialog-creator edit-task-dialog" data-task-id="${task.id}">
        <button class="edit-task-close" type="button" aria-label="Close dialog">&times;</button>
        ${getEditTaskTitleTemplate(task)}
        ${getEditTaskDescriptionTemplate(task)}
      </section>
    </div>
  `;
}


function getEditTaskTitleTemplate(task) {
  return /* html */ `
    <label for="editTaskTitle">Title</label>
    <input id="editTaskTitle" class="edit-task-title" type="text" value="${task.title}">
  `;
}


function getEditTaskDescriptionTemplate(task) {
  return /* html */ `
    <label for="editTaskDescription">Description</label>
    <textarea id="editTaskDescription" class="edit-task-description">${task.description}</textarea>
  `;
}
