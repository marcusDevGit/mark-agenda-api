import request from "supertest";
import app from "../src/app.js"
import { clearDatabase, seedTestData } from "./setup.js"
import prisma from "./setup.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

describe('Plans API', () => {
    let testUser;
    let authToken;
    let testPlan;
    let testSubscription;

    beforeAll(async () => {
        await clearDatabase();

        //criar um usuario ´para o test
        testUser = await prisma.user.create({
            data: {
                name: 'Teste Usuario',
                email: 'teste@example.com',
                password: await bcrypt.hash('senha123', 5)
            }
        });

        //criar um plano de teste
        testPlan = await prisma.plan.create({
            data: {
                name: 'Plano de Teste',
                description: 'Descrição do Plano de Teste',
                price: 49.90,
                interval: 'MONTHLY',
                features: {
                    create: [
                        { name: 'Feature 1', description: 'Descrição da Feature 1' },
                        { name: 'Feature 2', description: 'Descrição da Feature 2' }
                    ]
                }
            }
        });

        // gerar token de autenticação
        authToken = jwt.sign({ id: testUser.id },
            process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '1h'
        });
    });

    afterAll(async () => {
        await clearDatabase();
        await prisma.$disconnect();
    });

    describe('Busca de planos', () => {
        it('deve buscar todos os planos disponieis',
            async () => {
                const response = await request(app)
                    .get('/api/routes/plans')
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
                expect(response.body[0]).toHaveProperty('name');
                expect(response.body[0]).toHaveProperty('price');
            }
        );

        it('deve buscar um plano especifico', async () => {
            const response = await request(app)
                .get(`/api/routes/plans/${testPlan.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.id).toBe(testPlan.id);
            expect(response.body.name).toBe(testPlan.name);
            expect(response.body.price).toBe(testPlan.price);
            expect(Array.isArray(response.body.features)).toBe(true);
        });
    });

    describe('Assinatura de planos', () => {
        it('deve assinar um palno com sucesso', async () => {
            const response = await request(app)
                .post(`/api/routes/plans/${testPlan.id}/subscribe`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('startDate');
            expect(response.body).toHaveProperty('endDate');
            expect(response.body).toHaveProperty('status');
            expect(response.body.status).toBe('ACTIVE');

            // Save the subscription for later tests
            testSubscription = response.body;
        });

        it('deve rejeitar assinatura de plano já assinado', async () => {
            await request(app)
                .post(`/api/routes/plans/${testPlan.id}/subscribe`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);
        });
    });

    describe('Cancelamento de assinatura', () => {
        it('deve cancelar a assinatura de um plano', async () => {
            // Skip this test if testSubscription is not defined
            if (!testSubscription || !testSubscription.id) {
                console.log('Skipping cancelation test because subscription was not created');
                return;
            }
            
            const response = await request(app)
                .post(`/api/routes/plans/subscriptions/${testSubscription.id}/cancel`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.status).toBe('CANCELED');
        });
    });
});
