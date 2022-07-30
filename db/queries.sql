-- running all read commands in SQL so you don't have to type it out in terminal
USE employee_db;

SELECT * FROM department;
SELECT * FROM role;

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
LEFT JOIN employee as mgr ON employee.id=mgr.manager_id;