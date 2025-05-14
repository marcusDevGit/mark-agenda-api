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

const sendEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: '"Agendamento de Consultas" <no-reply@agendame.com>',
        to,
        subject,
        html,
    });
    console.log("Email sent: %s", info.messageId);
};

export default sendEmail
