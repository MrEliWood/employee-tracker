// import packages and modules
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require("./db/connection.js");

// functions for handling user selections
function viewAllDepartments() {};

function viewAllRoles() {};

function viewAllEmployees() {};

function addDepartment() {};

function addRole() {};

function addEmployee() {};

function changeRole() {};

// main menu
inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
      name: 'main',
    }
  ])
  .then(function(response) {

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

  const sql = "SELECT * FROM employee";

  db.query(sql, (err, res) => {

    console.table(res);

  });