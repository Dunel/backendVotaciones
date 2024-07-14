import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import loginRoutes from "./src/routes/login.routes.js";
import electionRoutes from "./src/routes/election.routes.js";
import candidateRoutes from "./src/routes/candidate.route.js";
import voteRoutes from "./src/routes/vote.routes.js";
import verifyRoutes from "./src/routes/verify-token.routes.js";
import venezuelaRoutes from "./src/routes/venezuela.routes.js"
import logsRoutes from "./src/routes/log.routes.js"
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "https://node.appcorezulia.lat",
        "https://node.appcorezulia.lat:30000",
        "http://localhost:3000",
        "http://localhost",
        "http://localhost:30000"
      ];
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by cors"));
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.disable("x-powered-by");

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    //error json
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
  console.error(err);
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

// Middleware para registrar solicitudes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/election", electionRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/verify-token", verifyRoutes);
app.use("/api/venezuela", venezuelaRoutes);
app.use("/api/logs", logsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
