import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase, seedTestData } from './setup.js';
import prisma from './setup.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Mock simples sem usar jest.fn()
const mockSendMail = () => Promise.resolve({ messageId: 'test-message-id' });

const mockTransporter = {
  sendMail: mockSendMail
};

nodemailer.createTransport = () => mockTransporter;

describe('Appointments API', () => {
  let testUser;
  let testService;
  let authToken;
  let testAppointment;
  
  beforeAll(async () => {
    await clearDatabase();
    
    // Criar dados de teste
    const testData = await seedTestData();
    testService = testData.service;
    
    // Criar um usuário para testes
    testUser = await prisma.user.create({
      data: {
        name: 'Teste Usuario',
        email: 'teste@example.com',
        password: await bcrypt.hash('senha123', 5)
      }
    });
    
    // Gerar token de autenticação
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET || 'your_j', { expiresIn: '1h' });
  });
  
  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });
  
  describe('Criação de agendamentos', () => {
    it('deve criar um agendamento com sucesso', async () => {
      const appointmentData = {
        userId: testUser.id,
        serviceId: testService.id,
        date: new Date(Date.now() + 86400000).toISOString(), // Amanhã
        notes: 'Teste de agendamento'
      };
      
      const response = await request(app)
        .post('/api/routes/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(testUser.id);
      expect(response.body.serviceId).toBe(testService.id);
      expect(response.body).toHaveProperty('date');
      expect(response.body.notes).toBe(appointmentData.notes);
      
      testAppointment = response.body;
    });
  });
  
  describe('Busca de agendamentos', () => {
    it('deve buscar agendamentos de um usuário', async () => {
      const response = await request(app)
        .get(`/api/routes/appointments/user/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].userId).toBe(testUser.id);
      expect(response.body[0].service).toHaveProperty('name');
    });
    
    it('deve retornar array vazio para usuário sem agendamentos', async () => {
      // Criar outro usuário sem agendamentos
      const anotherUser = await prisma.user.create({
        data: {
          name: 'Outro Usuario',
          email: 'outro@example.com',
          password: await bcrypt.hash('senha123', 5)
        }
      });
      
      const anotherToken = jwt.sign({ id: anotherUser.id }, process.env.JWT_SECRET || 'your_j', { expiresIn: '1h' });
      
      const response = await request(app)
        .get(`/api/routes/appointments/user/${anotherUser.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });
  
  describe('Remoção de agendamentos', () => {
    it('deve remover um agendamento com sucesso', async () => {
      await request(app)
        .delete(`/api/routes/appointments/${testAppointment.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
      
      // Verificar se o agendamento foi removido
      const appointment = await prisma.appointment.findUnique({
        where: { id: testAppointment.id }
      });
      
      expect(appointment).toBeNull();
    });
    
    it('deve retornar erro ao tentar remover agendamento inexistente', async () => {
      await request(app)
        .delete(`/api/routes/appointments/9999`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);
    });
  });
});