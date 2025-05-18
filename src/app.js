import express from 'express';
import cors from 'cors';
import appointmentsRouter from './routes/appointments.route.js';
import userRouter from './routes/user.routes.js';
import teamsRouter from './routes/teams.route.js';
import plansRouter from './routes/plans.route.js';


const app = express();

app.use(cors());
app.use(express.json());


//rota de ageendamento
app.use('/api/routes/appointments', appointmentsRouter);
//rota de usuário
app.use("/api/routes/user", userRouter);
app.use("/api/routes/teams", teamsRouter);
app.use("/api/routes/plans", plansRouter);


export default app;
