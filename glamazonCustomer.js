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
  displayItems();
  askCustomer();
});


function displayItems() {
  connection.query('SELECT * FROM `products`', function (error, results, fields) {
    if (error) throw error;
    prettyResults(results);
    console.log("\n");
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

function askCustomer() {
  connection.query("SELECT * FROM products",function(err,products){
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "item_Id",
        pageSize: 15,
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
        message: "How much of this item would you like to buy?",
        validate: function(value) {
          if(isNaN(value) === false) {
            return true;
          } else {
          return false;
          }
        }
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
      console.log("\nThank you for choosing Glamazon! The total price of your purchase is $"+total.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) +".\n");
      var newStockAmount = inStock - amountRequested;
      updateData(itemChosen,newStockAmount);
      displayItems();
      connection.end();
    } else {
      console.log("\nInsuffucient Quantity! Please pick another item, wait for the item to come back in stock or purchase less of that item.");
      displayItems();
      askCustomer();
    }
  })
};

function updateData(id,num) {
  console.log("Updating product data...\n");
  connection.query(
    `UPDATE products SET ? WHERE item_id=?`,
    [{stock_quantity: num},id],
    function(err,res) {
      if (err) throw err;
      console.log(res.affectedRows + " product was updated!\n");
    }
  )
};
