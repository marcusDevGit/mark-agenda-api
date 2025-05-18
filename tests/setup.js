import { PrismaClient } from '../src/generated/prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Função para limpar o banco de dados antes dos testes
export const clearDatabase = async () => {
    // Limpar tabelas relacionadas a times
    try {
        await prisma.teamInvite.deleteMany({});
        await prisma.teamMember.deleteMany({});
        await prisma.team.deleteMany({});
    } catch (error) {
        console.log('Erro ao limpar tabelas de times:', error.message);
    }

    // Limpar outras tabelas
    await prisma.appointment.deleteMany({});
    await prisma.passwordResetToken.deleteMany({});
    await prisma.subscription.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.service.deleteMany({});
};

// Função para criar dados de teste
export const seedTestData = async () => {
    // Criar um serviço para testes
    const service = await prisma.service.create({
        data: {
            name: 'Consulta Teste',
            descriptiom: 'Serviço para testes',
            duration: 60,
            price: 100.0
        }
    });

    return { service };
};

export default prisma;
