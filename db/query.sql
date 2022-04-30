USE employee_db;

SELECT * 
FROM employee 
JOIN role ON employee.role_id = role.id;