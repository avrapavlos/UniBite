import mysql2 from "mysql2";

const connection = mysql2.createConnection({
    host:"localhost",
    user:"user",
    password:"password",
    database:"unibite"
})

connection.connect((err) => {
    if(err) {
        console.error("Database connection failed:");
        console.error(err);
        return;
    }

    console.log("Connected to MySql database")
})

export default connection;