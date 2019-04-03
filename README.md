# GLAMAZON

## Technologies Used
* Node.js
    inquirer
    mysql
    cli-table
* MySQL Workbench

## Overview

This project creates an Amazon-like storefront using MySQL and Node.js. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus, the app can track product sales across the store's departments and then provide a summary of the highest-grossing departments in the store.

## Submission Guide

* Include screenshots (or a video) of typical user flows through your application (for the customer and if relevant the manager/supervisor). This includes views of the prompts and the responses after their selection (for the different selection options).

### Submission on BCS

* Please submit the link to the Github Repository!
* Add to Portfolio.

## Instructions

### Customer View

1. Uses MySQL Database called `glamazon`.
2. Running the node.js file application will first display all of the items available for sale. 
3. The app will prompt users with two messages.
   * The first will ask the user the ID of the product they would like to buy.
   * The second message will ask how many units of the product they would like to buy.
4. Once the customer has placed the order, the application will check if it has enough of the product to meet the customer's request.
   * If not, the app will tell the customer there is not enough in stock and then prevent the order from going through.
5. However, if the store _does_ have enough of the product, the customer's order will be fulfilled.
   * The SQL database will be updated to reflect the remaining quantity.
   * Once the update goes through, the customer will be shown the total cost of their purchase.

#### Customer Example Demo
<img src='./images/customer-example.gif'><br>

### Challenge #2: Manager View (Next Level)

* Create a new Node application called `bamazonManager.js`. Running this application will:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

- - -

* If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.

- - -

### Challenge #3: Supervisor View (Final Level)

1. Create a new MySQL table called `departments`. Your table should include the following columns:

   * department_id

   * department_name

   * over_head_costs (A dummy number you set for each department)

2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

   * Make sure your app still updates the inventory listed in the `products` column.

3. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

6. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

   * Hint: You may need to look into aliases in MySQL.

   * Hint: You may need to look into GROUP BYs.

   * Hint: You may need to look into JOINS.

   * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

- - -