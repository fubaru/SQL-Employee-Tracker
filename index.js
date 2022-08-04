const inquirer = require("inquirer");
const { title } = require("process");
const db = require("./config/connection");

require("console.table")

// if this connects successfully, then it will execute the call back of menu(). Call back is similar to a promise, execution order
db.connect(() => {
    menu()
});
// view = Read get request, add = create post request, update=put request
const menuQuestions = [
    {
        type: "list",
        name: "menu",
        message: "choose the following option:",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    }
]

function menu() {
    inquirer.prompt(menuQuestions)
        .then(res => {
            if (res.menu === "view all employees") {
                viewEmployees()
            }else if (res.menu === "view all departments") {
                viewDepartments()
            }else if (res.menu === "view all roles") {
                viewRoles()
            }else if (res.menu === "add an employee") {
                addEmployees()
            }else if (res.menu === "add a department") {
                addDepartments()
            }else if (res.menu === "add a role") {
                addRoles()
            }else if (res.menu === "update an employee role") {
                updateRole()
            }
        })
}

function viewRoles() {
    db.query(`SELECT * FROM role;`,(err,data)=>{
        console.table(data)
        menu()
    })
}

function viewDepartments() {
    db.query(`SELECT * FROM department;`,(err,data)=>{
        console.table(data)
        menu()
    })
}

function addDepartments() {
    db.query("SELECT * FROM department", (err, departmentData)=>{
        const departmentAddQuestions = [
            {
                type: "input",
                name: "departmentName",
                message: "What is the department name?"
            }
        ]
        inquirer.prompt(departmentAddQuestions)
                .then(res=>{
                    const parameters=[res.departmentName]
                    db.query("INSERT INTO department(name) VALUES(?)",parameters,(err,data)=>{
                        viewDepartments()
                    })
                })
    })
}

function addRoles() {
    db.query("SELECT name as name, id as value FROM department",(err,departData)=>{
        db.query(`SELECT * FROM role`, (err,roleData)=>{
            const roleAddQuestions = [
                {
                    type: "input",
                    name: "title",
                    message: "What is the new role?"
                },
                {
                    type: "number",
                    name: "salary",
                    message: "What is the role's salary?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departData
                }
            ]
            inquirer.prompt(roleAddQuestions)
                    .then(res=>{
                        const parameters=[res.title, res.salary, res.department_id]
                        db.query("INSERT INTO role (title,salary,department_id)VALUES(?,?,?)",parameters,(err,data)=>{
                            viewRoles()
                        })
                    })
        })
    })
}

function updateRole() {
    db.query('SELECT * FROM employee', function (err, result) {
      if (err) throw (err);
      inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
    
            message: "Which employee's role is changing?",
            choices: function () {
              var employeeArray = [];
              result.forEach(result => {
                employeeArray.push(
                  result.last_name
                );
              })
              return employeeArray;
            }
          }
        ])
     
        .then(function (answer) {
          console.log(answer);
          const name = answer.employeeName;
        
          db.query("SELECT * FROM role", function (err, res) {
            inquirer
              .prompt([
                {
                  name: "role",
                  type: "list",
                  message: "What is their new role?",
                  choices: function () {
                    var roleArray = [];
                    res.forEach(res => {
                      roleArray.push(
                        res.title)
                    })
                    return roleArray;
                  }
                }
              ]).then(function (roleAnswer) {
                const role = roleAnswer.role;
                console.log(role);
                db.query('SELECT * FROM role WHERE title = ?', [role], function (err, res) {
                  if (err) throw (err);
                  let roleId = res[0].id;
     
                  let query = "UPDATE employee SET role_id = ? WHERE last_name =  ?";
                  let values = [parseInt(roleId), name]
          
                  db.query(query, values,
                    function (err, res, fields) {
                      console.log(`You have updated ${name}'s role to ${role}.`)
                    })
                  viewEmployees();
                })
              })
          })
          //})
        })
    })
    };

function addEmployees() {
    db.query("select title as name, id as value from role", (err, roleData) => {
        db.query(`SELECT CONCAT(first_name, " ", last_name) as name, id as value from employee where manager_id is null`, (err, managerData) => {
            const employeeAddQuestions = [
                {
                    type: "input",
                    name: "first_name",
                    message: "What is your first name?",

                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is your last name?",
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Choose the following role title",
                    choices: roleData,
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Choose the following manager title",
                    choices: managerData,
                }
            ]
            inquirer.prompt(employeeAddQuestions)
                .then(res => {
                    const parameters = [res.first_name, res.last_name, res.role_id, res.manager_id]
                    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)", parameters, (err, data) => {
                        viewEmployees()
                    })
                })
        })
    })
}

function viewEmployees() {
    db.query(`
    SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name as department,
    role.salary,
    CONCAT(mgr.first_name, " ", mgr.last_name) as manager 
    FROM employee
    LEFT JOIN role ON role.id=employee.role_id
    LEFT JOIN department ON role.department_id=department.id
    LEFT JOIN employee as mgr ON employee.manager_id=mgr.id;`, (err, data) => {
        console.table(data)
        menu()
    })
}
