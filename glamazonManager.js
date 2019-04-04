var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : '1245690',
  database : 'glamazon'
});

connection.connect(function(err){
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  menu();
});

function menu() {
  inquirer.prompt([
    {
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit and End Session"]
    }
  ]).then(function(response) {
    switch (response.options) {
      case "View Products for Sale":
        console.log("Option 1: "+response.options);
        displayItems();
        break;
      case "View Low Inventory":
        console.log("Option 2: "+response.options);
        lowInventory();
        break;
      case "Add to Inventory":
        console.log("Option 3: "+response.options);
        addInventory();
        break;
      case "Add New Product":
        console.log("Option 4: "+response.options);
        newProduct();
        break;
      case "Exit and End Session":
        console.log("Option 5: "+response.options);
        connection.end();
        break;
    }
  })
}

function displayItems() {
  connection.query('SELECT * FROM `products`', function (error, results, fields) {
    if (error) throw error;
    prettyResults(results);
    menu();
  })
};

function prettyResults(results) {
  var table = new Table({
    head: ['ID', 'Product Name','Department', 'Price', 'In Stock']
  , colWidths: [5, 40, 20, 15, 10]
  });

  for (var i=0; i < results.length; i++) {
    table.push(
      [results[i].item_id, 
      results[i].product_name, 
      results[i].department_name, 
      `$${results[i].price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
        }) }`, 
      results[i].stock_quantity]
    );
  }
  console.log(table.toString());
};

function lowInventory() {
  connection.query('SELECT * FROM `products` WHERE stock_quantity <= 5', function (error, results) {
    if (error) throw error;
    prettyResults(results);
    menu();
  })
}

function addInventory() {
  connection.query("SELECT item_id,product_name,stock_quantity FROM products",function(err,res) {
    if (err) throw err;
    // PUTTING THE MINIMUM FIELDS INTO A PRETTY TABLE START //
    var table = new Table({
      head: ['ID', 'Product Name', 'In Stock']
    , colWidths: [5, 40, 10]
    });
  
    for (var i=0; i < res.length; i++) {
      table.push(
        [res[i].item_id, 
        res[i].product_name,
        res[i].stock_quantity]
      );
    }
  
    console.log(table.toString());
    // PUTTING THE MINIMUM FIELDS INTO A PRETTY TABLE END //
    inquirer.prompt([
      {
        name: "item_id",
        message: "Which item would you like to restock/add more to?",
        type: "list",
        choices: function () {
          var productArray = [];
          for (var j=0; j < res.length; j++) {
            productArray.push("#"+res[j].item_id+" "+res[j].product_name);
          }
          return productArray;
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "How much would you like to add?",
        validate: function(value) {
          if(isNaN(value) === false) {
            return true;
          } else {
          return false;
          }
        }
      }
    ]).then(function(answer) {
      var itemChosen = answer.item_id.split("");
      itemChosen = itemChosen[1].toString()+itemChosen[2].toString();
      itemChosen = itemChosen.toString().trim();
      var newQuantity = parseInt(answer.quantity) + res[(itemChosen-1)].stock_quantity;
      connection.query('UPDATE `products` SET stock_quantity=? WHERE item_id=?',[newQuantity,itemChosen], function (error) {
        if (error) throw error;
        console.log(answer.quantity+" "+res[(itemChosen-1)].product_name+"s have been added to item id "+itemChosen+"!");
        menu();
      })
    })
  })
};

function newProduct() {
  inquirer.prompt([
    {
      
    }
  ])
  console.log("Inserting a new product...\n");
  connection.query(
    `INSERT INTO products SET ?`,
    {
      product_name: ,
      department_name: ,
      price: ,
      stock_quantity: 
    },
    function(err, res) {
      console.log("New product successfully inserted!\n");
    }
  )
};