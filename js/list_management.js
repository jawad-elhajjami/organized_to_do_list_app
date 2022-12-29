// Author : EL HAJJAMI JAWAD
// Version : 1.0
// Title : List management (Create/Delete List)


// get current date function
function get_current_date(){
    let date = new Date();
    let year = date.getUTCFullYear();
    let day = date.getDate();
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let month = months[date.getMonth()];

    let dateStr = `${day} ${month} ${year}`;
    return dateStr;
}

// add List popup

const saveListBtn = document.querySelector('#save_list_btn');
const closeAddListPopupBtn = document.querySelector('#close_add_list_popup');
const createListBtn = document.querySelector('#createListButton');
const overlay = document.querySelector('.overlay');
const addListPopup = document.querySelector('.add_new_list_popup');
const add_list_form = document.querySelector('#add_list_form');

// open add list popup
createListBtn.addEventListener('click',(event)=> {
    overlay.classList.add('active');
    addListPopup.classList.add('active');
});

// close add list popup
closeAddListPopupBtn.addEventListener('click',(event)=>{
    overlay.classList.remove('active');
    addListPopup.classList.remove('active');
})

// save list form

saveListBtn.addEventListener('click',(e)=>{
    let addListFormData = new FormData(add_list_form)
    let list_name = addListFormData.get('list_name')
    let list_color = addListFormData.get('list_color');
    
    // validate User input before creating new list
    if(list_name != '' && list_color !== null){
        create_list(list_name, list_color, get_current_date());
        // close popup
        overlay.classList.remove('active');
        addListPopup.classList.remove('active');    
        //refresh sidenav
        show_lists();    
        document.querySelector('.error_message_container').textContent = '';
    }else{
        e.preventDefault();
        document.querySelector('.error_message_container').textContent = 'Please fill all fields !';
    }
})

// get lists array or create an empty array
lists = JSON.parse(localStorage.getItem('lists')) || [];

// function to add list to localStorage

function create_list(name,color,date){

    // creating list object
    listObj = {
        id:'list_'+Date.now(),
        name: name,
        color: color,
        date: date,
        tasks_num: 0 // initialize tasks count to 0
    }
    lists.push(listObj);
    localStorage.setItem('lists',JSON.stringify(lists));
}

// function to delete list

function delete_list(idList){
    lists.splice(idList, 1);
    localStorage.setItem('lists',JSON.stringify(lists));
    show_lists()
    show_list_tasks()
}

// function to output lists in sidenav

function show_lists(){

    const lists_container = document.querySelector('.lists_container');
    let output = "";
    let extracted_lists = JSON.parse(localStorage.getItem('lists'));
    if(extracted_lists !== null && extracted_lists.length !== 0){
        extracted_lists.forEach((list,index) => {
            output += `
            <li class="list-item mt-10 mb-10" id="${index}">
                <div>
                    <div class="color" style='background-color:${list.color}'></div>
                    <span class="list_name">${list.name}</span>
                    <span class="number_of_tasks_in_list">(${list.tasks_num})</span>
                </div>
                <button id="deleteListBtn" onclick='delete_list(${index})'><i class="fa-solid fa-trash"></i></button>
            </li>`
        });
        lists_container.innerHTML = output;
    }else{
        lists_container.innerHTML = `<p style='opacity:.4'>There are no lists to be shown.</p>`;
    }
}
show_lists()

// click on a list to show its tasks

// declaring a global variable that's going to hold the value of the current clicked list

let clicked_list = "none"; // setting it to none by default

// function to get list info by id

function get_list_info(id){
    return lists[id];
}

const list_btns = Array.from(document.querySelectorAll('.list-item .list_name'));
list_btns.forEach((listBtn,index) =>{
    listBtn.addEventListener('click',()=>{
        // getting list id on click
        let listId = listBtn.parentElement.parentElement.id;
        clicked_list = get_list_info(listId);
        // show tasks related to a list
        show_list_tasks(clicked_list);
        // make the clicked list on the sidenav bold so the user knows which list he's on
        list_btns.forEach(list_btn =>{
            if(list_btn.parentElement.parentElement.id !== listId){
                list_btn.parentElement.parentElement.classList.remove('clicked_list')
            }else{
                list_btn.parentElement.parentElement.classList.add('clicked_list')
            }
        }) 
    })
});

