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
  newDepartmentCheck();
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

var currentDepartments = [ 'Apparel','Art Supplies','Beauty','Electronics','Food','Jewelry','Travel Gear','Music' ]

function newDepartmentCheck() {
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
      // console.log(unique);
      for (var h = 0; h < unique.length; h++) {
        if (currentDepartments.indexOf(unique[h]) < 0) {
          inquirer.prompt({
            name: "newDep",
            type: "list",
            message: `New department '${unique[h]}' detected. Would you like to add this to your list for a more accurate report?`,
            choices: ["YES","NO"]
          }).then(function(res){
            if (res.newDep === "YES") {
              addDepartment();
            } else {
              console.log("Alright, but know that your report isn't very accurate...");
              menu();
            }
          })
        }
      }
      menu();
    }
  )
}

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

function displaySales() {
  connection.query(
    `SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales, p.product_sales-d.over_head_costs AS total_sales 
    FROM departments as d, products as p 
    WHERE d.department_name = p.department_name
    GROUP BY d.department_name
    ORDER BY d.department_id;`,function(err,res){
      if (err) throw err;
      prettyResults(res);
      menu();
    })
}

function prettyResults(results) {
  var table = new Table({
    head: ['ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'], 
    colWidths: [5, 25, 20, 20, 20]
  });

  for (var i=0; i < results.length; i++) {
    table.push(
      [results[i].department_id, 
      results[i].department_name, 
      `$${results[i].over_head_costs.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
      }) }`,
      `$${results[i].product_sales.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
      }) }`,
      `$${results[i].total_sales.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
      }) }`,]
    );
  }

  console.log(table.toString());
};

function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      name: "question1",
      message: "What is the name of the new department?"
    },
    {
      type: "input",
      name: "question2",
      message: "What is the overhead cost for this department?",
      validate: function(num) {
        if(isNaN(num) === false) {
          return true;
        } else {
        return false;
        }
      }
    }
  ]).then(function(answer) {
    console.log("Inserting a new department...\n");
    currentDepartments.push(answer.question1);
    connection.query(
      `INSERT INTO departments (department_name,over_head_costs)
        VALUES ("${answer.question1}","${answer.question2}");`,
      function(err, res) {
        if (err) throw err;
        console.log("New department successfully inserted!\n");
        menu();
      }
    )
  })
}