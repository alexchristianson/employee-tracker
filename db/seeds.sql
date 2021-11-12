INSERT INTO departments (name)
VALUES 
    ("Engineering"),
    ("Sales"),
    ("Finance"),
    ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Lead Engineer", 150000, 1),
    ("Software Engineer", 120000, 1),
    ("Sales Lead", 100000, 2),
    ("Salesperson", 800000, 2),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id, salary_id, department_id)
VALUES
    ("Gary", "Malone", 3, NULL, 3, 2),
    ("Tina", "Johnson", 6, NULL, 6, 4),
    ("Sharon", "Smith", 7, 6, 7, 4),
    ("Tom", "Watts", 1, NULL, 1, 1),
    ("John", "Price", 2, 1, 2, 1),
    ("Helen", "Carter", 4, 3, 4, 2),
    ("Hank", "McCoy", 5, NULL, 5, 3);