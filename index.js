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

        inquirer.prompt([
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
                choices: function () {
                    return rows.map(row => {
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
    connection.query("SELECT * FROM roles", (err, roles) => {
        if (err) throw err;
        connection.query(" SELECT * FROM employees", (err, emloyees) => {

            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    message: "First name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "Last name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "Role?",
                    name: "roleId",
                    choices: function () {
                        return roles.map(role => {
                            return { name: role.title, value: role.id, short: role.title };
                        });
                    }
                },
                {
                    type: "list",
                    message: "Manager",
                    name: "managerId",
                    choices: function () {
                        return employees.map(emp => {
                            return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id, short: emp.last_name };
                        });
                    }
                }
            ]).then(answers => {
                connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
                    [answers.firstName, answers.lastName, answers.roleId, answers.managerId],
                    (err, results) => {
                        if (err) throw err;
                        mainMenu();
                    }
                );
            });
        });
    });

};

const viewEmployees = () => {
    connection.query(`SELECT emp.first_name, emp.last_name, r.title AS role_title, CONCAT (mgr.first_name, " " mgr.last_name) AS managers_name
     FROM employees AS emp
     LEFT JOIN roles AS r ON emp.role_id = r.id
     LEFT JOIN employees AS mgr ON emp.manager_id = mgr.id
     LEFT JOIN departments AS d ON r.department_id = d.id`,
        (err, results) => {
            console.table(results);

            mainMenu();
        });
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
                "Add Employee",
                "View Employees"
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
            case "View Employees":
                viewEmployees();
                break;
            default:
                console.log("Exiting...")
                connection.end();
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
