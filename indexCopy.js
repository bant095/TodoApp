////////////////////////////
//TODO: CRUD FUNCTIONS
//////////////////////////////

//CREATE TODO FUNCTION

/*
1. Get todo from user input
2. Add todo to local storage / API
*/

const DB_NAME = 'todo_db';

const createTodo = () => {
  const todoInput = document.querySelector('#todo-input');

  //To validate our input and make a good ux
  if (!todoInput.value) {
    const formMessageSpan = document.querySelector('#form-message');
    //error message
    formMessageSpan.innerHTML = 'Please provide a todo title';
    formMessageSpan.classList.remove('hidden');
    formMessageSpan.classList.add('text-xs', 'text-red-400');

    //disapearing error messages
    setTimeout(() => {
      formMessageSpan.classList.add('hidden');
    }, 5000);

    return;
  }

  const newTodo = {
    id: uuid(),
    title: todoInput.value,
    created_at: Date.now(),
  };

  // check for Local storage

  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  //create new todo db array

  const new_todo_db = [...todo_db, newTodo];
  //add to local storage

  //local storage take strings and not object
  localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
  //HOW TO MAKE OUR NEW add show in the UI is by calling the function to fetch the todos again, then it will show in the UI
  fetchTodos();
  //To clear data after users input their data by .value of empty strings
  todoInput.value = '';
};

///////////////////
//READ TODO FUNCTION
const fetchTodos = () => {
  const todoListsContainer = document.querySelector('#todo-lists-container');
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const noTodo = todo_db.length === 0;
  //Writing the condition
  if (noTodo) {
    todoListsContainer.innerHTML = `<p class="text-center text-slate-500">Your todos will appear here.</p>`;
    return;
  }

  //we sort to bring data in front of array, we can perform map and it will return an array
  const todos = todo_db
    .sort((a, b) =>
      a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
    )
    .map((todo) => {
      return `
    <div
    class="group flex justify-between py-3 px-2.5 max-w-lg mx-auto rounded-lg hover:bg-slate-50"
  >
    <a href="">${todo.title}</a>
    <section class="flex gap-3 invisible group-hover:visible">
      <button onclick="handleEditMode('${todo.id}')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10 "
          />
        </svg>
        </button>
        <button onclick="deleteTodo('${todo.id}')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </section>
  </div>
    `;
    });
  todoListsContainer.innerHTML = todos.join(''); //we use a join method for the array
};

//////////////////////
// UPDATE/EDIT TODO FUNCTION
const handleEditMode = (id) => {
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const todo_to_update = todo_db.find((todo) => todo.id === id);

  if (!todo_to_update) {
    return;
  }
  const todoInput = document.querySelector('#todo-input');
  todoInput.value = todo_to_update.title;

  //To hide and update btn
  const updateTodoBtn = document.querySelector('#update_todo_btn');
  updateTodoBtn.classList.remove('hidden'); //show update on todo btn
  updateTodoBtn.setAttribute('todo_id_to_update', id);

  const addTodoBtn = document.querySelector('#add_todo_btn');
  addTodoBtn.classList.add('hidden'); //hide & add todo btn
};

const updateTodo = () => {
  const todoInput = document.querySelector('#todo-input');
  //To validate our input and make a good ux
  if (!todoInput.value) {
    const formMessageSpan = document.querySelector('#form-message');
    //error message
    formMessageSpan.innerHTML = 'Please provide a todo title';
    formMessageSpan.classList.remove('hidden');
    formMessageSpan.classList.add('text-xs', 'text-red-400');

    //disapearing error messages
    setTimeout(() => {
      formMessageSpan.classList.add('hidden');
    }, 5000);

    return;
  }

  const updateTodoBtn = document.querySelector('#update_todo_btn');
  const todo_id_to_update = updateTodoBtn.getAttribute('todo_id_to_update');
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const updated_todo_db = todo_db.map((todo) => {
    if (todo.id === todo_id_to_update) {
      return { ...todo, title: todoInput.value };
    } else {
      return todo;
    }
  });
  localStorage.setItem(DB_NAME, JSON.stringify(updated_todo_db));
  fetchTodos(); //FETCH TODO, SO THAT IT WILL UPDATE IT

  todoInput.value = ''; //to clear the form and have a good UX. users can retype their input
  updateTodoBtn.classList.add('hidden');
  const addTodoBtn = document.querySelector('#add_todo_btn');
  addTodoBtn.classList.remove('hidden'); //show & add todo btn
};

//////////////////////
//DELETE TODO FUNCTION
const deleteTodo = (id) => {
  Swal.fire({
    title: 'Delete Todo!',
    text: 'Do you want to continue',
    icon: 'warning',
    confirmButtonText: 'Yes!',
    showCancelButton: true,
  }).then((res) => {
    console.log(res.isConfirmed);
    //to confirm the cancel btn
    if (res.isConfirmed) {
      //   console.log(id);
      //Get todo ls [Local Storage]
      const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
      //   console.log(todo_db);
      //filter out todos that doesn't match the id
      const new_todo_db = todo_db.filter((todo) => todo.id !== id);
      //   console.log(new_todo_db);
      //set the new todos without the todo that matches the id to the ls
      localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
      fetchTodos();
    } else {
      return;
    }
  });
};
//call out function
fetchTodos();
