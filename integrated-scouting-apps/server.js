require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection function
const connectToDatabase = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
};

// API route to fetch data
app.get("/api/data", (req, res) => {
    const connection = connectToDatabase();
    
    connection.connect(err => {
        if (err) {
            console.error("Database connection error:", err);
            return res.status(500).json({ error: "Database connection failed" });
        }

        connection.query("SELECT * FROM your_table", (error, results) => {
            connection.end(); // Close connection after query execution

            if (error) {
                console.error("Query error:", error);
                return res.status(500).json({ error: "Query execution failed" });
            }
            
            res.json(results);
        });
    });
});

// Start the server
// const PORT = 5000;
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
