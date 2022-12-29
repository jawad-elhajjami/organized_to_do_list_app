// Author : EL HAJJAMI JAWAD
// Version : 1.0
// Title : To Do List Functionality

const btn = document.querySelector('#addTaskBtn');
const task = document.querySelector('#task');

// function to parse to do list from localStorage when the page loads
window.addEventListener('load',()=>{
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    output_tasks()
})

// function that outputs tasks on the page
function output_tasks(){
    let output = "";
    let tasks_list_container = document.querySelector('.task_list_container');

    // extracting tasks from localStorage
    let extracted_tasks = JSON.parse(localStorage.getItem('todos'));
    extracted_tasks.forEach((task, index) => {
        output += "<li id='"+index+"'>" + task.title + "<button class='deleteTaskBtn' onclick='delete_task("+index+")'>&times;</button>" + "</li>";
    });
    tasks_list_container.innerHTML = output;
}

// function to add task to localStorage
function add_task_to_localStorage(taskObj){
    todos.push(taskObj);
    localStorage.setItem('todos',JSON.stringify(todos));
}

// function to delete task from localStorage
function delete_task(task_id){
    todos.splice(task_id, 1);
    localStorage.setItem('todos',JSON.stringify(todos));
    output_tasks()
}

// check the validity of the data entered by the user in the task input
function isValid(input){
    if(input.value == "" || input.value == null || input.value == undefined){
        return false
    }else{
        return true
    }
}

btn.addEventListener('click',()=>{
    // getting value of input
    let task_value = task.value;

    // getting date when user clicks "add task "button

    let date = new Date();
    let year = date.getUTCFullYear();
    let day = date.getDate();
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let month = months[date.getMonth()];

    let dateStr = `${day} ${month} ${year}`;

    // creating task object
    let taskObj = {
        title:task_value,
        date:dateStr,
        done:false
    }

    // check if task input is valid then add it to localStorage
    if(isValid(task)) add_task_to_localStorage(taskObj);
    else{
        alert('error');
    }
    output_tasks()
});
