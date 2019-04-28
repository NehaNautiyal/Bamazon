var inquirer = require('inquirer');
var mysql = require('mysql');
var remainingStock;
var price;
var currentSales;
var sale;
var local = {
    ID: ""
}

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    begin();
});

function askUser() {
    // Show the user all the products
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) {
                throw err;
            }
            var productID = [];
            for (let j = 0; j < res.length; j++) {
                console.log(`${res[j].item_id} || ${res[j].product_name} || ${res[j].department_name} || ${res[j].price}`);
                productID.push(res[j].item_id);
            }

            inquirer.prompt([
                {
                    type: "list",
                    message: "What is the ID of the product you would like to buy?",
                    choices: productID,
                    name: "ID"
                },
                {
                    message: "How many would you like to buy?",
                    name: "amount",
                    validate: amount => {
                        if (!isNaN(amount)) {
                            return true;
                        }
                        console.log(`\n\nPlease enter a valid number.\n`)
                        return false;
                    }
                }
            ])
                .then(answers => {

                    local.ID = answers.ID;

                    console.log(`You chose to buy ${answers.amount} of ${res[answers.ID].product_name}.`);
                    
                    connection.query(`SELECT * FROM products WHERE ?`,
                        {
                            item_id: answers.ID,
                        },
                        (err, res) => {
                            if (err) {
                                throw err;
                            }
                            if (res[0]) {
                                var currentStock = res[0].stock_quantity;
                                currentSales = res[0].product_sales;
                                remainingStock = currentStock - parseFloat(answers.amount);
                                price = parseFloat(res[0].price);
                                sale = price * parseFloat(answers.amount)

                                if (remainingStock >= 0) {
                                    updateStock();
                                } else {
                                    console.log(`\nSorry, there's not enough stock to fulfill this order.\n`);
                                    begin();
                                }
                            } else {
                                console.log(`\nSorry, you've entered an invalid product ID.\n`);
                                begin();
                            }
                        })
                    // connection.end();
                })
                .catch(errors => {
                    if (errors) {
                        return errors.message;
                    }
                });
        });
}

function updateStock() {

    connection.query(`UPDATE products SET ? WHERE ?`,
        [
            {
                stock_quantity: remainingStock,
                product_sales: currentSales + sale
            },
            {
                item_id: local.ID,
            }
        ],
        (err, res) => {
            if (err) {
                throw err;
            }
            console.log(`\nOrder placed!\n`);
            console.log(`Your account has been charged $${sale}.\n`);
            console.log(`${res.affectedRows} product(s) updated.\n`);
            begin();
        })

}

function begin() {
    inquirer.prompt({
        type: "confirm",
        message: "Are you ready to shop?",
        name: "confirm"
    })
    .then(answers => {
        if (answers.confirm) {
            askUser();
        } else {
            connection.end();
            console.log("Come back when you are ready to shop!");
        }
    })
    .catch(errors => {
        if (answers.errors) {
            return errors.message;
        }
    });
}