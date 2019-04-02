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
 
connection.connect();
 
connection.query('SELECT * FROM `products`', function (error, results, fields) {
  if (error) throw error;
  console.log(results);

  // instantiate
  var table = new Table({
    head: ['ID', 'Product Name','Department', 'Price', 'In Stock']
  , colWidths: [5, 40, 30, 10, 10]
  });

  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  for (var i=0; i < results.length; i++) {
    table.push(
      [results[i].item_id, results[i].product_name, results[i].department_name, `$${results[i].price}`, results[i].stock_quantity]
    );
  }

  console.log(table.toString());
});
 
connection.end();