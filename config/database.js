import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, // ad esempio: "mysql-tuo-servizio"
  user: process.env.DB_USER, // definito al momento della creazione del DB su Render
  password: process.env.DB_PASSWORD, // come configurato su Render
  database: process.env.DB_NAME, // il nome del database
});

export default pool;
