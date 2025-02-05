window.addEventListener(`load`, () => {
  init();
});

function init() {
  const container = document.querySelector(`#container`);
  const btnAdd = document.querySelector(`.btn-add`);
  const btnSort = document.querySelector(`.btn-sort`);
  const taskList = new TaskList();
  taskList.addTask();

  btnAdd.addEventListener(`click`, () => {
    taskList.addTask();
  });

  btnSort.addEventListener(`click`, (event) => {
    if (event.currentTarget.classList.contains(`down`)) {
      taskList.sortList(`down`);
      event.currentTarget.classList.remove(`down`);
      event.currentTarget.classList.add(`up`);
    } else {
      taskList.sortList(`up`);
      event.currentTarget.classList.remove(`up`);
      event.currentTarget.classList.add(`down`);
    }
  });
}

class TaskList {
  constructor() {
    this.idCount = 0;
    this.container = document.querySelector(`.tasks-list-cont`);
    this.taskList = [];
    this.draggableTask = null;
  }
  addTask() {
    const task = new Task(this.idCount++, (id) => this.deleteTask(id));

    this.taskList.push(task);
    this.container.append(task.container);

    task.container.draggable = true;

    const eventListener = (e) => this.dadEventListener(e);

    task.container.addEventListener(`dragstart`, eventListener);
    task.container.addEventListener(`dragenter`, eventListener);
    task.container.addEventListener(`dragend`, eventListener);
  }
  deleteTask(id) {
    const deletedTask = this.taskList.find((task) => task.id === id);
    const index = this.taskList.indexOf(deletedTask);
    this.taskList.splice(index, 1);
    deletedTask.container.remove();
  }
  sortList(sortStatus) {
    this.taskList.sort((a, b) => {
      if (a.input.value > b.input.value) {
        return sortStatus == `down` ? 1 : -1;
      } else if (a.input.value < b.input.value) {
        return sortStatus == `down` ? -1 : 1;
      }
      return 0;
    });

    this.taskList.forEach((item) => {
      this.container.append(item.container);
    });
  }
  dadEventListener(e) {
    switch (e.type) {
      case `dragstart`:
        this.draggableTask = e.currentTarget;
        break;
      case `dragenter`:
        if(
          e.currentTarget !== this.draggableTask &&
          e.currentTarget.classList.contains(`task`)
          ){
            this.changeTasks(this.draggableTask, e.currentTarget)

          }
        break;
      case `dragend`:
        this.draggableTask = null;
        break;
    }
  }
  changeTasks(task1,task2) {
    const children = [...this.container.children];
    const index1 = children.indexOf(task1);
    const index2 = children.indexOf(task2);
    if(index1 < index2){
      this.container.insertBefore(task2,task1)

    } else {
      this.container.insertBefore(task1, task2)

    }

  }
}
class Task {
  constructor(id, deleteTask) {
    this.id = id;
    this.container = document.createElement(`div`);
    this.container.classList.add(`task`);
    this.container.innerHTML = `
        <input placeholder="Введите задачу" />
        <div class="btn-delete">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="19"
              height="19"
              rx="9.5"
              stroke="#C4C4C4"
            />
            <path d="M6 6L14 14" stroke="#C4C4C4" />
            <path d="M6 14L14 6" stroke="#C4C4C4" />
          </svg>
        </div>
        `;
    const btnDelete = this.container.querySelector(`.btn-delete`);
    btnDelete.addEventListener(`click`, () => {
      deleteTask(this.id);
    });
    this.input = this.container.querySelector("input");
    
  }
}
