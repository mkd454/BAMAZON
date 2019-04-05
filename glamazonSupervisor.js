var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1245690',
  database: 'glamazon'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  departmentPopulate();
  menu();
});

function menu() {
  inquirer.prompt([
    {
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department", "Exit and End Session"]
    }
  ]).then(function (response) {
    switch (response.options) {
      case "View Product Sales by Department":
        console.log("Option 1: " + response.options);
        displaySales();
        break;
      case "Create New Department":
        console.log("Option 2: " + response.options);
        addDepartment();
        break;
      case "Exit and End Session":
        console.log("Option 5: " + response.options);
        connection.end();
        break;
    }
  })
}

function departmentPopulate() {
  connection.query(
    `SELECT department_name FROM products`, function (error, results) {
      if (error) throw error;
      var depNames = [];
      for (i in results) {
        depNames.push(results[i].department_name);
      }
      depNames = depNames.sort();
      var unique = depNames.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      })
    }
  )
}

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// function displaySales() {
//   connection.query(
//     `SELECT departments.department_id, products_department_name
//     FROM Customers
//     FULL OUTER JOIN Orders 
//     ON Customers.CustomerID=Orders.CustomerID
//     ORDER BY Customers.CustomerName;`)
// }