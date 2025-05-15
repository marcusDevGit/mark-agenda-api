import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase, seedTestData } from './setup.js';
import prisma from './setup.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock manual do nodemailer
import nodemailer from 'nodemailer';

// Mock simples sem usar jest.fn()
const mockSendMail = () => Promise.resolve({ messageId: 'test-message-id' });

const mockTransporter = {
    sendMail: mockSendMail
};

nodemailer.createTransport = () => mockTransporter;

describe('User API', () => {
    let testUser;

    beforeAll(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await clearDatabase();
        await prisma.$disconnect();
    });

    describe('Registro de usuário', () => {
        it('deve criar um novo usuário com sucesso', async () => {
            const userData = {
                name: 'Teste Usuario',
                email: 'teste@example.com',
                password: 'senha123'
            };

            const response = await request(app)
                .post('/api/routes/user/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
            expect(response.body).not.toHaveProperty('password');

            testUser = response.body;
        });

        it('deve rejeitar registro com email já existente', async () => {
            const userData = {
                name: 'Outro Usuario',
                email: 'teste@example.com', // mesmo email do teste anterior
                password: 'outrasenha123'
            };

            await request(app)
                .post('/api/routes/user/register')
                .send(userData)
                .expect(400);
        });
    });

    describe('Login de usuário', () => {
        it('deve fazer login com sucesso e retornar token', async () => {
            const loginData = {
                email: 'teste@example.com',
                password: 'senha123'
            };

            const response = await request(app)
                .post('/api/routes/user/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty('token');

            // Verificar se o token é válido
            const token = response.body.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_j');
            expect(decoded).toHaveProperty('id');
        });

        it('deve rejeitar login com credenciais inválidas', async () => {
            const loginData = {
                email: 'teste@example.com',
                password: 'senhaerrada'
            };

            await request(app)
                .post('/api/routes/user/login')
                .send(loginData)
                .expect(401);
        });
    });

    describe('Recuperação de senha', () => {
        it('deve enviar email de recuperação de senha', async () => {
            const emailData = {
                email: 'teste@example.com'
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

            // Verificar se o token foi criado no banco
            const resetToken = await prisma.passwordResetToken.findFirst({
                where: {
                    user: {
                        email: emailData.email
                    }
                }
            });

            expect(resetToken).toBeTruthy();
            expect(resetToken).toHaveProperty('token');
        });

        it('deve rejeitar recuperação para email não cadastrado', async () => {
            const emailData = {
                email: 'naoexiste@example.com'
            };

            await request(app)
                .post('/api/routes/user/forgot-password')
                .send(emailData)
                .expect(400);
        });
    });

    describe('Reset de senha', () => {
        it('deve resetar a senha com sucesso', async () => {
            // Obter o token de reset gerado no teste anterior
            const tokenRecord = await prisma.passwordResetToken.findFirst({
                where: {
                    user: {
                        email: 'teste@example.com'
                    }
                }
            });

            if (!tokenRecord) {
                console.log('Token não encontrado, pulando teste');
                return;
            }

            const resetData = {
                token: tokenRecord.token,
                newPassword: 'novaSenha123'
            };

            const response = await request(app)
                .post('/api/routes/user/reset-password')
                .send(resetData)
                .expect(200);

            expect(response.body).toHaveProperty('message');

            // Verificar se a senha foi alterada tentando fazer login
            const loginData = {
                email: 'teste@example.com',
                password: 'novaSenha123'
            };

            await request(app)
                .post('/api/routes/user/login')
                .send(loginData)
                .expect(200);
        });

        it('deve rejeitar reset com token inválido', async () => {
            const resetData = {
                token: 'token-invalido',
                newPassword: 'outraSenha123'
            };

            await request(app)
                .post('/api/routes/user/reset-password')
                .send(resetData)
                .expect(400);
        });
    });
});