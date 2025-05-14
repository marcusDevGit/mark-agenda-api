import express from 'express';
import Appointmentscontroller from '../controllers/appointments.controller.js';
const router = express.Router();

router.post('/', Appointmentscontroller.create);
router.get('/user/:userId', Appointmentscontroller.findByUser);
router.delete('/:id', Appointmentscontroller.remove);

export default router;
