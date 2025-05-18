import { jest } from '@jest/globals';

jest.unstable_mockModule('nodemailer', () => ({
    default: {
        createTransport: () => ({
            sendMail: () => Promise.resolve({ messageId: 'test-message-id' }),
            close: () => { }
        })
    }
}));
import request from "supertest";
import app from "../src/app.js";
import { clearDatabase, seedTestData } from "./setup.js";
import prisma from "./setup.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock('nodemailer', () => {
    createTransport: () => ({
        sendMail: () => Promise.resolve({ messageId: 'test-message-id' }),
        close: () => { },
    })
});

describe("Teams API", () => {
    let testUser;
    let adminUser;
    let authToken;
    let adminToken;
    let testTeam;

    beforeAll(async () => {
        await clearDatabase();

        //criar um usuario para teste
        testUser = await prisma.user.create({
            data: {
                name: 'Teste Usuario',
                email: 'test@example.com.br',
                password: await bcrypt.hash('senha123', 5),
            }
        });

        adminUser = await prisma.user.create({
            data: {
                name: 'Admin Usuario',
                email: 'admin@example.com',
                password: await bcrypt.hash('senha123', 5),
                role: 'ADMIN'
            }
        });

        //gera token de autenticação
        authToken = jwt.sign({ id: testUser.id },
            process.env.JWT_SECRET || 'your_J', {
            expiresIn: '2h'
        });
        adminToken = jwt.sign({ id: adminUser.id },
            process.env.JWT_SECRET || 'your_J', {
            expiresIn: '2h'
        });
    });

    afterAll(async () => {
        await clearDatabase();
        await prisma.$disconnect();
    });

    describe('Criaçaõ de times', () => {
        it('deve criar um time com sucesso', async () => {
            const teamData = {
                name: 'Time de Teste',
                description: 'Descrição do time de teste'
            };

            const response = await request(app)
                .post('/api/routes/teams')
                .set('Authorization', `Bearer ${authToken}`)
                .send(teamData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(teamData.name);
            expect(response.body.description).toBe(teamData.description);

            testTeam = response.body;
        });
    });

    describe('Buscar de times', () => {
        it('deve buscar todos os times', async () => {
            const response = await request(app)
                .get('/api/routes/teams')
                .set('Authorization', `Bearer ${authToken}`)
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('deve buscar um time especifico por id', async () => {
            const response = await request(app)
                .get(`/api/routes/teams/${testTeam.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(testTeam.name);
        });
    });

    describe('Atualização de times', () => {
        it('deve atualizar um time existente com sucesso', async () => {
            const updateTeamData = {
                name: 'Time atualizado',
                description: 'Descrição atualizada'
            };

            const response = await request(app)
                .put(`/api/routes/teams/${testTeam.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateTeamData)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(updateTeamData.name);
            expect(response.body.description).toBe(updateTeamData.description);
        });
    });

    describe('Convites para times', () => {
        it('deve enviar um convite para um time', async () => {
            const inviteData = {
                email: 'convidado@example.com'
            };

            const response = await request(app)
                .post(`/api/routes/teams/${testTeam.id}/invite`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(inviteData)
                .expect(201);

            expect(response.body).toHaveProperty('id')
            expect(response.body).toHaveProperty('token')
            expect(response.body.email).toBe(inviteData.email);
        });
    });

    describe('Remoção de times', () => {
        it('deve remover um time existente com sucesso', async () => {
            await request(app)
                .delete(`/api/routes/teams/${testTeam.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204);

            //verificar se o time foi removido
            const response = await request(app)
                .get(`/api/routes/teams/${testTeam.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
