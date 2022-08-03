const inquirer = require("inquirer");
const db = require("./config/connection");

// if this connects successfully, then it will execute the call back of menu(). Call back is similar to a promise, execution order
db.connect( ()=>{
    menu()
});
// view = Read get request, add = create post request, update=put request
const menuQuestions = [
    {
        type:"list",
        name:"menu",
        message:"choose the following option:",
        choices:["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    }
]

const updateEmployee = [{

}]

const employeeAddQuestions = [
    {
        type:"input",
        name:"first_name",
        message:"What is your first name?",

    },
    {
        type:"input",
        name:"last_name",
        message:"What is your last name?",

    }
]

function menu() {
    inquirer.prompt(menuQuestions)
    .then(res=>{
        if(res.menu==="view all employees"){
            viewEmployees()
        } else if (res==="add an employee"){
            addEmployees()
        }
    })
}

function viewEmployees() {
    
}

function addEmployees() {

}