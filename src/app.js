console.log('Arquivo app.js carregado!');
import express from 'express';
import cors from 'cors';
import appointmentsRouter from './routes/appointments.route.js';
import userRouter from './routes/user.routes.js';
import teamsRouter from './routes/teams.route.js';
import plansRouter from './routes/plans.route.js';


const app = express();

app.use(cors());
app.use(express.json());

//rota raiz
app.get('/', (req, res) => {
    res.send(`
        <h2>Bem-vindo à API Mark Agenda!</h2>
        <p>Use os seguintes endpoints para acessar as funcionalidades:</p>
        <ul>
            <li><b>POST</b> /api/routes/user/register – Registrar novo usuário</li>
            <li><b>POST</b> /api/routes/user/login – Login de usuário</li>
            <li><b>GET</b> /api/routes/user/profile – Perfil do usuário (autenticado)</li>
            <li><b>POST</b> /api/routes/user/forgot-password – Recuperação de senha</li>
            <li><b>POST</b> /api/routes/user/reset-password – Redefinir senha</li>
            <li><b>POST</b> /api/routes/appointments – Criar agendamento</li>
            <li><b>GET</b> /api/routes/appointments/user/:userId – Listar agendamentos do usuário</li>
            <li><b>DELETE</b> /api/routes/appointments/:id – Excluir agendamento</li>
            <li><b>GET</b> /api/routes/plans – Listar planos</li>
            <li><b>POST</b> /api/routes/plans/:id/subscribe – Assinar plano</li>
            <li><b>POST</b> /api/routes/plans/subscriptions/:id/cancel – Cancelar assinatura</li>
            <li><b>POST</b> /api/routes/teams – Criar time</li>
            <li><b>GET</b> /api/routes/teams – Listar times</li>
        </ul>
        <p>Consulte a documentação completa no README.md do projeto.</p>
    `)
});

//rota de ageendamento
app.use('/api/routes/appointments', appointmentsRouter);
//rota de usuário
app.use("/api/routes/user", userRouter);
app.use("/api/routes/teams", teamsRouter);
app.use("/api/routes/plans", plansRouter);


// ROTA CATCH-ALL PARA DEBUG
app.use((req, res, next) => {
    res.status(404).send('Rota não encontrada pelo Express!');
});


export default app;
