DROP DATABASE IF EXISTS glamazon;
CREATE DATABASE glamazon;

USE glamazon;

CREATE TABLE products (
	item_id INT(10) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
    price DEC(8,2),
    stock_quantity INT(10),
    product_sales INT(10) Default 0
);

CREATE TABLE departments (
	department_id INT NOT NULL,
    department_name VARCHAR(60) NOT NULL,
    over_head_costs INT DEFAULT 0
);

# Mock products
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Bose Headphones","Electronics",349.99,9),
	("Humidifier","Beauty",11.46,36),
    ("Gourmet Dark Chocolate","Food",13.39,60),
    ("GoPro","Electronics",194.99,15),
    ("Canon PowerShot G7 X Mark II (Black)","Electronics",649.00,51),
    ("Sewing Needles","Art Supplies",6.15,109),
    ("Socks","Apparel",1.00,200),
    ("Sweater Vest","Apparel",34.87,43),
    ("Engagement Ring","Jewelry",1999.99,2),
    ("Spinner Luggage","Travel Gear",49.99,6);
    
SELECT * FROM departments;
