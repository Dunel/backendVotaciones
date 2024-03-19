import express from 'express';
import userRoutes from './api/user/user.routes.js';
import loginRoutes from './api/login/login.routes.js';
import electionRoutes from './api/election/election.routes.js';
import candidateRoutes from './api/candidate/candidate.route.js';
import voteRoutes from './api/vote/vote.routes.js';
import verifyRoutes from './api/verify-token/verify-token.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
