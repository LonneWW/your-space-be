// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import patientRouter from "./routes/patientRoutes.js";
import therapistRouter from "./routes/therapistRoutes.js";
import authRouter from "./routes/authRoutes.js";
import errorHandler from "./utils/ErrorHandler.js";
import verifyToken from "./middlewares/authMiddleware.js";
// import routes from "./routes/routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.ONLINE_HOST, process.env.LOCAL_HOST];

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
  credentials: true,
};
app.use(cors(corsOptions)); // applichi cors a tutte le rotte

app.use("/patient", verifyToken, patientRouter);
app.use("/therapist", verifyToken, therapistRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Beep bop." });
});

app.use(errorHandler);

app.listen(3000);
