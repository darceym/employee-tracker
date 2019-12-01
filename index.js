const inquirer = require("inquirer");
const mysql = require("mysql");

const insertDepartment = name => {
    
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Department name?"
        }
    ]).then(answers => {
        insertDepartment(answers.name);
    })
    console.log("Adding Dept");
};
const addRole = () => {
    console.log("Adding Role");
};
const addEmployee = () => {
    console.log("Adding Employee");
};

inquirer.prompt([
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "Add Department",
            "Add Role",
            "Add Employee"
        ]
    }
]).then(answers => {
    switch (answers.action) {
        case "Add Department":
            addDepartment();
            break;
        case "Add Role":
            addRole();
            break;
        case "Add Employee":
            addEmployee();
            break;
        default:
            console.log("Exiting...")
    }
})