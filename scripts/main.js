const rootSelector = '[data-js-todo-app]';

class ToDoApp {
  selectors = {
    form: '[data-js-todo-form]',
    input: '[data-js-todo-input]',
    addInput: '[data-js-add-input]',
    searchInput: '[data-js-todo-search]',
    count: '[data-js-todo-count]',
    deleteAll: '[data-js-todo-delete-all]',
    list: '[data-js-todo-list]',
  }
  /**
   * @param {HTMLElement} root
   */

  classStates = {
    isLine: 'is-done',
  }
  constructor(root) {
    this.rootElement = root;
    this.form = this.rootElement.querySelector(this.selectors.form);
    this.input = this.rootElement.querySelector(this.selectors.input)
    this.addInput = this.rootElement.querySelector(this.selectors.addInput)
    this.searchInput = this.rootElement.querySelector(this.selectors.searchInput)
    this.count = this.rootElement.querySelector(this.selectors.count)
    this.deleteAll = this.rootElement.querySelector(this.selectors.deleteAll)
    this.list = this.rootElement.querySelector(this.selectors.list)
    this.bindEvents();
    this.taskId = 1;
    this.renderSavedTasks()
  }

  inputSearchHandler = () => {
    this.searchInput.addEventListener('input', (event) => {
      const inputValue = event.target.value.trim().toLowerCase();
      const allTasks = Array.from(this.list.children);

      allTasks.forEach((task) => {
        const text = task.querySelector('[data-js-todo-text]').textContent.trim().toLowerCase();
        const isMatch = text.startsWith(inputValue);
        task.style.display = isMatch ? '' : 'none';
      })
    })
  }

  deleteTaskHandler = () => {
    this.list.addEventListener('click', (event) => {
      const deleteBtn = event.target.closest('[data-js-todo-delete]')
      if (!deleteBtn) return
      const todoItem = deleteBtn.closest('[data-js-task-item]');
      this.list.removeChild(todoItem)
      this.count.textContent = this.list.children.length;
      const tasksArray = Array.from(this.list.children).map((task) => {
        return {
          id: task.getAttribute('data-id'),
          text: task.querySelector('[data-js-todo-text]').textContent
        }
      })
      localStorage.setItem('tasks', JSON.stringify(tasksArray))
    })
  }

  chechboxHandler = () => {
    this.list.addEventListener('click', (event) => {
      const checkbox = event.target.closest('[data-js-todo-checkbox]');
      if (!checkbox) return

      const todoText = checkbox.closest('[data-js-task-item]').querySelector('[data-js-todo-text]')
      todoText.classList.toggle(this.classStates.isLine, checkbox.checked)

    })
  }

  addTaskHandler = () => {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.input.value != 0) {
        this.list.insertAdjacentHTML('beforeend', `<li class="task-item" data-id="${this.taskId}" data-js-task-item>
        <div class="checkbox-wrapper">
          <label class="checkbox">
            <input type="checkbox" class="checkbox__input" data-js-todo-checkbox >
            <span class="checkbox__box"></span>
          </label>
          <span class="task-text" data-js-todo-text>${this.input.value}</span>
        </div>
        <button class="delete-btn" aria-label="delete btn" data-js-todo-delete>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#757575" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </li>`)
        // this.list.lastElementChild.classList.add('is-active')
        // document.querySelectorAll('[data-js-task-item]').forEach((element) => {
        //   element.classList.add('is-active')
        // })
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.list.querySelectorAll('[data-js-task-item]').forEach((element) => {
              element.classList.add('is-active')
            })
          });
        });
        this.input.value = ''
        this.count.textContent = this.list.children.length;
        this.taskId++;

        const tasksArray = Array.from(this.list.children).map((task) => {
          return {
            id: task.getAttribute('data-id'),
            text: task.querySelector('[data-js-todo-text]').textContent
          }
        })
        localStorage.setItem('tasks', JSON.stringify(tasksArray))
      }
    })


  }

  deleteAllTaskHandler = () => {
    this.deleteAll.addEventListener('click', () => {
      if (this.list.children.length === 0) return
      const isConfirmed = confirm('Удалить все задачи?')
      if (!isConfirmed) return
      this.list.innerHTML = ""
      this.count.textContent = "0";
      this.taskId = 1;
      localStorage.removeItem('tasks')
    })
  }

  themeHandler = () => {
    const body = document.querySelector('body');
    const themeBtn = document.querySelector('.theme-btn');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-theme') {
      body.classList.add('dark-theme');
    }

    themeBtn.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      const theme = body.classList.contains('dark-theme') ? 'dark-theme' : '';
      localStorage.setItem('theme', theme);
    })
  }

  bindEvents() {
    this.addTaskHandler()
    this.deleteAllTaskHandler()
    this.chechboxHandler()
    this.deleteTaskHandler()
    this.inputSearchHandler()
    this.themeHandler()
  }

  renderSavedTasks() {
    const saved = localStorage.getItem('tasks')
    if (!saved) return

    const tasksArray = JSON.parse(saved)
    tasksArray.forEach(({ id, text }) => {
      this.list.insertAdjacentHTML('beforeend', `<li class="task-item" data-id="${id}" data-js-task-item>
        <div class="checkbox-wrapper">
          <label class="checkbox">
            <input type="checkbox" class="checkbox__input" data-js-todo-checkbox >
            <span class="checkbox__box"></span>
          </label>
          <span class="task-text" data-js-todo-text>${text}</span>
        </div>
        <button class="delete-btn" aria-label="delete btn" data-js-todo-delete>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#757575" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </li>`)
    })
    this.count.textContent = this.list.children.length

    this.list.querySelectorAll('[data-js-task-item]').forEach((element) => {
      element.classList.add('is-active')
    })

  }
}

class ToDoAppCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ToDoApp(element);
    })
  }
}

new ToDoAppCollection();