// const getCurrentPreviewTodoId = () => {
//   const CurrentPreviewTodoId = getDb('current_preview_todo_id');
//   return CurrentPreviewTodoId;
// };

const renderCurrentPreviewTodo = () => {
  const todo_db = getDb('todo_db');
  const currentPreviewTodoId = getDb('current_preview_tdo_id');
  const currentTodo = todo_db.find((todo) => todo.id === currentPreviewTodoId);
  const { title, id, created_at } = 

  const ainer = document.querySelector {
    '#todo_preview_contianer'
  }

  todo_preview_container.innerHTML = "
  "
};

renderCurrentPreviewTodo();
