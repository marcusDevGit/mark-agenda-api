import UserService from '../services/user.service.js';

const register = async (req, res) => {
    try {
        const user = await UserService.register(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { token, user } = await UserService.login(req.body);
        res.status(200).json({
            token,
            user
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await UserService.getProfile(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById();
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    console.log('Body recebio', req.body);
    try {
        const { email } = req.body;
        await UserService.forgotPassword(email);
        res.status(200).json({ message: 'Email de recuperação enviado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await UserService.resetPassword(token, newPassword);
        res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default {
    register,
    login,
    getProfile,
    getUserById,
    forgotPassword,
    resetPassword,

};
