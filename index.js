// import packages and modules
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require("./db/connection.js");

// functions for handling user selections
function mainMenu() {

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

// main menu
function viewAllDepartments() {

  let query = "SELECT id AS ID, name AS Department FROM department";

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING DEPARTMENTS !!\n');
      mainMenu();
    } else {
      console.table('', res, '========================================\n');
      mainMenu();
    };

  });

};

function viewAllRoles() {

  let query = `
  SELECT role.id AS ID, title AS Role, salary AS Salary, department.name AS Department
  FROM role JOIN department ON role.department_id = department.id`;

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING ROLES !!\n');
      mainMenu();
    } else {
      console.table('', res, '========================================\n');
      mainMenu();
    };

  });

  mainMenu();

};

function viewAllEmployees() {

  let query = `
  SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, title AS Role, salary AS Salary, department.name AS Department, manager.first_name AS Manager_First, manager.last_name AS Manager_Last
  FROM employee
  JOIN role ON employee.role_id = role.id
  JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING EMPLOYEES !!\n');
      mainMenu();
    } else {
      console.table('', res, '========================================\n');
      mainMenu();
    };

  });

  mainMenu();

};

function addDepartment() {

  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the name of the new department?',
        name: 'newDepartment',
      }
    ])
    .then(function (response) {

      let { newDepartment } = response;

      let query = `INSERT INTO department (name) VALUES (?)`;

      db.query(query, newDepartment, (err, res) => {

        if (err) {
          console.log('\n\n!! ERROR CREATING DEPARTMENT !!\n');
          mainMenu();
        } else {
          console.log(`\nSuccess! ${newDepartment} has been added to departments.\n`);
          console.log('========================================\n');
          mainMenu();
        };

      });

    });

};

function addRole() {

  let query = "SELECT * FROM department";

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING DEPARTMENTS, UNABLE TO CREATE ROLE !!\n');
      mainMenu();
    } else {

      const departmentChoices = [];

      for (let i = 0; i < res.length; i++) {
        departmentChoices.push(res[i].name);
      }

      inquirer
        .prompt([
          {
            type: 'input',
            message: 'What is the title of the new role?',
            name: 'newRoleName',
          },
          {
            type: 'input',
            message: 'What is the salary of the new role?',
            name: 'newRoleSalary',
          },
          {
            type: 'list',
            message: 'What department does this role belong to?',
            choices: departmentChoices,
            name: 'newRoleDepartment',
          }
        ])
        .then(function (response) {

          let { newRoleName, newRoleSalary, newRoleDepartment } = response;

          // get department id from department name
          const sql = `SELECT id FROM department WHERE department.name = "${newRoleDepartment}"`;

          db.query(sql, (err, res) => {

            if (err) {
              console.log('ERROR');
            } else {
              let departmentId = res[0].id;

              let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    
              db.query(query, [newRoleName, newRoleSalary, departmentId], (err) => {
    
                if (err) {
                  console.log('\n\n!! ERROR CREATING ROLE !!\n');
                  mainMenu();
                } else {
                  console.log(`\n\nSuccess! ${newRoleName} has been added to roles.\n`);
                  console.log('========================================\n');
                  mainMenu();
                };
    
              });

            };

          });


        });

    };

  });

};

function addEmployee() {

  let query = `
  SELECT * 
  FROM employee 
  JOIN role ON employee.role_id = role.id`;

  db.query(query, (err, res) => {

    if (err) {
      console.log('\n\n!! ERROR LOADING ROLES, UNABLE TO CREATE EMPLOYEE !!\n');
      mainMenu();
    } else {

      const roleChoices = [];
      const managerChoices = [];

      for (let i = 0; i < res.length; i++) {
        roleChoices.push(res[i].title);
        managerChoices.push(`${res[i].first_name} ${res[i].last_name}`);
      }

      managerChoices.push('This employee has no manager');

      inquirer
        .prompt([
          {
            type: 'input',
            message: `What is the new employee's first name?`,
            name: 'newFirstName',
          },
          {
            type: 'input',
            message: `What is the new employee's last name?`,
            name: 'newLastName',
          },
          {
            type: 'list',
            message: `What is the new employee's role?`,
            choices: roleChoices,
            name: 'newEmployeeRole',
          },
          {
            type: 'list',
            message: `Who is the new employee's manager?`,
            choices: managerChoices,
            name: 'newEmployeeManager',
          }
        ])
        .then(function (response) {

          let { newFirstName, newLastName, newEmployeeRole, newEmployeeManager } = response;

          // get role id from role name and manager id from manager name
          const sql = `
          SELECT role.id AS role_id, title, employee.id AS employee_id, first_name, last_name
          FROM employee
          JOIN role ON employee.role_id = role.id`;

          db.query(sql, (err, res) => {

            if (err) {
              console.log('ERROR');
            } else {

              let roleId = null;
              let managerId = null;

              for (let i = 0; i < res.length; i++) {
                if (res[i].title == newEmployeeRole) {
                  roleId = res[i].role_id;
                };

                if (`${res[i].first_name} ${res[i].last_name}` == newEmployeeManager) {
                  managerId = res[i].employee_id;
                };
                
              };

              let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    
              db.query(query, [newFirstName, newLastName, roleId, managerId], (err) => {
    
                if (err) {
                  console.log('\n\n!! ERROR CREATING EMPLOYEE !!\n');
                  mainMenu();
                } else {
                  console.log(`\n\nSuccess! ${newFirstName} ${newLastName} has been added to employees.\n`);
                  console.log('========================================\n');
                  mainMenu();
                };
    
              });

            };

          });


        });

    };

  });

};

function changeRole() {

};

// call main menu at start
mainMenu();