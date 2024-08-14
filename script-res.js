// скрытие кнопки "закрыть таск" при открытом меню
let tasksElemsListArr = Array.from( document.querySelectorAll('.tasks-container__task') );

// Добавление таска:
// ----------------
function addTask() {
    let inputTaskElem = document.querySelector('.input-field__input-task');
    let taskValue = inputTaskElem.value;

    let tasksContainer = document.querySelector('.my-task-app__tasks');

    if (taskValue === '') {
        alert('Please type your task ^^');
        return;
    };

    let newTaskElem = document.createElement('div');
    newTaskElem.classList.add('tasks-container__task');
    newTaskElem.innerHTML = `
        <div class="tasks-container__task__btns task-btns">
            <div class="task-btns__priority">[&gt;]</div>
            <div class="task-btns__close close-task">[X]</div>
        </div>
                        
        <span class="tasks-container__task__text">${taskValue}</span>

        <div class="tasks-container__task__date task-date">
            ${ timeWhenTaskAdded() }
        </div>

        <!-- меню приоритета таска (вложено в таск): -->
        <div class="tasks-container__task__menu priority-menu">
            <ul class="priority-menu__inner" style="">
                <li class="priority-menu__inner__high priority" data-priority="high">High Priority</li>
                <li class="priority-menu__inner__medium priority" data-priority="medium">Medium Priority</li>
                <li class="priority-menu__inner__low priority" data-priority="low">Low Priority</li>
                <li class="priority-menu__inner__standard priority" data-priority="standard">Standard Priority</li>
            </ul>

            <div class="priority-menu__close close-menu-btn">Close Menu</div>            
        </div>
    `;

    tasksContainer.append(newTaskElem);
    tasksElemsListArr.push(newTaskElem);
    setEventListeners(newTaskElem);
    updateLocalStorage();
    inputTaskElem.value = '';
};

// Удаление таска:
// --------------
function deleteTask(e) {
    let {target, currentTarget} = e;
    
    if (target.classList.contains('task-btns__close')) {
        currentTarget.remove();
    };
    updateLocalStorage();
};

// Открытие меню приоритета таска:
// ------------------------------
function showTaskPriorityMenu(e) {
    let {target, currentTarget} = e;

    if ( target.classList.contains('task-btns__priority') ) {
        let taskPriorityMenu = currentTarget.querySelector('.tasks-container__task__menu');
        taskPriorityMenu.classList.add('tasks-container__task__menu-active');        
        hideBtnsAndDisableInput();
    };    
};

// Закрытие меню приоритета таска:
// ------------------------------
function hideTaskPriorityMenu(e) {
    let {target, currentTarget} = e;

    if ( target.classList.contains('priority-menu__close' ) 
        || target.classList.contains('priority-menu__inner__high')
        || target.classList.contains('priority-menu__inner__medium')
        || target.classList.contains('priority-menu__inner__low')
        || target.classList.contains('priority-menu__inner__standard') ) {

        let taskPriorityMenu = currentTarget.querySelector('.tasks-container__task__menu');
        taskPriorityMenu.classList.remove('tasks-container__task__menu-active');        
        showBtnsAndEnableInput();
    };
};

// Назначение обработчиков событий:
// -------------------------------
function setEventListeners(elem) {
    
    elem.addEventListener( "click", (event) => {
        deleteTask(event);
        showTaskPriorityMenu(event);
        hideTaskPriorityMenu(event);
        setTaskPriority(event);        
    });
};

tasksElemsListArr.forEach( (task) => {
    setEventListeners(task);
});

document.querySelector('.input-field__add-btn').addEventListener('click', addTask);

// Скрыть кнопки выбора приоритета таска, заблокировать поле input:
// ----------------------------------------------------------------
function hideBtnsAndDisableInput() {
    let taskPriorBtnsList = document.querySelectorAll('.task-btns__priority');
    taskPriorBtnsList.forEach( btn => {
        btn.style.visibility = 'hidden';
    });

    let inputTaskElem = document.querySelector('.input-field__input-task');
    inputTaskElem.disabled = true;    
};

// Отобразить кнопки выбора приоритета таска, разблокировать поле input:
// ---------------------------------------------------------------------
function showBtnsAndEnableInput() {
    let taskPriorBtnsList = document.querySelectorAll('.task-btns__priority');
    taskPriorBtnsList.forEach( btn => {
        btn.style.visibility = 'visible';
    });

    let inputTaskElem = document.querySelector('.input-field__input-task');    
    inputTaskElem.disabled = false;
};

// Задать приоритет таску:
// ----------------------
function setTaskPriority(e) {
    const taskPrioritiesList = ['high', 'medium', 'low', 'standard'];

    let {target, currentTarget} = e;

    if ( target.classList.contains('priority') ) {
        let {priority} = target.dataset;

        taskPrioritiesList.forEach( priorityClass => {
            currentTarget.classList.remove( `${priorityClass}` );
            currentTarget.classList.add( `${priority}` );           
        });        
    };
    updateLocalStorage();
};

// Время добавления таска:
// ----------------------
function timeWhenTaskAdded() {
    let taskDate = new Date();
    let taskAddTimeValue = `${ taskDate.getHours() }:${ taskDate.getMinutes() } `;
    return taskAddTimeValue;
};

// Проверка активно ли меню выбора приоритета таска:
// ------------------------------------------------
function checkPriorityMenuActive() {
    let taskPriorityMenusNodeList = document.querySelectorAll('.tasks-container__task__menu');

    Array.from(taskPriorityMenusNodeList).forEach( taskPriorMenu => {

        if (taskPriorMenu.classList.contains('tasks-container__task__menu-active')) {
            
            let inputTaskElem = document.querySelector('.input-field__input-task');    
            inputTaskElem.disabled = true;
        };
    });
}

// Работа с localStorage:
// ----------------------
function updateLocalStorage() {
    let tasksContainer = document.querySelector('.my-task-app__tasks');
    localStorage.setItem('tasks', ` ${tasksContainer.innerHTML} `);   
};

function showLocalStorageTasks() {
    let tasksContainer = document.querySelector('.my-task-app__tasks');
    tasksContainer.innerHTML = localStorage.getItem('tasks');

    let tasksNodeList = tasksContainer.querySelectorAll('.tasks-container__task');
    let tasksArr = Array.from(tasksNodeList);

    tasksArr.forEach( task => {
        setEventListeners(task);
    });

    checkPriorityMenuActive();
};
showLocalStorageTasks();