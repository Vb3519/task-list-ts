var _a;
var taskElemsList = document.querySelectorAll('.tasks-container__task');
var tasksElemsArr = Array.from(taskElemsList);
// Добавление таска:
// ----------------
function addTask() {
    var inputTaskElem = document.querySelector('.input-field__input-task');
    var tasksContainer = document.querySelector('.my-task-app__tasks');
    if ((inputTaskElem === null || inputTaskElem === void 0 ? void 0 : inputTaskElem.value) === '') {
        alert('Please type your task ^^');
        return;
    }
    var newTaskElem = document.createElement('div');
    newTaskElem.classList.add('tasks-container__task');
    newTaskElem.innerHTML = "\n        <div class=\"tasks-container__task__btns task-btns\">\n            <div class=\"task-btns__priority\">[&gt;]</div>\n            <div class=\"task-btns__close close-task\">[X]</div>\n        </div>\n                        \n        <span class=\"tasks-container__task__text\">".concat(inputTaskElem === null || inputTaskElem === void 0 ? void 0 : inputTaskElem.value, "</span>\n\n        <div class=\"tasks-container__task__date task-date\">\n           ").concat(taskAddTime(), "\n        </div>\n\n        <!-- \u043C\u0435\u043D\u044E \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0430 \u0442\u0430\u0441\u043A\u0430 (\u0432\u043B\u043E\u0436\u0435\u043D\u043E \u0432 \u0442\u0430\u0441\u043A): -->\n        <div class=\"tasks-container__task__menu priority-menu\">\n            <ul class=\"priority-menu__inner\" style=\"\">\n                <li class=\"priority-menu__inner__high priority\" data-priority=\"high\">High Priority</li>\n                <li class=\"priority-menu__inner__medium priority\" data-priority=\"medium\">Medium Priority</li>\n                <li class=\"priority-menu__inner__low priority\" data-priority=\"low\">Low Priority</li>\n                <li class=\"priority-menu__inner__standard priority\" data-priority=\"standard\">Standard Priority</li>\n            </ul>\n\n            <div class=\"priority-menu__close close-menu-btn\">Close Menu</div>            \n        </div>\n    ");
    tasksContainer === null || tasksContainer === void 0 ? void 0 : tasksContainer.append(newTaskElem);
    tasksElemsArr.push(newTaskElem);
    setEventListeners(newTaskElem);
    upgradeLocalStorage();
    if (inputTaskElem) {
        inputTaskElem.value = '';
    }
    ;
}
(_a = document.querySelector('.input-field__add-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTask);
// Время добавления таска:
// ----------------------
function taskAddTime() {
    var taskAddDate = new Date;
    var taskAddTime = "".concat(taskAddDate.getHours(), ":").concat(taskAddDate.getMinutes());
    return taskAddTime;
}
;
// Удаление таска:
// --------------
function deleteTask(e) {
    var target = e.target, currentTarget = e.currentTarget;
    if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
        if (target.classList.contains('task-btns__close')) {
            currentTarget.remove();
        }
        ;
    }
    ;
    upgradeLocalStorage();
}
;
// Открытие меню приоритета таска:
// ------------------------------
function showTaskPriorityMenu(_a) {
    var target = _a.target, currentTarget = _a.currentTarget;
    if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
        if (target.classList.contains('task-btns__priority')) {
            var taskPriorityMenuElem = currentTarget.querySelector('.tasks-container__task__menu');
            taskPriorityMenuElem === null || taskPriorityMenuElem === void 0 ? void 0 : taskPriorityMenuElem.classList.add('tasks-container__task__menu-active');
            hideTaskBtnsAndDisableInput();
        }
        ;
    }
    ;
}
;
// Закрытие меню приоритета таска:
// ------------------------------
function hideTaskPriorityMenu(_a) {
    var target = _a.target, currentTarget = _a.currentTarget;
    if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
        if (target.classList.contains('priority-menu__close')
            || target.classList.contains('priority-menu__inner__high')
            || target.classList.contains('priority-menu__inner__medium')
            || target.classList.contains('priority-menu__inner__low')
            || target.classList.contains('priority-menu__inner__standard')) {
            var taskPriorityMenuElem = currentTarget.querySelector('.tasks-container__task__menu');
            taskPriorityMenuElem === null || taskPriorityMenuElem === void 0 ? void 0 : taskPriorityMenuElem.classList.remove('tasks-container__task__menu-active');
            showTaskBtnsAndEnableInput();
        }
        ;
    }
    ;
}
;
// Задать приоритет таску:
// ----------------------
function setTaskPriority(e) {
    var taskPrioritiesArr = ['high', 'medium', 'low', 'standard'];
    var target = e.target;
    var currentTarget = e.currentTarget;
    if (target.classList.contains('priority')) {
        var priority_1 = target.dataset.priority;
        taskPrioritiesArr.forEach(function (priorityClass) {
            currentTarget.classList.remove("".concat(priorityClass)); // убираются все возможные варианты приоритета
            currentTarget.classList.add("".concat(priority_1)); // указывается нужный приоритет (из значения data-атрибута)
        });
    }
    ;
    upgradeLocalStorage();
}
;
// Назначение обработчиков событий:
// -------------------------------
function setEventListeners(elem) {
    elem.addEventListener('click', function (event) {
        deleteTask(event);
        showTaskPriorityMenu(event);
        hideTaskPriorityMenu(event);
        setTaskPriority(event);
    });
}
;
tasksElemsArr.forEach(function (task) {
    setEventListeners(task);
});
// Скрыть кнопки выбора приоритета таска, заблокировать поле input:
// ----------------------------------------------------------------
function hideTaskBtnsAndDisableInput() {
    var taskPriorBtns = document.querySelectorAll('.task-btns__priority');
    Array.from(taskPriorBtns).forEach(function (priorBtn) {
        priorBtn.style.visibility = 'hidden';
    });
    var taskCloseBtns = document.querySelectorAll('.task-btns__close');
    Array.from(taskCloseBtns).forEach(function (taskCloseBtn) {
        taskCloseBtn.style.visibility = 'hidden';
    });
    var inputTaskElem = document.querySelector('.input-field__input-task');
    if (inputTaskElem) {
        inputTaskElem.disabled = true;
    }
    ;
}
// Отобразить кнопки выбора приоритета таска, разблокировать поле input:
// ---------------------------------------------------------------------
function showTaskBtnsAndEnableInput() {
    var taskPriorBtns = document.querySelectorAll('.task-btns__priority');
    Array.from(taskPriorBtns).forEach(function (priorBtn) {
        priorBtn.style.visibility = 'visible';
    });
    var taskCloseBtns = document.querySelectorAll('.task-btns__close');
    Array.from(taskCloseBtns).forEach(function (taskCloseBtn) {
        taskCloseBtn.style.visibility = 'visible';
    });
    var inputTaskElem = document.querySelector('.input-field__input-task');
    if (inputTaskElem) {
        inputTaskElem.disabled = false;
    }
    ;
}
// Проверка активно ли меню выбора приоритета таска:
// ------------------------------------------------
function checkPriorityMenuActive() {
    var taskPriorityMenusList = document.querySelectorAll('.tasks-container__task__menu');
    Array.from(taskPriorityMenusList).forEach(function (taskPriorMenu) {
        if (taskPriorMenu.classList.contains('tasks-container__task__menu-active')) {
            var inputTaskElem = document.querySelector('.input-field__input-task');
            if (inputTaskElem) {
                inputTaskElem.disabled = true;
            }
            ;
        }
        ;
    });
}
;
// Работа с localStorage:
// ----------------------
function upgradeLocalStorage() {
    var tasksContainer = document.querySelector('.my-task-app__tasks');
    localStorage.setItem('tasks', " ".concat(tasksContainer === null || tasksContainer === void 0 ? void 0 : tasksContainer.innerHTML, " "));
}
;
function showLocalStorageTasks() {
    var tasksContainer = document.querySelector('.my-task-app__tasks');
    if (tasksContainer) {
        var tasksContainerInner = localStorage.getItem('tasks');
        tasksContainer.innerHTML = tasksContainerInner;
    }
    ;
    var tasksList = tasksContainer === null || tasksContainer === void 0 ? void 0 : tasksContainer.querySelectorAll('.tasks-container__task');
    if (tasksList) {
        var tasksListArr = Array.from(tasksList);
        tasksListArr.forEach(function (task) {
            setEventListeners(task);
        });
    }
    ;
    checkPriorityMenuActive();
}
;
showLocalStorageTasks();
