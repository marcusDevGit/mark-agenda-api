import { PrismaClient } from "../generated/prisma/client.js";
import crypto from "crypto";
import EventEmitter, { TEAM_CREATED, TEAM_INVITE_SENT } from "../events/events.js";
import Queue from "../queue/Queue.js";
import TeamInviteJob from "../queue/jobs/TeamInviteJobs.js";

const prisma = new PrismaClient();

const create = async (data, userId) => {
    const team = await prisma.team.create({
        data: {
            name: data.name,
            description: data.description,
            owner: {
                connect: {
                    id: userId
                }
            },
            members: {
                create: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    role: "OWNER"
                }
            }
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });
    //emit event de criação de time
    EventEmitter.emit(TEAM_CREATED, team);
    return team;
};

const findAll = async (userId) => {
    return await prisma.team.findMany({
        where: {
            members: {
                some: {
                    userId
                }
            }
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

};

const findById = async (id, userId) => {
    const team = await prisma.team.findUnique({
        where: { id: parseInt(id) },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
            invites: true
        }
    });
    if (!team) {
        throw new Error("Time não encontrado");
    }
    //verifica se o usuário é membro do time
    const isMember = team.members.some(member => member.userId === userId);
    if (!isMember) {
        throw new Error("Você não tem permissão para acessar este time");
    }
    return team;
};

const update = async (id, data, userId) => {
    const team = await prisma.team.findUnique({
        where: { id: parseInt(id) },
        include: { members: true }
    });
    if (!team) {
        throw new Error("Time não encontrado");
    }

    //verifica se o usuario e dono ou admin do time
    const member = team.members.find(member => member.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
        throw new Error("Você não tem permissão para editar este time");
    }

    return await prisma.team.update({
        where: { id: parseInt(id) },
        data: {
            name: data.name,
            description: data.description
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });
};

const remove = async (id, userId) => {
    const team = await prisma.team.findUnique({
        where: { id: parseInt(id) },
        include: { members: true }
    });
    if (!team) {
        throw new Error("Time não encontrado");
    }

    //verifica se o usuario e dono ou admin do time
    const isOwner = team.members.some(member => member.userId === userId && member.role === 'OWNER');
    if (!isOwner) {
        throw new Error("Você não tem permissão para excluir este time");
    }

    //excluir membros e convites primeiro
    await prisma.teamMember.deleteMany({
        where: {
            teamId: parseInt(id)
        }
    });

    await prisma.teamInvite.deleteMany({
        where: {
            teamId: parseInt(id)
        }
    });
    //excluir time
    return await prisma.team.delete({
        where: { id: parseInt(id) }
    });
};

const invite = async (id, email, userId) => {
    const team = await prisma.team.findUnique({
        where: { id: parseInt(id) },
        include: { members: true }
    });
    if (!team) {
        throw new Error("Time não encontrado");
    }

    //verifica se o usuario e dono ou admin do time
    const member = team.members.find(member => member.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
        throw new Error("Você não tem permissão para convidar membros a este time");
    }

    //verifica se o usuario já é membro do time
    const existinfInvite = await prisma.teamInvite.findFirst({
        where: {
            teamId: parseInt(id),
            email,
            status: "PENDING"
        }
    });

    if (existinfInvite) {
        throw new Error("Este email já foi convidado para este time");
    }

    //verifica se o usuario já é membro do time
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        const existingMember = await prisma.teamMember.findFirst({
            where: {
                teamId: parseInt(id),
                userId: existingUser.id
            }
        });
        if (existingMember) {
            throw new Error("Este usuário já é membro deste time");
        }
    }
    //cria um token de convite
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getDate() + 7); // 7 dias

    const invite = await prisma.teamInvite.create({
        data: {
            team: {
                connect: {
                    id: parseInt(id)
                }
            },
            email,
            token,
            expiresAt
        }
    });

    //emitir evento de convite
    EventEmitter.emit(TEAM_INVITE_SENT, invite);

    //adicionar job para enviar o convite
    Queue.add(new TeamInviteJob(invite.id));

    return invite;
};

const acceptInvite = async (token, userId) => {
    const invite = await prisma.teamInvite.findUnique({
        where: { token },
    });

    if (!invite) {
        throw new Error("Convite não encontrado");
    }
    if (invite.status !== "PENDING") {
        throw new Error("Convite já foi aceito");
    }
    if (invite.expiresAt < new Date()) {
        await prisma.teamInvite.update({
            where: { id: invite.id },
            data: {
                status: "EXPIRED"
            }
        });
        throw new Error("Convite expirado");
    }

    //verrifica se o email do convite corresponde ao email do usuario
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (user.email !== invite.email) {
        throw new Error("Este convite não é para você");
    }

    //verificar se o usuario já é membro do time
    const existingMember = await prisma.teamMember.findFirst({
        where: {
            teamId: invite.teamId,
            userId
        }
    });
    if (existingMember) {
        await prisma.teamInvite.update({
            where: { id: invite.id },
            data: {
                status: "ACCEPTED"
            }
        });
        throw new Error("Você já é membro deste time");
    }

    //adicionar o usuario ao time
    const member = await prisma.teamMember.create({
        data: {
            team: { connect: { id: invite.teamId } },
            user: { connect: { id: userId } },
            role: "MEMBER"
        },
        include: {
            team: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    //atualizar o status do convite
    await prisma.teamInvite.update({
        where: { id: invite.id },
        data: {
            status: "ACCEPTED"
        }
    });

    return member;
};

const rejectInvite = async (token) => {
    const invite = await prisma.teamInvite.findUnique({
        where: { token },
    });
    if (!invite) {
        throw new Error("Convite não encontrado");
    }

    if (invite.status !== "PENDING") {
        throw new Error("Convite já foi utilizado");
    }

    //atualizar o status do convite
    return await prisma.teamInvite.update({
        where: { id: invite.id },
        data: {
            status: "REJECTED"
        }
    });

};

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

