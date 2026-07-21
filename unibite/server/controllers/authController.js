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
                message: "Database error"
            });

        }


        if (results.length === 0) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }


        const user = results[0];


        res.json({

            success: true,

            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                points: user.points,
                portions_given: user.portions_given,
                portions_received: user.portions_received,
                profile_pic: user.profile_pic,
                latitude: user.latitude,
                longitude: user.longitude
            }

        });

    });

}

//Register function
export function register(req, res) {
    // Get the request body
    const { name, email, password } = req.body;

    // There is check in frontend but to make sure
    // If no name
    if (!name) {
        return res.status(400).json({
            message: "Name is required!"
        })
    } else if (!email) {
        return res.status(400).json({
            message: "Email is required!"
        })
    } else if (!password) {
        return res.status(400).json({
            message: "Password is required!"
        })
    }

    //Query to check if already in system
    const check_duplicate_query = `
        SELECT *
        FROM users
        WHERE name = ?
        OR email = ?
    `;

    //Run check
    db.query(check_duplicate_query, [name, email], (err, results) => {
        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });

        }

        // Check that nothing was matched
        if (results.length === 0) {
            // If nohting matched insert to db
            const insert_user_query = `
                INSERT INTO users (username, email, password, name, points)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insert_user_query,
                [name, email, password, name, 50],
                (err, results) => {

                    // If database error
                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            message: "Could not create user"
                        });

                    }


                    // Create user
                    return res.status(201).json({

                        success: true,

                        message: "User created successfully",

                        user: {

                            id: results.insertId,

                            username: name,

                            name: name,

                            email: email,

                            points: 50,

                            portions_given: 0,

                            portions_received: 0,

                            profile_pic: null,

                            latitude: null,

                            longitude: null

                        }

                    });
                }
            )

        }
        else {
            return res.status(400).json({
                message: "Email Or Name already used!"
            });
        }
    })

    //If query passed without errors

}