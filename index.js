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