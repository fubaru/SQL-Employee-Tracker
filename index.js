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



function menu() {

}