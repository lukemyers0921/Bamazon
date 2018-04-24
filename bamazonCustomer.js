var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    customerPrompt();
});

function customerPrompt() {
    // query the database for all items in store
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(`${results[i].id} | PRODUCT: ${results[i].product_name} | DEPARTMENT: ${results[i].department_name} | PRICE: $${results[i].price} | STOCK: ${results[i].stock_quanity}`);
                        }
                        return choiceArray;
                    },
                    message: "What product would you like to buy?"
                },
                {
                    name: "quanity",
                    type: "input",
                    message: "How many units would you like to buy?"
                }
            ])
            .then(function (answer) {
                var sliceStart = /[ |]/g;
                var sliceNum = answer.choice.search(sliceStart);
                var idTest = answer.choice.slice(0, sliceNum);
                var idTest = parseInt(idTest);

                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === idTest) {
                        var chosenItem = results[i];
                    }
                }
                if (chosenItem.stock_quanity > parseInt(answer.quanity)) {
                    totalPrice = chosenItem.price * answer.quanity;
                    quanityUpdate = chosenItem.stock_quanity - answer.quanity;
                    connection.query(
                        "UPDATE products SET stock_quanity = ? WHERE product_name = ?", [quanityUpdate, chosenItem.product_name],
                        function (error) {
                            if (error) throw err;
                            console.log(`Your order of ${answer.quanity} ${chosenItem.product_name}(s) for ${totalPrice} was successful.`);
                        }
                    );
                }
                else {
                    console.log("Your order was unsuccessful due to insufficent stock.");
                }
                connection.end();
            });
    })
}