USE employee_db;

INSERT INTO department (name)
VALUES ("Accounting"),
       ("Shipping"),
       ("Processing"),
       ("Information Technology"),
       ("Human Resources");

INSERT INTO role (title, salary)
VALUES ("Executive", "500000.00"),
       ("Officer", "300000.00"),
       ("Manager", "150000.00"),
       ("Employee", "80000.00"),
       ("Intern", "60000.00");

INSERT INTO employee (first_name, last_name)
VALUES ("Jill", "Jackson"),
       ("Rick", "Steves"),
       ("Erika", "Badu"),
       ("Bob", "Ross"),
       ("Sally", "Seashore");