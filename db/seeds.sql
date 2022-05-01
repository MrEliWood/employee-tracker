USE employee_db;

INSERT INTO department (name)
VALUES ("Corporate"),
       ("Field Office");

INSERT INTO role (title, salary, department_id)
VALUES ("Executive", "500000.00", 1),
       ("Officer", "300000.00", 1),
       ("Manager", "150000.00", 2),
       ("Employee", "80000.00", 2),
       ("Intern", "60000.00", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jill", "Jackson", 1, null),
       ("Rick", "Steves", 2, 1),
       ("Erika", "Badu", 3, 2),
       ("Bob", "Ross", 4, 3),
       ("Sally", "Seashore", 5, 4);