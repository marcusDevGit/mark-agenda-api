import express from 'express';
import cors from 'cors';
import appointmentsRouter from './routes/appointments.route.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/', express.static('public'));

//rota de ageendamento
app.use('/api/routes/appointments', appointmentsRouter);
//rota de usuário
app.use("/api/routes/user", userRouter);


export default app;
