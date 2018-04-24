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
    managerPrompt();
});

function managerPrompt() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt({
            type: 'rawlist',
            name: 'from',
            message: 'Enter a option',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory','Add New Product']
        })
          .then(function(answers) {
              if(answers.from.trim().toUpperCase() === "VIEW PRODUCTS FOR SALE") {
                  viewProducts(results);
              } else if(answers.from.trim().toUpperCase() === "VIEW LOW INVENTORY"){
                lowInventory();
              } else if(answers.from.trim().toUpperCase() === "ADD TO INVENTORY"){
                addInventory();
            } else if(answers.from.trim().toUpperCase() === "ADD NEW PRODUCT"){
                newProduct();
            } else {
                console.log("Have a nice day!")
                
            }
            })
          });
}
function viewProducts(results){
    for (var i = 0; i < results.length; i++) {
        console.log(results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | " + results[i].stock_quanity);
        }
    connection.end();
}
function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quanity <= 5", function(err,results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log(results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | " + results[i].stock_quanity);
            }
    });
    connection.end();
}

function addInventory(results){
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
                    message: "What product would you like to restock?"
                },
                {
                    name: "quanity",
                    type: "input",
                    message: "How many units would you like to restock?"
                }
            ])
            .then(function (answer) {
                var sliceStart = /[ |]/g;
                var sliceNum = answer.choice.search(sliceStart);
                var idTest = answer.choice.slice(0, sliceNum);
                var idTest = parseInt(idTest);

                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === idTest) {
                        chosenItem = results[i];
                    }
                }
                var quanityUpdate = chosenItem.stock_quanity + parseInt(answer.quanity);
                parseInt(quanityUpdate);
                    connection.query("UPDATE products SET stock_quanity = ? WHERE product_name = ?", [quanityUpdate, chosenItem.product_name],
                            console.log(`Added ${answer.quanity} to ${chosenItem.product_name} stock inventory.`)
                        
                    );
                connection.end();
            });
    })
}

function newProduct(results){
    inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      type: "input",
      message: "Product name?",
      name: "product_name"
    },
    {
        type: "input",
        message: "Department?",
        name: "department_name"
      },
      {
        type: "input",
        message: "Price?",
        name: "price"
      },
      {
        type: "input",
        message: "Stock quanity?",
        name: "stock_quanity"
      },
    
  ])
  .then(function(a) {
    connection.query("INSERT INTO products(product_name,department_name,price,stock_quanity) VALUES(?,?,?,?)",[a.product_name,a.department_name,a.price,a.stock_quanity],
    console.log(`${a.product_name} added to product list.`)
  )
  connection.end();
  });
};