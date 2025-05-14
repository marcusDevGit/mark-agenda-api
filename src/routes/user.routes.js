import express from 'express';
import UserController from '../controllers/user.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rota de registro de usuário
router.post('/register', UserController.register);
//rota de login de usuário
router.post('/login', UserController.login);
//rota de obter perfil de usuário autenticado
router.get('/profile', authenticate, UserController.getProfile);
//rota de obter usuário por id
router.get('/:id', authenticate, UserController.getUserById);
//rota de recuperação de senha
router.post('/forgot-password', UserController.forgotPassword);
//rota de redefinição de senha
router.post('/reset-password', UserController.resetPassword);

export default router;
