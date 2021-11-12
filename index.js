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
                selectEmp();
                break;
              case "exit":
                connection.end();
                break;
        }
    });
};

function viewDepartments() {
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) {
            throw error;
        }
        console.table(res);
        init();
    });
};

function viewRoles() {
    connection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) {
            throw error;
        }
        console.table(res);
        init();
    }); 
};

function viewEmployees() {
    connection.query(`SELECT * FROM employees`, (err, res) => {
        if (err) {
            throw error;
        }
        console.table(res);
        init();
    }); 
};

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
                message: "Which department would you like to add them to?",
                choices: res.map(department => department.name)
            }
        ]).then(data => {
            const chosenDepartment = res.find(department => department.name === data.department_id)

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