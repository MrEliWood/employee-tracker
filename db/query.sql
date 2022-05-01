USE employee_db;

-- view everything
SELECT * 
FROM employee 
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

-- view departments
SELECT id AS ID, name AS Department
FROM department;

-- view roles
SELECT role.id AS ID, title AS Role, salary AS Salary, department.name AS Department
FROM role
JOIN department ON role.department_id = department.id;

-- view employees
SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, title AS Role, salary AS Salary, department.name AS Department, manager.first_name AS Manager_First, manager.last_name AS Manager_Last
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

-- add department
-- INSERT INTO department (name)
-- VALUES ("department name");

-- -- add role
-- INSERT INTO role (title, salary, department_id)
-- VALUES ("title", "salary", "department id");

-- -- add employee
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("first name", "last name", "role id", "manager id");

-- get department name from id
-- SELECT id
-- FROM department WHERE department.name = "department name";

-- view all employees and roles
-- SELECT * 
-- FROM employee 
-- JOIN role ON employee.role_id = role.id;

-- get department name from id
SELECT role.id AS role_id, title, employee.id AS employee_id, first_name, last_name
FROM employee
JOIN role ON employee.role_id = role.id;