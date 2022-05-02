// import packages and modules
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require("./db/connection.js");

// main menu
function mainMenu() {

  // collect user input
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        name: 'main',
      }
    ])
    .then(function (response) {

      let { main } = response;

      // routing based on user input
      if (main === 'View all departments') {
        viewAllDepartments();
      } else if (main === 'View all roles') {
        viewAllRoles();
      } else if (main === 'View all employees') {
        viewAllEmployees();
      } else if (main === 'Add a department') {
        addDepartment();
      } else if (main === 'Add a role') {
        addRole();
      } else if (main === 'Add an employee') {
        addEmployee();
      } else if (main === 'Update an employee role') {
        changeRole();
      };

    });

}

// functions for handling user selections
function viewAllDepartments() {

  // view all departments with user friends headings, sorted by department ID
  let query = "SELECT id AS ID, name AS Department FROM department ORDER BY id";

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING DEPARTMENTS !!\n');
      mainMenu();
    } else {
      console.table('\n', res, '========================================\n');
      mainMenu();
    };

  });

};

function viewAllRoles() {

  // view all roles and their departments with user friends headings, no duplicate columns, sorted by role ID
  let query = `
  SELECT role.id AS ID, title AS Role, salary AS Salary, department.name AS Department
  FROM role JOIN department ON role.department_id = department.id
  ORDER BY role.id`;

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING ROLES !!\n');
      mainMenu();
    } else {
      console.table('\n', res, '========================================\n');
      mainMenu();
    };

  });

};

function viewAllEmployees() {

  // view all employees, their roles, and departments with user friendly headings, no duplicate columns, sorted by employee ID
  let query = `
  SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, title AS Role, salary AS Salary, department.name AS Department, manager.first_name AS Manager_First, manager.last_name AS Manager_Last
  FROM employee
  JOIN role ON employee.role_id = role.id
  JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  ORDER BY employee.id`;

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING EMPLOYEES !!\n');
      mainMenu();
    } else {
      console.table('\n', res, '========================================\n');
      mainMenu();
    };

  });

};

function addDepartment() {

  // collect user input
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the name of the new department?',
        name: 'department',
      }
    ])
    .then(function (response) {

      let { department } = response;

      // add new department to database
      let query = `INSERT INTO department (name) VALUES (?)`;

      db.query(query, department, (err, res) => {

        if (err) {
          console.log('\n\n!! ERROR CREATING DEPARTMENT !!\n');
          mainMenu();
        } else {
          console.log(`\nSuccess! ${department} has been added to departments.\n`);
          console.log('========================================\n');
          mainMenu();
        };

      });

    });

};

function addRole() {

  // get department names and IDs
  let departmentQuery = "SELECT * FROM department";

  db.query(departmentQuery, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING DEPARTMENTS, UNABLE TO CREATE ROLE !!\n');
      mainMenu();
    } else {

      const departmentChoices = [];
      const departmentIdNums = [];

      for (let i = 0; i < res.length; i++) {
        departmentChoices.push(res[i].name);
        departmentIdNums.push(res[i].id);
      }

      // collect user input
      inquirer
        .prompt([
          {
            type: 'input',
            message: 'What is the title of the new role?',
            name: 'role',
          },
          {
            type: 'input',
            message: 'What is the salary of the new role?',
            name: 'salary',
          },
          {
            type: 'list',
            message: 'What department does this role belong to?',
            choices: departmentChoices,
            name: 'department',
          }
        ])
        .then(function (response) {

          let { role, salary, department } = response;

          // get department ID
          let departmentId;

          for (let i = 0; i < departmentChoices.length; i++) {
            if (department === departmentChoices[i]) {
              departmentId = departmentIdNums[i];
            };
          };

          // add new role to database
          let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

          db.query(query, [role, salary, departmentId], (err, res) => {

            if (err) {
              console.log('\n\n!! ERROR CREATING ROLE !!\n');
              mainMenu();
            } else {
              console.log(`\n\nSuccess! ${role} has been added to roles.\n`);
              console.log('========================================\n');
              mainMenu();
            };

          });

        });

    };

  });

};

