const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Chattrix Backend Running");
});

app.post("/api/users/register", (req, res) => {

    const { uid, username, email, phone } = req.body;
    db.query(
        "SELECT * FROM users WHERE firebase_uid = ?",
        [uid],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (rows.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "User already exists"
                });
            }


            const sql = `
        INSERT INTO users
        (firebase_uid, username, email, phone)
        VALUES (?, ?, ?, ?)
    `;

            db.query(
                sql,
                [uid, username, email, phone],
                (err, result) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "User saved to database"
                    });
                }
            );
        });
});
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    db.connect((err) => {
        if (err) {
            console.log("Database connection failed");
            console.log(err);
            return;
        }

        console.log("MySQL Connected");
    });

    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });