-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the 'bamazon_db' database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect bamazon_db --
USE bamazon_db;

-- Creates the table 'products' within bamazon_db --
CREATE TABLE products (
  -- Lets sql handle the ids
  id INT NOT NULL AUTO_INCREMENT,
  -- Makes a string column called 'product_name' which cannot contain null --
  product_name VARCHAR(30) NOT NULL,
  -- Makes a sting column called 'department_name' --
  department_name VARCHAR(30),
  -- Makes an numeric column called 'price' --
  price DECIMAL(10,2),
   -- Makes an numeric column called 'stock_quanity' --
  stock_quanity INTEGER(10),
  -- Lets sql handle the ids
  PRIMARY KEY (id)
);

-- Creates new rows containing data in all product_named columns --
INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ('Sony TV', 'Electronics', 649.99, 32),
('Nintendo Switch', 'Electronics', 299.99, 0),
('Kitty Litter', 'Pets', 19.99, 7),
('Dog Treats', 'Pets', 8.99, 1),
('4 Person Tent', 'Outdoors', 42.99, 999),
('Inflatable Kayak', 'Outdoors',46.99, 12),
('Idiots Guide to SQL', 'Books', 24.99, 32),
('Eloquent Javascript', 'Books', 24.99, 2),
('Red Scarf', 'Clothing', 5.99, 4),
('Black Beanie', 'Clothing',11.99, 7);