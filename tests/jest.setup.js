import dotenv from 'dotenv';

// Carregar variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Definir timeout global para testes
if (typeof jest !== 'undefined') {
    jest.setTimeout(30000);
}
