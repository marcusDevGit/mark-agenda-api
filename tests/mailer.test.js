import sendEmail from '../src/utils/mailer.js';
import nodemailer from 'nodemailer';

// Mock simples sem usar jest.fn()
const mockSendMail = () => Promise.resolve({ messageId: 'test-message-id' });

const mockTransporter = {
    sendMail: mockSendMail,
    close: () => { }
};

nodemailer.createTransport = () => mockTransporter;

describe('Mailer Service', () => {
    it('deve enviar email corretamente', async () => {
        const emailData = {
            to: 'destinatario@example.com',
            subject: 'Teste de Email',
            html: '<p>Conteúdo do email de teste</p>'
        };

        const result = await sendEmail(emailData);

        expect(result).toHaveProperty('messageId');
    });
    afterAll(() => {
        const transporter = nodemailer.createTransport();
        if (typeof transporter.close === 'function') {
            transporter.close();
        }
    });
});
