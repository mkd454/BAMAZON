var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : '1245690',
  database : 'bamazon'
});
 
connection.connect(function(err){
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayItems();
});


function displayItems() {
  connection.query('SELECT * FROM `products`', function (error, results, fields) {
    if (error) throw error;
    prettyResults(results);
    askCustomer();

    // connection.end();
  })
}

function prettyResults(results) {
  var table = new Table({
    head: ['ID', 'Product Name','Department', 'Price', 'In Stock']
  , colWidths: [5, 40, 30, 10, 10]
  });

  for (var i=0; i < results.length; i++) {
    table.push(
      [results[i].item_id, 
      results[i].product_name, 
      results[i].department_name, 
      `$${results[i].price}`, 
      results[i].stock_quantity]
    );
  }

  console.log(table.toString());
};

function askCustomer() {
  connection.query("SELECT * FROM products",function(err,products){
    console.log("This is item one:" +products[0].item_id);
    if (err) throw err;
    inquirer.prompt([
      {
        type: "rawlist",
        name: "item_Id",
        message: "Which product would you like to buy? Please choose from the list of Ids below:",
        choices: function () {
          var productArray = [];
          for (var j=0; j < products.length; j++) {
            productArray.push(products[j].item_id);
          }
          console.log(productArray);
          return productArray;
        }
      },
      {
        type: "input",
        name: "amountBuy",
        message: "How much of this item would you like to buy?"
      }
    ])
    .then(function(answer) {
      console.log(answer);
    })
  })
}

