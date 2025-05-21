// server.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Crea un pool di connessioni utilizzando i dati del database
const pool = mysql.createPool({
  host: process.env.DB_HOST, // ad esempio: "mysql-tuo-servizio"
  user: process.env.DB_USER, // definito al momento della creazione del DB su Render
  password: process.env.DB_PASSWORD, // come configurato su Render
  database: process.env.DB_NAME, // il nome del database
});

try {
  const [result] = await pool.query(
    "SELECT Therapists.name AS therapist_name, Therapists.surname AS therapist_surname, Patients.name AS patient_name, Patients.surname AS patient_surname, Therapists.id AS therapist_id FROM Therapists INNER JOIN Patients WHERE Patients.therapist_id = Therapists.id;"
  );
  console.log(result);
} catch (error) {
  console.error("Errore durante la query:", error);
}

// Un esempio di endpoint per recuperare dati
// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3000;

// app.get("/api/data", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM Patients");
//     res.json(rows);
//   } catch (error) {
//     console.error("Errore durante la query:", error);
//     res.status(500).send("Errore del server");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server in ascolto su http://localhost:${port}`);
// });
