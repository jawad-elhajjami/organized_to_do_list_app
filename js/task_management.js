// Author : EL HAJJAMI JAWAD
// Version : 1.0
// Title : Task management (Create/Update/Delete)

// add new task popup

const add_new_task_popup = document.querySelector('.add_new_task_popup');
const addTaskBtn = document.querySelector('#addTaskBtn');
const save_task_btn = document.querySelector('#save_task_btn');
const close_add_task_btn = document.querySelector('#close_add_task_popup');
const add_task_form = document.querySelector('#add_task_form');

function open_add_task_popup(){
    add_new_task_popup.classList.add('active');
    overlay.classList.add('active');
}
close_add_task_btn.addEventListener('click',()=>{
    add_new_task_popup.classList.remove('active');
    overlay.classList.remove('active');
})

// function to parse to do list from localStorage when the page loads
window.addEventListener('load',()=>{
    todos = JSON.parse(localStorage.getItem('todos')) || [];
})


add_task_form.addEventListener('submit',(e)=>{
    
    let task_formdata = new FormData(add_task_form);
    let task_title = task_formdata.get('task_title');
    
    if(task_title !== null && task_title !== ''){
        let taskObj = {
            id:'task_'+Date.now(),
            title:task_title,
            date:get_current_date(),
            done:false,
            list:clicked_list.id
        }
        create_task(taskObj);
        document.querySelector('.error_message_container').textContent = '';
        add_new_task_popup.classList.remove('active');
        overlay.classList.remove('active');
        
        // increment list number of tasks value


    }else{
        e.preventDefault();
        document.querySelector('.error_message_container').textContent = 'Task title is required !';
    }

})

// function to add task to localStorage
function create_task(task_object){
    todos.push(task_object);
    localStorage.setItem('todos',JSON.stringify(todos));
    increment_number_of_tasks(clicked_list.id);
}

// function to change task status to done

function task_done(id){
    todos.map((task)=>{
        if(task.id == id){
            task.done = true;
        }
    })
    localStorage.setItem('todos',JSON.stringify(todos));
    show_list_tasks(clicked_list);
}

// function to delete task

function delete_task(id){
    todos.splice(id, 1);
    localStorage.setItem('todos',JSON.stringify(todos));
    decrement_number_of_tasks(clicked_list.id)
    show_list_tasks(clicked_list);
}

// function to delete all tasks related to a list when user deletes a list

function delete_all_tasks(list_id){
    todos.map((task,index)=>{
        if(task.list == list_id){
            todos.splice(index,1);
        }
    })
}