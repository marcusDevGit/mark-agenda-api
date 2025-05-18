import PlanService from '../services/plans.service.js';

const findAll = async (req, res) => {
    try {
        const plans = await PlanService.findAll();
        res.status(200).json(plans);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const findById = async (req, res) => {
    try {
        const plan = await PlanService.findById(req.params.id);
        res.status(200).json(plan);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const subscribe = async (req, res) => {
    try {
        const subscription = await PlanService.subscribe(req.params.id, req.user.id);
        res.status(201).json(subscription);
    } catch (error) {
        console.log(error);
        if (
            error.message === "Você já possui uma assinatura ativa" ||
            error.message === "Plano não encontrado"
        ) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const subscription = await PlanService.cancelSubscription(req.params.id, req.user.id);
        res.status(200).json(subscription);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

export default {
    findAll,
    findById,
    subscribe,
    cancelSubscription
}
