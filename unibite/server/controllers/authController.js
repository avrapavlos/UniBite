import db from "../database/connection.js";


// Login Function
export function login(req, res) {

    // Get the request body
    const { email, password } = req.body;


    // If empty return error
    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required"
        });

    }


    //Create query
    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
        AND password = ?
    `;


    // Run query 
    db.query(sql, [email, password], (err, results) => {


        if (err) {

            console.error(err);

            return res.status(500).json({
                message:"Database error"
            });

        }


        if(results.length === 0){

            return res.status(401).json({
                message:"Invalid credentials"
            });

        }


        const user = results[0];


        res.json({

            success:true,

            user:{
                id:user.id,
                username:user.username,
                name:user.name,
                points:user.points
            }

        });

    });

}