// update output based on clicked list
const center_area_wrapper = document.querySelector('.center_area_wrapper');
function show_list_tasks(clicked_list){
    let output = "";
    // output this when there are no tasks on a list
    if(clicked_list.tasks_num == 0){
    output += `
       <h2>${clicked_list.name}</h2>
    `
        output += `
            <h4 style='opacity:0.5;margin:40px 0;'>No tasks created yet</h4>
            <button id="addTaskBtn" class='button' onClick = 'open_add_task_popup()'>Add task</button>
        `
    }
    // output this when list is not empty
    else{
        
        let todo_tasks = todos.map((task)=>{
            if(task.list == clicked_list.id){
                if(task.done == false){
                    return task;
                }
            }
        })
        let done_tasks = todos.map((task)=>{
            if(task.list == clicked_list.id){
                if(task.done == true){
                    return task;
                }
            }
        })
        done_tasks = done_tasks.filter(task => task)
        todo_tasks = todo_tasks.filter(task => task)

        output += `
            <div class='row'>
                <h2>${clicked_list.name}</h2>
                <button id="addTaskBtn" class='button' onClick = 'open_add_task_popup()'>Add task</button>
            </div>
        `
        // show to do tasks
        if(todo_tasks.length !== 0){
            output += `
            <h4 style='margin-top:20px;color:#6D67E4;'>To do:</h4>`;
            todo_tasks.forEach(task => {
                   
                    if(task.done == false){
                        output += `
                        <div class='task_row'>
                        <div class='task_col_1'>
                            <h3>${task.title}</h3>
                            <p style='opacity:0.5'>Added on ${task.date}</p>
                        </div>
                        <div class='task_crud_buttons'>
                            <button id="taskDoneBtn" onClick='task_done("${task.id}")'><i class="fa-solid fa-check"></i></button>
                            <button id="deleteTaskBtn" onClick='delete_task("${task.id}")'><i class="fa-solid fa-trash"></i></button>
                            <button id="updateTaskBtn"><i class="fa-solid fa-pen"></i></button>
                        </div>
                        </div>
                    `
                    }
                    
            })
        }  

        // show done tasks
        if(done_tasks.length !== 0){
            output += `
            <h4 style='margin-top:20px;color:#6D67E4;'>Done:</h4>`;
                done_tasks.forEach(task => {
                   
                    if(task.done == true){
                        output += `
                        <div class='task_row'>
                        <div class='task_col_1'>
                            <h3>${task.title}</h3>
                            <p style='opacity:0.5'>Added on ${task.date}</p>
                        </div>
                        <div class='task_crud_buttons'>
                            <button id="taskDoneBtn" onClick='task_done("${task.id}")'><i class="fa-solid fa-check"></i></button>
                            <button id="deleteTaskBtn" onClick='delete_task("${task.id}")'><i class="fa-solid fa-trash"></i></button>
                            <button id="updateTaskBtn"><i class="fa-solid fa-pen"></i></button>
                        </div>
                        </div>
                    `
                    }
                    
                })
        }
        
    }
    
    center_area_wrapper.innerHTML = output;
}

// increment list number of tasks when creating a new task

function increment_number_of_tasks(idList){
    let arr = lists.map((list)=>{
        if(list.id == idList){
            list.tasks_num++;
        }
    })
    localStorage.setItem('lists',JSON.stringify(lists));
    show_lists();
}

// decrement list number of tasks when deleting a task

function decrement_number_of_tasks(idList){
    let arr = lists.map((list)=>{
        if(list.id == idList){
            list.tasks_num--;
        }
    })
    localStorage.setItem('lists',JSON.stringify(lists));
    show_lists()
}