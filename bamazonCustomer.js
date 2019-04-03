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

    
  })
};

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
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "item_Id",
        pageSize: 10,
        message: "Which product would you like to buy? Please choose from the list of Ids below:",
        choices: function () {
          var productArray = [];
          for (var j=0; j < products.length; j++) {
            productArray.push("#"+products[j].item_id+" "+products[j].product_name);
          }
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
      var itemChosen = answer.item_Id.split("");
      itemChosen = itemChosen[1].toString()+itemChosen[2].toString();
      itemChosen = itemChosen.toString().trim();
      var amountRequested = answer.amountBuy;
      check(itemChosen,amountRequested);
    })
  })
};

function check(itemChosen,amountRequested) {
  connection.query("SELECT * FROM products WHERE item_id=?",[itemChosen],function(err,products){
    if (err) throw err;
    var inStock = (products[0].stock_quantity);
    if (inStock >= amountRequested) {
      var total = products[0].price * amountRequested;
      console.log("Thank you for choosing Glamazon! The total price of your purchase is $"+total+".");
      connection.end();
    } else {
      console.log("Insuffucient Quantity! Please pick another item, wait for the item to come back in stock or purchase less of that item.");
      displayItems();
    }
  })
};
