import TeamsService from '../services/teams.service.js';

const create = async (req, res) => {
    try {
        const team = await TeamsService.create(req.body, req.user.id);
        res.status(201).json(team);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

const findAll = async (req, res) => {
    try {
        const teams = await TeamsService.findAll(req.user.id);
        res.status(200).json(teams);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const findById = async (req, res) => {
    try {
        const team = await TeamsService.findById(req.params.id, req.user.id);
        res.status(200).json(team);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const team = await TeamsService.update(req.params.id, req.body, req.user.id);
        res.status(200).json(team);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await TeamsService.remove(req.params.id, req.user.id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const invite = async (req, res) => {
    try {
        const invite = await TeamsService.invite(req.params.id, req.body.email, req.user.id);
        res.status(201).json(invite);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const acceptInvite = async (req, res) => {
    try {
        const member = await TeamsService.acceptInvite(req.body.token, req.user.id);
        res.status(200).json(member);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const rejectInvite = async (req, res) => {
    try {
        await TeamsService.rejectInvite(req.body.token);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}
export default {
    create,
    findAll,
    findById,
    update,
    remove,
    invite,
    acceptInvite,
    rejectInvite
};
