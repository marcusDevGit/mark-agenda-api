import e from 'express';
import AppointmentsService from '../services/appointments.service.js';

const create = async (req, res) => {
    try {
        const appointment = await AppointmentsService.create(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating appointment' });
    }
}

const findByUser = async (req, res) => {
    try {
        const appointments = await AppointmentsService.findByUser(req.params.userId);
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
}

const remove = async (req, res) => {
    try {
        await AppointmentsService.remove(req.params.id);
        res.status(204).json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting appointment' });
    }
}

export default {
    create,
    findByUser,
    remove
}
