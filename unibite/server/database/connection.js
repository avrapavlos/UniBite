
// Setup connection with mysql database
const mysql = require("mysql12");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"unibite"
})

module.exports = connection;