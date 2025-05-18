import { PrismaClient } from '../src/generated/prisma/client.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

// Função para limpar o banco de dados antes dos testes
export const clearDatabase = async () => {
    // Limpar tabelas relacionadas a times
    try {
        // Verificar se as tabelas existem antes de tentar excluir
        const tableExists = async (tableName) => {
            try {
                await prisma.$queryRaw`SELECT 1 FROM information_schema.tables WHERE table_name = ${tableName}`;
                return true;
            } catch (error) {
                return false;
            }
        };

        // Limpar apenas se as tabelas existirem
        if (await tableExists('TeamInvite')) {
            await prisma.teamInvite.deleteMany({});
        }
        if (await tableExists('TeamMember')) {
            await prisma.teamMember.deleteMany({});
        }
        if (await tableExists('Team')) {
            await prisma.team.deleteMany({});
        }
        if (await tableExists('Subscription')) {
            await prisma.subscription.deleteMany({});
        }
        if (await tableExists('PlanFeature')) {
            await prisma.planFeature.deleteMany({});
        }
        if (await tableExists('Plan')) {
            await prisma.plan.deleteMany({});
        }
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
