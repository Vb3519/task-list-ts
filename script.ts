const taskElemsList: NodeListOf<HTMLElement> = document.querySelectorAll('.tasks-container__task');
const tasksElemsArr: HTMLElement[] = Array.from(taskElemsList);

// Добавление таска:
// ----------------
function addTask(): void {
    let inputTaskElem: HTMLInputElement | null = document.querySelector('.input-field__input-task');
    const tasksContainer: HTMLElement | null = document.querySelector('.my-task-app__tasks');

    if (inputTaskElem?.value === '') {
        alert('Please type your task ^^');
        return;
    }

    let newTaskElem: HTMLElement = document.createElement('div');
    newTaskElem.classList.add('tasks-container__task');

    newTaskElem.innerHTML = `
        <div class="tasks-container__task__btns task-btns">
            <div class="task-btns__priority">[&gt;]</div>
            <div class="task-btns__close close-task">[X]</div>
        </div>
                        
        <span class="tasks-container__task__text">${inputTaskElem?.value as string}</span>

        <div class="tasks-container__task__date task-date">
           ${ taskAddTime() }
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

    tasksContainer?.append(newTaskElem);
    tasksElemsArr.push(newTaskElem);
    setEventListeners(newTaskElem);
    upgradeLocalStorage();
   if (inputTaskElem) {
    inputTaskElem.value = '';
   };
    
}
document.querySelector('.input-field__add-btn')?.addEventListener('click', addTask);

// Время добавления таска:
// ----------------------
function taskAddTime(): string {
    let taskAddDate: Date = new Date;
    let taskAddTime: string = `${ taskAddDate.getHours() }:${ taskAddDate.getMinutes() }`;
    return taskAddTime;
};

// Удаление таска:
// --------------
function deleteTask(e: Event): void {
    let {target, currentTarget} = e;

    if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
        if (target.classList.contains('task-btns__close')) {
            currentTarget.remove();
        };        
    };
    upgradeLocalStorage();
};

// Открытие меню приоритета таска:
// ------------------------------
function showTaskPriorityMenu( {target, currentTarget}: Event ): void {

    if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
        if (target.classList.contains('task-btns__priority')) {
            let taskPriorityMenuElem: HTMLElement | null = currentTarget.querySelector('.tasks-container__task__menu');
            taskPriorityMenuElem?.classList.add('tasks-container__task__menu-active');
            hideTaskBtnsAndDisableInput();
        };
    };
};

// Закрытие меню приоритета таска:
// ------------------------------
function hideTaskPriorityMenu( {target, currentTarget}: Event ): void {

    if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
        if (target.classList.contains('priority-menu__close')
            || target.classList.contains('priority-menu__inner__high')
            || target.classList.contains('priority-menu__inner__medium')
            || target.classList.contains('priority-menu__inner__low')
            || target.classList.contains('priority-menu__inner__standard')
        ) {
            let taskPriorityMenuElem: HTMLElement | null = currentTarget.querySelector('.tasks-container__task__menu');
            taskPriorityMenuElem?.classList.remove('tasks-container__task__menu-active');
            showTaskBtnsAndEnableInput();
        };
    };
};

// Задать приоритет таску:
// ----------------------
function setTaskPriority(e: Event): void {
    const taskPrioritiesArr: string[] = ['high', 'medium', 'low', 'standard'];
    let target = e.target as HTMLElement;
    let currentTarget = e.currentTarget as HTMLElement;

    if (target.classList.contains('priority')) {
        let {priority} = target.dataset;

        taskPrioritiesArr.forEach( priorityClass => {
            currentTarget.classList.remove( `${priorityClass}` ); // убираются все возможные варианты приоритета
            currentTarget.classList.add( `${priority}` ) // указывается нужный приоритет (из значения data-атрибута)
        });
    };
    upgradeLocalStorage();
};

// Назначение обработчиков событий:
// -------------------------------
function setEventListeners(elem: HTMLElement): void {
    elem.addEventListener('click', (event: Event) => {
        deleteTask(event);
        showTaskPriorityMenu(event);
        hideTaskPriorityMenu(event);
        setTaskPriority(event);
    });
};

tasksElemsArr.forEach( (task) => {
    setEventListeners(task);
});


// Скрыть кнопки выбора приоритета таска, заблокировать поле input:
// ----------------------------------------------------------------
function hideTaskBtnsAndDisableInput(): void {
    let taskPriorBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.task-btns__priority');

    Array.from(taskPriorBtns).forEach( priorBtn => {
        priorBtn.style.visibility = 'hidden';
    });

    let taskCloseBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.task-btns__close');

    Array.from(taskCloseBtns).forEach( taskCloseBtn => {
        taskCloseBtn.style.visibility = 'hidden';
    })

    let inputTaskElem: HTMLInputElement | null = document.querySelector('.input-field__input-task');

    if (inputTaskElem) {
        inputTaskElem.disabled = true;
    };
}

// Отобразить кнопки выбора приоритета таска, разблокировать поле input:
// ---------------------------------------------------------------------
function showTaskBtnsAndEnableInput(): void {
    let taskPriorBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.task-btns__priority');

    Array.from(taskPriorBtns).forEach( priorBtn => {
        priorBtn.style.visibility = 'visible';
    });

    let taskCloseBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.task-btns__close');

    Array.from(taskCloseBtns).forEach( taskCloseBtn => {
        taskCloseBtn.style.visibility = 'visible';
    })

    let inputTaskElem: HTMLInputElement | null = document.querySelector('.input-field__input-task');

    if (inputTaskElem) {
        inputTaskElem.disabled = false;
    };
}

// Проверка активно ли меню выбора приоритета таска:
// ------------------------------------------------
function checkPriorityMenuActive(): void {

    let taskPriorityMenusList: NodeListOf<HTMLElement> = document.querySelectorAll('.tasks-container__task__menu');

    Array.from(taskPriorityMenusList).forEach( taskPriorMenu => {

        if ( taskPriorMenu.classList.contains('tasks-container__task__menu-active') ) {
            let inputTaskElem: HTMLInputElement | null = document.querySelector('.input-field__input-task');

            if (inputTaskElem) {
                inputTaskElem.disabled = true;
            };
        };
    });
};

// Работа с localStorage:
// ----------------------
function upgradeLocalStorage(): void {
    let tasksContainer: HTMLElement | null = document.querySelector('.my-task-app__tasks');

    localStorage.setItem('tasks', ` ${tasksContainer?.innerHTML} `);
};

function showLocalStorageTasks(): void {
    let tasksContainer: HTMLElement | null = document.querySelector('.my-task-app__tasks');    
    
    if (tasksContainer) {
        let tasksContainerInner = localStorage.getItem('tasks');
        tasksContainer.innerHTML = tasksContainerInner as string;
    };

    let tasksList: NodeListOf<HTMLElement> | undefined = tasksContainer?.querySelectorAll('.tasks-container__task');
    
    if (tasksList) {
        let tasksListArr: HTMLElement[] = Array.from(tasksList);
        tasksListArr.forEach( task => {
            setEventListeners(task);
        });
    };
    checkPriorityMenuActive();
};
showLocalStorageTasks();