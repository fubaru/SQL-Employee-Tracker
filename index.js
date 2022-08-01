const inquirer = require("inquirer");
const db = require("./config/connection");

db.connect( ()=>{
    menu()
});

const menuQuestions = [
    {
        type:"list",
        name:"menu",
        message:"choose the following option:",
        choices:["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    }
]

const employeeAddQuestions = [
    {
        type:"input",
        name:"last_name",
        message:"What is your first name?",

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