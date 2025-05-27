// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import patientRouter from "./routes/patientRoutes.js";
import therapistRouter from "./routes/therapistRoutes.js";
import authRouter from "./routes/authRoutes.js";
import errorHandler from "./utils/ErrorHandler.js";
// import routes from "./routes/routes.js";
dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [process.env.ONLINE_HOST];

const corsOptions = {
  origin: function (origin, callback) {
    // Se non è definito l'origin, ad es. in chiamate da strumento come Postman, viene accettato
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      // L'origin è consentito
      return callback(null, true);
    } else {
      // L'origin non è consentito
      return callback(new Error("Origin not allowed by CORS policy"), false);
    }
  },
  // Aggiungi eventuali altre opzioni qui, ad esempio methods, credentials, ecc.
};
app.use(cors(corsOptions)); // applichi cors a tutte le rotte

app.use("/patient", patientRouter);
app.use("/therapist", therapistRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Beep bop." });
});

app.use(errorHandler);

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
