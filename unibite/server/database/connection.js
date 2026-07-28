import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "unibite"
});

console.log("Connected to MySql database");

export default connection;