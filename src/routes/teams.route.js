import express from 'express';
import TeamsController from '../controllers/teams.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

//rotas de times requerem autenticação
router.use(authMiddleware);

router.post('/', TeamsController.create);
router.get('/', TeamsController.findAll);
router.get('/:id', TeamsController.findById);
router.put('/:id', TeamsController.update);
router.delete('/:id', TeamsController.remove);
router.post('/:id/invite', TeamsController.invite);
router.post('/invite/accept', TeamsController.acceptInvite);
router.post('/invite/reject', TeamsController.rejectInvite);

export default router;
