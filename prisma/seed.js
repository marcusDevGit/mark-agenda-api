// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Criar planos padrão
    const basicPlan = await prisma.plan.upsert({
        where: { name: 'Plano Básico' },
        update: {},
        create: {
            name: 'Plano Básico',
            description: 'Plano básico com recursos limitados',
            price: 19.90,
            interval: 'MONTHLY',
            features: {
                create: [
                    { name: 'Até 5 agendamentos por mês', description: 'Limite mensal de agendamentos' },
                    { name: 'Acesso a 1 time', description: 'Crie e gerencie 1 time' }
                ]
            }
        }
    });

    const proPlan = await prisma.plan.upsert({
        where: { name: 'Plano Pro' },
        update: {},
        create: {
            name: 'Plano Pro',
            description: 'Plano profissional com recursos avançados',
            price: 49.90,
            interval: 'MONTHLY',
            features: {
                create: [
                    { name: 'Agendamentos ilimitados', description: 'Sem limite de agendamentos' },
                    { name: 'Até 3 times', description: 'Crie e gerencie até 3 times' },
                    { name: 'Relatórios avançados', description: 'Acesso a relatórios detalhados' }
                ]
            }
        }
    });

    // Criar serviços padrão
    const service1 = await prisma.service.upsert({
        where: { name: 'Consulta Padrão' },
        update: {},
        create: {
            name: 'Consulta Padrão',
            description: 'Consulta padrão de 30 minutos',
            duration: 30,
            price: 100.0
        }
    });

    const service2 = await prisma.service.upsert({
        where: { name: 'Consulta Estendida' },
        update: {},
        create: {
            name: 'Consulta Estendida',
            description: 'Consulta estendida de 60 minutos',
            duration: 60,
            price: 180.0
        }
    });

    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 5);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@teste.com' },
        update: {},
        create: {
            name: 'Administrador',
            email: 'admin@teste.com',
            password: adminPassword,
            role: 'ADMIN'
        }
    });

    console.log({ basicPlan, proPlan, service1, service2, admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
