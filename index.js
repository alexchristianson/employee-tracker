const express = require('express');
const inquirer = require('inquirer');
const table = require('console.table');
const mysql = require('mysql2');
const connection = require('./db/connection');


connection.connect(() => {
    init();
})

function init () {
    inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "What would you like to do?",
          choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a new department",
            "Add a new role",
            "Add a new employee",
            "Update employee roles",
            "Exit"
          ]
        }])
        .then(function (answer) {
            switch (answer.action) {
              case "View all departments":
                viewDepartments();
                break;
              case "View all roles":
                viewRoles();
                break;
              case "View all employees":
                viewEmployees();
                break;
              case "Add a new department":
                addDepartment();
                break;
              case "Add a new role":
                addRole();
                break;
              case "Add a new employee":
                addEmployee();
                break;
              case "Update employee roles":
                updateEmployeeRole();
                break;
              case "exit":
                connection.end();
                break;
        }
    });
};

// view all departments
function viewDepartments() {
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) {
            throw error;
        }
        console.table(res);
        init();
    });
};

// view all roles
function viewRoles() {
    connection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) {
            throw error;
        }
        console.table(res);
        init();
    }); 
};

// view all employees
function viewEmployees() {
    connection.query(`SELECT * FROM employees`, (err, res) => {
        if (err) {
            throw error;
        }
        console.table(res);
        init();
    }); 
};

// add a department
function addDepartment() {
    inquirer.prompt([
        {
            name: "add_dept",
            type: "input",
            message: "What department would you like to add?"
        }
    ]).then(data => {
        connection.query(`INSERT INTO departments SET ?`, {
            name: data.add_dept,
        }, 
        function(err) {
            if (err) {
                throw err;
            }
            init();
        });
    })
};

// add a role
function addRole() {
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) {
            throw err;
        }
        inquirer.prompt([
            { 
                name: "add_role",
                type: "input",
                message: "What role would you like to add?",
            },
            {
                name: "add_salary",
                type: "input",
                message: "What would you like their salary to be?"
            },
            {
                name: "department_id",
                type: "list",
                message: "Which department would you like to add this role to?",
                choices: res.map(department => department.name)
            }
        ])
        .then(data => {
            const chosenDepartment = res.find(department => department.name === data.department_id);

            connection.query(`INSERT INTO roles SET ?`, {
                title: data.add_role,
                salary: data.add_salary,
                department_id: chosenDepartment.id
            }, 
            function(err) {
                if (err) {
                    throw err;
                }
                init();
            });
        });
    });
};

// add an employee
function addEmployee() {
    connection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) {
            throw err;
        }
        inquirer.prompt([
            { 
                name: "add_firstName",
                type: "input",
                message: "What is the new employee's first name",
            },
            {
                name: "add_lastName",
                type: "input",
                message: "What is the new employee's last name"
            },
            {
                name: "role_id",
                type: "list",
                message: "Choose the new employee's role",
                choices: res.map(role => role.title)
            }
        ])
        .then(data => {
            const chosenRole = res.find(role => role.title === data.role_id);
            const newDepartment = res.find(role => role.department_id === data.department_id);
            const newFirstName = data.add_firstName;
            const newLastName = data.add_lastName;

            connection.query(`SELECT * FROM employees`, (err, res) => {
                if (err) {
                    throw err;
                }
                inquirer.prompt([
                    {
                        name: "manager_id",
                        type: "list",
                        message: "Select the manager of the new employee.",
                        choices: res.map(data => data.first_name)
                    }
                ])
                .then((answer) => {
                    const chosenManager = res.find(manager => manager.first_name === answer.manager_id);

                    connection.query(`INSERT INTO employees SET ?`, {
                        first_name: newFirstName,
                        last_name: newLastName,
                        role_id: chosenRole.id,
                        manager_id: chosenManager.id,
                        salary_id: chosenRole.id,
                        department_id: newDepartment.id
                    },
                        function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log("You added " + newFirstName + " " + newLastName + "!")
                        init();  
                    });
                });
            });
        });
    });
};

// update employee role
function updateEmployeeRole() {
    connection.query(`SELECT * FROM employees`, (err, res) => {
        if (err) {
            throw err;
        }
        inquirer.prompt([
            {
                name: "employee_update",
                type: "list",
                message: "Which employee do you want to update?",
                choices: res.map(employee => employee.first_name)
            }
        ])
        .then((data) => {
            const updateEmployee = (data.employee_update.id);
            connection.query(`SELECT * FROM roles`, (err, res) => {
                if (err) {
                    throw err;
                }
                inquirer.prompt([
                    {
                        name: "role_id",
                        type: "list",
                        message: "What do you want the employee's new role to be?",
                        choices: res.map(role => role.title)
                    }
                ])
                .then((data) => {
                    const chosenRole = res.find(role => role.title === data.role_id);
                    const params = [chosenRole.id, updateEmployee.first_name]

                    connection.query(`UPDATE employees SET role_id = ? WHERE first_name = ?`), params, (err, result) => {
                        if (err) {
                            throw err;
                        }
                        console.log("You updated " + updateEmployee + "'s role to " + result.role_id)
                        init();
                    }
                });
            });
        });
    });
};