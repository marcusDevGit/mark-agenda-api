
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

const create = async (data) => {
    return await prisma.appointment.create({
        data: {
            date: new Date(data.date),
            notes: data.notes,
            user: {
                connect: {
                    id: data.userId
                },
            },
            service: {
                connect: {
                    id: data.serviceId
                },
            },
        },
    })
};

const findByUser = async (userId) => {
    return await prisma.appointment.findMany({
        where: {
            userId: parseInt(userId),
        },
        include: {
            service: true,
        }
    })
}


const remove = async (id) => {
    return await prisma.appointment.delete({ where: { id: parseInt(id) } });
};

export default {
    create,
    findByUser,
    remove
}