function addEmployee() {

  // get role names and IDs
  let roleQuery = `SELECT * FROM role`;

  db.query(roleQuery, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING ROLES, UNABLE TO ADD EMPLOYEE !!\n');
      mainMenu();
    } else {

      const roleChoices = [];
      const roleIdNums = [];

      for (let i = 0; i < res.length; i++) {
        roleChoices.push(res[i].title);
        roleIdNums.push(res[i].id);
      }

      // get manager names and IDs
      let employeeQuery = `SELECT * FROM employee`;

      db.query(employeeQuery, (err, res) => {

        if (err) {
          console.log('\n\n!! ERROR LOADING EMPLOYEES, UNABLE TO ADD NEW EMPLOYEE !!\n');
          mainMenu();
        } else {

          const managerChoices = [];
          const managerIdNums = [];

          for (let i = 0; i < res.length; i++) {
            managerChoices.push(`${res[i].first_name} ${res[i].last_name}`);
            managerIdNums.push(res[i].id);
          }

          managerChoices.push('This employee does not have a manager')

          // collect user input
          inquirer
            .prompt([
              {
                type: 'input',
                message: `What is the new employees first name?`,
                name: 'firstName',
              },
              {
                type: 'input',
                message: `What is the new employees last name?`,
                name: 'lastName',
              },
              {
                type: 'list',
                message: `What is the new employees role?`,
                choices: roleChoices,
                name: 'role',
              },
              {
                type: 'list',
                message: `Who is the new employee's manager?`,
                choices: managerChoices,
                name: 'manager',
              }
            ])
            .then(function (response) {

              let { firstName, lastName, role, manager } = response;

              // get role and manager IDs
              let roleId;
              let managerId;

              for (let i = 0; i < roleChoices.length; i++) {
                if (role === roleChoices[i]) {
                  roleId = roleIdNums[i];
                };
              }

              for (let i = 0; i < managerChoices.length; i++) {
                if (manager === 'This employee does not have a manager') {
                  managerId = null;
                } else if (manager === managerChoices[i]) {
                  managerId = managerIdNums[i];
                };
              }

              // add new employee to database
              let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

              db.query(query, [firstName, lastName, roleId, managerId], (err, res) => {

                if (err) {
                  console.log('\n\n!! ERROR ADDING EMPLOYEE !!\n');
                  mainMenu();
                } else {
                  console.log(`\n\nSuccess! ${firstName} ${lastName} has been added to the database.\n`);
                  console.log('========================================\n');
                  mainMenu();
                };

              });

            });

        };

      });

    };

  });

};

function changeRole() {

  // get role names and IDs
  let roleQuery = `SELECT * FROM role`;

  db.query(roleQuery, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING ROLES, UNABLE TO UPDATE !!\n');
      mainMenu();
    } else {

      const roleChoices = [];
      const roleIdNums = [];

      for (let i = 0; i < res.length; i++) {
        roleChoices.push(res[i].title);
        roleIdNums.push(res[i].id);
      }

      // get employee names and IDs
      let employeeQuery = `SELECT * FROM employee`;

      db.query(employeeQuery, (err, res) => {

        if (err) {
          console.log('\n\n!! ERROR LOADING EMPLOYEES, UNABLE TO UPDATE !!\n');
          mainMenu();
        } else {

          const employeeChoices = [];
          const employeeIdNums = [];

          for (let i = 0; i < res.length; i++) {
            employeeChoices.push(`${res[i].first_name} ${res[i].last_name}`);
            employeeIdNums.push(res[i].id);
          }

          // collect user input
          inquirer
            .prompt([
              {
                type: 'list',
                message: `Which employee would you like to update?`,
                choices: employeeChoices,
                name: 'employee',
              },
              {
                type: 'list',
                message: `What is the employee's new role?`,
                choices: roleChoices,
                name: 'newRole',
              }
            ])
            .then(function (response) {

              let { employee, newRole } = response;

              // get employee and role IDs
              let employeeId;
              let roleId;

              for (let i = 0; i < employeeChoices.length; i++) {

                if (employee === employeeChoices[i]) {
                  employeeId = employeeIdNums[i];
                };

                if (newRole === roleChoices[i]) {
                  roleId = roleIdNums[i];
                };

              }

              // update employee role in the database
              let query = `UPDATE employee SET role_id = ? WHERE id = ?`;

              db.query(query, [roleId, employeeId], (err, res) => {

                if (err) {
                  console.log('ERROR');
                } else {
                  console.log(`\n\nSuccess! ${employee}'s role has been changed to ${newRole}.\n`);
                  console.log('========================================\n');
                  mainMenu();
                };

              });

            });

        };

      });

    };

  });

};

// call main menu at start
mainMenu();