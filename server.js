const inquirer = require('inquirer');
const mysql = require('mysql2');


// Using .env to hide my detils
require('dotenv').config()
const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: 'employeetracker_db'
  },
);

db.connect((err) => {
  if (err) {
    throw error;
  }
});

// Listing user options 

Options()

function Options() {

  return inquirer.prompt([
    {
      type: "list",
      name: "Options",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Delete Employee",]
    }
  ])

    .then((answers) => {
      if (answers.Options === "View All Departments") {
        viewDepartments();
      }
      if (answers.Options === "View All Roles") {
        viewRoles();
      }
      if (answers.Options === "View All Employees") {
        viewEmployees();
      }
      if (answers.Options === "Add Department") {
        addDepartment();
      }
      if (answers.Options === "Add Role") {
        addRole();
      }
      if (answers.Options === "Add Employee") {
        addEmployee();
      }
      if (answers.Options === "Update Employee Role") {
        updateEmployee();
      }
      if (answers.Options === "Delete Employee") {
        deleteEmployee();
      }
    })
};

// Vewing table functions 

function viewDepartments() {
  db.query('SELECT * FROM employeetracker_db.department;', function (err, results) {
    console.table(results);
    Options();
  });

};

function viewEmployees() {

  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id', function (err, results) {
    console.table(results);
    Options();

  })
};

function viewRoles() {
  db.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;", function (err, results) {
    console.table(results);
    if (err) {
      console.log(err);
    };
    Options();
  })
};

function addDepartment() {
  return inquirer.prompt([
    {
      type: "input",
      name: "departmentname",
      message: "What is the name of the new department?"
    },

  ])
    .then(function (answer) {
      db.query("INSERT INTO department (name) VALUES (?)", [answer.departmentname], function (err, results) {
      })
      Options();
    })
};


function addRole() {
  db.query('SELECT * FROM employeetracker_db.department;', function (err, results) {
    let departmentArray = [];
    results.forEach(result => departmentArray.push({ name: result.name, value: result.id }));
    return inquirer.prompt([
      {
        type: "input",
        name: "rolename",
        message: "What is the name of the new role?"
      },
      {
        type: "input",
        name: "rolesalary",
        message: "What is the salary of the new role?"
      },
      {
        type: "list",
        name: "roledepartment",
        message: "What department is the new role in?",
        choices: departmentArray
      },

    ])
      .then((answers) => {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answers.rolename, answers.rolesalary, answers.roledepartment], function (err, results) {
          console.log(err);
        })
        Options();
      })
  })
};

function addEmployee() {
  db.query('SELECT * FROM employeetracker_db.role;', function (err, results) {
    let roleArray = [];
    results.forEach(result => roleArray.push({ name: result.title, value: result.id }));
    return inquirer.prompt([
      {
        type: "input",
        name: "employeeFirstname",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "employeeLastname",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "employeeRole",
        message: "What is the employee's role?",
        choices: roleArray
      },
    ])
      .then((answers) => {
        let newFirstName = answers.employeeFirstname;
        let newLastName = answers.employeeLastname;
        let newEmployeeRole = answers.employeeRole;
        db.query('SELECT * FROM employeetracker_db.employee;', function (err, results) {
          let employeeNameArray = [];
          results.forEach(result => employeeNameArray.push({ name: result.first_name + ' ' + result.last_name, value: result.id }));

          return inquirer.prompt([
            {
              type: "list",
              name: "employeemanager",
              message: "Who is the employee's manager?",
              choices: employeeNameArray
            },
          ])
            .then((answers) => {
              let managerOptions = answers.employeemanager;
              db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [newFirstName, newLastName, newEmployeeRole, managerOptions], function (err, results) {
                console.log(err);
              })
              Options();
            })
        })
      })
  })
};



function updateEmployee() {
  db.query('SELECT * FROM employeetracker_db.employee;', function (err, results) {
    let employeeNames = [];
    results.forEach(result => employeeNames.push({ name: result.first_name + ' ' + result.last_name, value: result.id }));
    return inquirer.prompt([
      {
        type: "list",
        name: "updatedEmployee",
        message: "Which employee would you like to update?",
        choices: employeeNames
      },

    ])
      .then((answer) => {
        let employee = answer.updatedEmployee;
        db.query('SELECT * FROM employeetracker_db.role;', function (err, results) {
          let roles = [];
          results.forEach(result => roles.push({ name: result.title, value: result.id }));

          return inquirer.prompt([
            {
              type: "list",
              name: "updatedRole",
              message: "What is the employee's new role?",
              choices: roles
            },
          ])
            .then((answer) => {
              let newrole = answer.updatedRole;
              db.query('UPDATE employeetracker_db.employee SET role_id = ? WHERE id = ?', [newrole, employee], function (err, results) {
                Options();
              })
            })
        })
      })
  })
};

function deleteEmployee() {
  db.query('SELECT * FROM employeetracker_db.employee;', (err, res) => {
    if (err) throw err;

    const chosenEmployee = [];
    res.forEach(({ first_name, last_name, id }) => {
      chosenEmployee.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    let firedEmployee = [{
      type: "list",
      name: "id",
      choices: chosenEmployee,
      message: "Which employee is being deleted?"
    }]
    inquirer.prompt(firedEmployee)
      .then(response => {
        const query = `DELETE FROM EMPLOYEE WHERE id = ?`;
        db.query(query, [response.id], (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} row(s) succesfully deleted!`);
          Options();
        });
      })
      .catch(err => {
        console.log(err);
      })
  });
}