const inquirer = require("inquirer");
const mysql = require("mysql");


const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Department name?"
        }
    ]).then(answers => {
        connection.query("INSERT INTO departments (name) VALUES (?)", [answers.name], (err, rows) => {
            if (err) throw err;
            console.log(`Added ${answers.name} to departments.`);
            mainMenu();
        });
    })
    console.log("Adding Dept");
};

const addRole = () => {
    connection.query("SELECT * FROM departments", (err, rows) => {
      if (err) throw err;              
    
      inquirer.prompt ([
        {
            type: "input",
            message: "Title?", 
            name: "title" 
        },
        {
            type: "input",
            message: "Salary?",  
            name: "salary"
        },
        {
            type: "list",
            message: "Department?", 
            name: "department", 
            choices: function() {
                return rows.map(row =>{
                    return { name: row.name, value: row.id, short: row.name };
                })
            }
        }
    ]).then(answers => {
        connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", 
        [answers.title, answers.salary, answers.department], (err, data) => {
            if (err) throw err;
            mainMenu();
        });
    }); 
  });
};

const addEmployee = () => {
    console.log("Adding Employee");
};

const mainMenu = () => {
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
    });
};


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) throw err;

    mainMenu();
});
