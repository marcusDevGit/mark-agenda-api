import EmailJob from "./EmailJob.js";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

class TeamInviteJob {
    constructor(inviteId) {
        this.inviteId = inviteId;
        this.retries = 0;
        this.maxRetries = 3;
    }

    async execute() {
        const invite = await prisma.teamInvite.findUnique({
            where: { id: this.inviteId },
            include: {
                team: true,
            }
        });
        if (!invite) {
            throw new Error(`Invite with ID ${this.inviteId} not found`);
        }

        //enviar convite email
        const emailJob = new EmailJob({
            to: invite.email,
            subject: `Convite para participar do time ${invite.team.name}`,
            html: `<h1>Você foi convidado para participar do time ${invite.team.name}</h1>
                <p>Clique no link abaixo para aceitar o convite:</p>
                <a href="http://localhost:3000/invite/accept?token=${invite.token}">Aceitar convite</a>
                `
        });
        return await emailJob.execute();
    }
}
export default TeamInviteJob;
