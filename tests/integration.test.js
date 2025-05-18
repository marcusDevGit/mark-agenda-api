import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase, seedTestData } from './setup.js';
import prisma from './setup.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Mock simples sem usar jest.fn()
const mockSendMail = () => Promise.resolve({
    messageId: 'test-message-id'
});

const mockTransporter = {
    sendMail: mockSendMail,
    close: () => { }
};

nodemailer.createTransport = () => mockTransporter;

describe('Fluxo completo de usuário e agendamentos', () => {
    let testUser;
    let testService;
    let authToken;
    let appointmentId;
    let teamId;
    let planId

    beforeAll(async () => {
        await clearDatabase();

        // Criar dados de teste
        const testData = await seedTestData();
        testService = testData.service;
    });

    afterAll(async () => {
        await clearDatabase();
        await prisma.$disconnect();
    });

    it('deve registrar um novo usuário', async () => {
        const userData = {
            name: 'Usuário Integração',
            email: 'integracao@example.com',
            password: 'senha123'
        };

        const response = await request(app)
            .post('/api/routes/user/register')
            .send(userData)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(userData.name);
        expect(response.body.email).toBe(userData.email);

        testUser = response.body;
    });

    it('deve fazer login com o usuário criado', async () => {
        const loginData = {
            email: 'integracao@example.com',
            password: 'senha123'
        };

        const response = await request(app)
            .post('/api/routes/user/login')
            .send(loginData)
            .expect(200);

        expect(response.body).toHaveProperty('token');
        authToken = response.body.token;
    });
    it('deve criar um time', async () => {
        const teamData = {
            name: 'Time de Integração',
            description: 'Time para teste de integração'
        };

        const response = await request(app)
            .post('/api/routes/teams')
            .set('Authorization', `Bearer ${authToken}`)
            .send(teamData)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(teamData.name);

        teamId = response.body.id;
    });

    it('deve convidar um membro para o time', async () => {
        const inviteData = {
            email: 'convidado@example.com'
        };

        const response = await request(app)
            .post(`/api/routes/teams/${teamId}/invite`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(inviteData)
            .expect(201);

        expect(response.body).toHaveProperty('token');
        expect(response.body.email).toBe(inviteData.email);
    });

    it('deve assinar um plano', async () => {
        // Primeiro, criar um plano para teste
        const plan = await prisma.plan.create({
            data: {
                name: 'Plano Premium',
                description: 'Plano premium para testes',
                price: 29.90,
                interval: 'MONTHLY'
            }
        });

        planId = plan.id;

        const response = await request(app)
            .post(`/api/routes/plans/${planId}/subscribe`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.status).toBe('ACTIVE');
    });

    it('deve criar um agendamento para o usuário', async () => {
        const appointmentData = {
            userId: testUser.id,
            serviceId: testService.id,
            date: new Date(Date.now() + 86400000).toISOString(), // Amanhã
            notes: 'Agendamento de integração'
        };

        const response = await request(app)
            .post('/api/routes/appointments')
            .set('Authorization', `Bearer ${authToken}`)
            .send(appointmentData)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.userId).toBe(testUser.id);
        expect(response.body.serviceId).toBe(testService.id);

        appointmentId = response.body.id;
    });

    it('deve buscar os agendamentos do usuário', async () => {
        const response = await request(app)
            .get(`/api/routes/appointments/user/${testUser.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].userId).toBe(testUser.id);
        expect(response.body[0].notes).toBe('Agendamento de integração');
    });

    it('deve cancelar a assinatura do plano', async () => {
        // Buscar a assinatura atual
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: testUser.id,
                planId: planId
            }
        });

        const response = await request(app)
            .post(`/api/routes/plans/subscriptions/${subscription.id}/cancel`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.status).toBe('CANCELED');
    });

    it('deve remover o time criado', async () => {
        await request(app)
            .delete(`/api/routes/teams/${teamId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(204);
    });

    it('deve remover o agendamento do usuário', async () => {
        await request(app)
            .delete(`/api/routes/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(204);

        // Verificar se o agendamento foi removido
        const remainingAppointments = await prisma.appointment.findMany({
            where: {
                userId: testUser.id
            }
        });

        expect(remainingAppointments.length).toBe(0);
    });

    it('deve solicitar recuperação de senha', async () => {
        const emailData = {
            email: 'integracao@example.com'
        };
        // Remover qualquer token existente para evitar conflito com a restrição unique
        await prisma.passwordResetToken.deleteMany({
            where: {
                user: {
                    email: emailData.email
                }
            }
        });

        const response = await request(app)
            .post('/api/routes/user/forgot-password')
            .send(emailData)
            .expect(200);

        expect(response.body).toHaveProperty('message');
    });

    it('deve resetar a senha do usuário', async () => {
        // Obter o token de reset
        const resetTokenRecord = await prisma.passwordResetToken.findFirst({
            where: {
                user: {
                    email: 'integracao@example.com'
                }
            }
        });

        expect(resetTokenRecord).toBeTruthy();

        const resetData = {
            token: resetTokenRecord.token,
            newPassword: 'novaSenha456'
        };

        await request(app)
            .post('/api/routes/user/reset-password')
            .send(resetData)
            .expect(200);

        // Verificar se consegue fazer login com a nova senha
        const loginData = {
            email: 'integracao@example.com',
            password: 'novaSenha456'
        };

        await request(app)
            .post('/api/routes/user/login')
            .send(loginData)
            .expect(200);
    });
});
