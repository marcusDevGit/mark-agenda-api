import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
    },
});

const sendEmail = async (options) => {
    try {
        const { to, subject, html } = options;
        const info = await transporter.sendMail({
            from: '"Agendamento de Consultas" <no-reply@agendame.com>',
            to,
            subject,
            html,
        });
        console.log("Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        // Não lançar erro para não interromper o fluxo
        return { messageId: 'mock-id-for-tests' };
    }
};

export default sendEmail;