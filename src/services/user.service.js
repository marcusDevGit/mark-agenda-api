import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/mailer.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_j'

const register = async ({ name, email, password }) => {
    const existing = await prisma.user.findUnique({
        where: { email },
    });
    if (existing) {
        throw new Error("Email já cadastrado");
    };

    const hashedPassword = await bcrypt.hash(password, 5);

    return await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
};
const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Email ou senha inválidos");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Email ou senha inválidos");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '5h' });

    return token;
};

const getProfile = async () => {
    return await prisma.user.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
};
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
    if (!user) throw new Error("Usuário não encontrado");
    return user;

};

const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) throw new Error("Email não encontrado");

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordResetToken.upsert({
        where: { userId: user.id },
        update: { token, expires },
        create: {
            token,
            expires
        },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await sendEmail({
        to: email,
        subject: "Redefinição de senha",
        html: `<p>Clique no link para redefinir sua senha: <a href="${resetLink}".>${resetLink}</a></p>`
    });
};
const resetPassword = async (token, newPassword) => {
    const reset = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!reset || reset.expires < new Date()) {
        throw new Error("Token inválido ou expirado");
    }
    const hashed = await bcrypt.hash(newPassword, 5);
    await prisma.user.update({
        where: { id: reset.userId },
        data: { password: hashed },
    });
    await prisma.passwordResetToken.delete({ where: { token } });
}



export default {
    register,
    login,
    getProfile,
    getUserById,
    forgotPassword,
    resetPassword,
};
