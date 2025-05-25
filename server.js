// server.js
import dotenv from "dotenv";
import express from "express";
import patientRouter from "./routes/patientRoutes.js";
import therapistRouter from "./routes/therapistRoutes.js";
// import routes from "./routes/routes.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/patient", patientRouter);
app.use("/therapist", therapistRouter);

app.get("/", (req, res) => {
  console.log("qui");
});

app.listen(3000);

//Prepared statement + JSON
// let query = `INSERT INTO Patient_Notes (patient_id, id, content, shared, tags, date)
//   VALUES (?, ?, ?, ?, ?, ?)`;
// const content = [
//   {
//     insert: "Voglio fare le foto alle fate",
//   },
//   {
//     attributes: {
//       header: 1,
//     },
//     insert: "\n",
//   },
//   {
//     insert: "IO ",
//   },
//   {
//     attributes: {
//       underline: true,
//     },
//     insert: "voglio",
//   },
//   {
//     insert: " fare le ",
//   },
//   {
//     attributes: {
//       bold: true,
//     },
//     insert: "foto",
//   },
//   {
//     insert: " alle ",
//   },
//   {
//     attributes: {
//       italic: true,
//     },
//     insert: "fate!",
//   },
//   {
//     insert: "\n",
//   },
// ];
// const tags = JSON.stringify({ tags: ["autostima"] });

// const params = [5, null, content, 1, tags, "2025-05-22 12:43:55"];

// let [result] = await pool.execute(query, params);

// try {
//   const [result] = await pool.query(
//     "SELECT Therapists.name AS therapist_name, Therapists.surname AS therapist_surname, Patients.name AS patient_name, Patients.surname AS patient_surname, Therapists.id AS therapist_id FROM Therapists INNER JOIN Patients WHERE Patients.therapist_id = Therapists.id;"
//   );
//   console.log(result);
// } catch (error) {
//   console.error("Errore durante la query:", error);
// }

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
