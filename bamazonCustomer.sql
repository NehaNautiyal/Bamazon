create database bamazon;

use bamazon;

create table products(
item_id int not null auto_increment,
product_name varchar(100) not null,
department_name varchar(100) not null,
price decimal(10,2) not null,
stock_quantity int not null,
product_sales decimal(10,2) not null,
primary key(item_id)
);

insert into products(product_name, department_name, price, stock_quantity, product_sales)
values ("slime", "toys", 2.00, 6, 0),
("play-doh", "toys", 0.50, 20, 0),
("water bottle", "dishes", 3.00, 5, 0),
("watch", "jewlery", 19.99, 2, 0),
("puzzles", "toys", 2.50, 3, 0),
("spoons", "dishes", 0.10, 30, 0),
("bracelet", "jewlery", 3.50, 3, 0),
("laptop", "electronics", 3.50, 3, 0),
("ipad", "electronics", 3.50, 3, 0),
("stroller", "baby stuff", 3.50, 3, 0);