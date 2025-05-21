import dotenv from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { exec } from 'child_process';
import { promisify } from 'util';

// Carregar variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Definir timeout global para testes
if (typeof jest !== 'undefined') {
    jest.setTimeout(30000);
}

// Função para verificar se o banco de dados existe e criá-lo se necessário
const setupTestDatabase = async () => {
    try {
        // Verificar se o banco de dados existe
        const prisma = new PrismaClient();
        await prisma.$connect();

        console.log('Banco de dados de teste conectado com sucesso');
        await prisma.$disconnect();
    } catch (error) {
        if (error.message.includes('does not exist')) {
            console.log('Banco de dados de teste não existe. Criando...');

            // Extrair informações de conexão da URL do banco de dados
            const dbUrl = process.env.DATABASE_URL;
            const matches = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);

            if (!matches) {
                throw new Error('Formato de URL de banco de dados inválido');
            }

            const [, user, password, host, port, dbName] = matches;

            // Criar o banco de dados
            const execAsync = promisify(exec);
            await execAsync(
                `PGPASSWORD=${password} createdb -h ${host} -p ${port} -U ${user} ${dbName}`
            );

            console.log(`Banco de dados ${dbName} criado com sucesso`);

            // Executar migrações
            const prisma = new PrismaClient();
            await prisma.$connect();
            await prisma.$executeRawUnsafe('SELECT 1');
            await prisma.$disconnect();

            console.log('Migrações aplicadas com sucesso');
        } else {
            console.error('Erro ao conectar ao banco de dados de teste:', error);
            throw error;
        }
    }
};

// Executar setup do banco de dados antes dos testes
setupTestDatabase().catch(error => {
    console.error('Falha ao configurar banco de dados de teste:', error);
    process.exit(1);
});
