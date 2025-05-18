import express from 'express';
import PlansController from '../controllers/plans.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

// Rotas públicas
router.get('/', PlansController.findAll);
router.get('/:id', PlansController.findById);

// Rotas que requerem autenticação
router.use(authMiddleware);
router.post('/:id/subscribe', PlansController.subscribe);
router.post('/subscriptions/:id/cancel', PlansController.cancelSubscription);

export default router;
