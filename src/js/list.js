import { v4 as uuidv4 } from 'uuid';

window.onload = () => {
    let todoInput = document.querySelector('.new-todo');
    let todoList = document.querySelector('.todo-list');
    let todoItemTemplate = document.querySelector('#todo-item');
    let listTodoItem = {};

    const filterCriteria = {
        all: 'all',
        active: 'active',
        completed: 'completed'
    }

    todoInput.addEventListener('keydown', (event) => {
        if(event.key === "Enter" && todoInput.value) {

            let todoItem = todoItemTemplate.content.cloneNode(true);
            let checkId = todoItem.querySelector('.toggle');
            let editTodoItem = todoItem.querySelector('.edit');

            editTodoItem.value = todoInput.value;

            const listTodoItem = {
                id: uuidv4(),
                value: todoInput.value,
                state: 'active'
            }

            checkId.setAttribute('value', listTodoItem.id);

            let data = JSON.parse(localStorage.getItem('data')) || [];
            data.push(listTodoItem);
            localStorage.setItem("data", JSON.stringify(data));

            //Повторный ввод данных в инпут
            editTodoItem.addEventListener('input', (event) => {
                let value = event.currentTarget.value
                let data = localStorage.getItem('data');
                data = JSON.parse(data)
                let findData = data.find(item => item.id === listTodoItem.id)
                let a = findData.value = value
                localStorage.setItem('data', JSON.stringify(data))
                console.log(a)
            })

            checkId.addEventListener('click', (event) => changeState(event));

            let buttonDestroy = todoItem.querySelector('.destroy');
            buttonDestroy.addEventListener('click', (event) => deleteTodoItem(event));

            todoList.appendChild(todoItem);
            todoInput.value = ''
        }
    });

    document.querySelector('.list-all').addEventListener('click', () => {
        let result = filter(filterCriteria.all);
        todoList.innerHTML = '';

        result.forEach(element => {
            renderTodoItem(element);
        });
    });

    document.querySelector('.list-active').addEventListener('click', () => {
        let result = filter(filterCriteria.active);
        todoList.innerHTML = '';

        result.forEach(element => {
            renderTodoItem(element);
        });
    });

    document.querySelector('.list-completed').addEventListener('click', () => {
        let result = filter(filterCriteria.completed);
        todoList.innerHTML = '';

        result.forEach(element => {
            renderTodoItem(element);
        });
    });

    let changeState = (event) => {
        let wrapTodoItem = event.currentTarget.closest('.view').parentNode;
        let editTodoItem = wrapTodoItem.querySelector('.edit');
        let checkId = event.currentTarget;

        let data = localStorage.getItem("data");
        let dataParse= JSON.parse(data);
        editTodoItem.classList.toggle('completed');

        let statusItem = dataParse.find(item => item.id === checkId.value);

        if(editTodoItem.value){
            if(statusItem.state === 'completed'){
                statusItem.state = 'active';
                editTodoItem.removeAttribute('readonly');
            }else{
                editTodoItem.setAttribute('readonly', 'true');
                statusItem.state = 'completed';
            }
        }else{
            checkId.checked = false
        }

        localStorage.setItem("data", JSON.stringify(dataParse));
        
    }
    let data = localStorage.getItem("data");
    data ? null : localStorage.setItem('data', JSON.stringify([]))
    
    let filter = (criteria) => {
        let data = localStorage.getItem("data");
        let dataParse= JSON.parse(data);
        let itemsActive = [];
        // Провервека на выбранные критерии в фильтре
        if (criteria === filterCriteria.all) {
            itemsActive = dataParse.filter(item => item.state === filterCriteria.completed || item.state === filterCriteria.active );
        }
        else {
            itemsActive = dataParse.filter(item => item.state === criteria);
        }
        return itemsActive;
    }
    
    let allCompleted = () => {
        let allItems = document.querySelectorAll('.edit');

        document.querySelector('.completed-all').addEventListener('click', () =>{
            allItems.forEach(element => {
                element.classList.add('completed')
            });
            console.log(allItems)
        })
    }
    allCompleted()
    //Метод удаления айтема из списка
    let deleteTodoItem = (event) => {

        let view = event.currentTarget.closest('.view').parentNode;
        let todoItemValue = view.querySelector('.edit').value;

        let localData = JSON.parse(localStorage.getItem("data"));

        let index = localData.findIndex(item => item.value === todoItemValue);

        if(index >= 0) {
            localData.splice(index, 1);
        }
        
        localStorage.setItem("data", JSON.stringify(localData));
        view.remove();
    }

    //Метод загрузки данных после перезагрузки страницы
    let loadData = () => {
        let localData = localStorage.getItem("data");

        if(localData) {
            let data = JSON.parse(localData);

            data.forEach(item => {
                let itemClone = todoItemTemplate.content.cloneNode(true);
                let buttonDestroy = itemClone.querySelector('.destroy');
                let check = itemClone.querySelector('.toggle');
                let editInputItem = itemClone.querySelector('.edit');
                
                check.value = item.id;
                
                if(item.state === 'completed'){
                    check.setAttribute('checked', true);
                    editInputItem.setAttribute('readonly', 'readonly')
                    editInputItem.classList.add('completed');
                }

                editInputItem.addEventListener('keydown', (event) => {
                    let value = event.currentTarget.value
                    let data = localStorage.getItem('data');
                    data = JSON.parse(data)
                    let findData = data.find(elem => elem.id === item.id)
                    findData.value = value
                    localStorage.setItem('data', JSON.stringify(data)) 
                })

                check.addEventListener('click', (event) => changeState(event));

                buttonDestroy.addEventListener('click', (event) => deleteTodoItem(event));

                itemClone.querySelector('.edit').value = item.value

                todoList.appendChild(itemClone);
            })
        }
    }

    loadData();

    //Метод отрисовки данных на сттранице при фильтрации
    let renderTodoItem = (objItem) => {
        let todoItem = todoItemTemplate.content.cloneNode(true);
        let checkId = todoItem.querySelector('.toggle');
        let editTodoItem = todoItem.querySelector('.edit');
    
        editTodoItem.value = objItem.value;
        checkId.setAttribute('value', objItem.id);
        
        //Повторный ввод данных в инпут после отрисовки
        editTodoItem.addEventListener('input', (event) => {
            let value = event.currentTarget.value
            let data = localStorage.getItem('data');
            data = JSON.parse(data)

            data = JSON.parse(localStorage.getItem("data"));

            
            let findData = data.find(item => item.id === objItem.id)
            findData.value = value
            localStorage.setItem('data', JSON.stringify(data)) 
        })
        
        editTodoItem.classList.toggle('completed');
        if(objItem.state === 'active'){
            editTodoItem.classList.remove('completed');
        }
        else{
            checkId.checked = objItem.state === 'completed' ? true : false;
            //Добавление завершенному айтему атрибут readonly
            editTodoItem.setAttribute('readonly', 'true');
        }
    
        checkId.addEventListener('click', (event) => changeState(event));
    
        let buttonDestroy = todoItem.querySelector('.destroy');
        buttonDestroy.addEventListener('click', (event) => deleteTodoItem(event));
    
        todoList.appendChild(todoItem);
    }
}