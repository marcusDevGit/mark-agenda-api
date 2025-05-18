import { PrismaClient } from "../generated/prisma/client.js";
import EventEmitter, { SUBSCRIPTION_CREATED, SUBSCRIPTION_CANCELED } from "../events/events.js";

const prisma = new PrismaClient();

const findAll = async () => {
    return await prisma.plan.findMany({
        include: {
            features: true
        }
    });
};

const findById = async (id) => {
    const plan = await prisma.plan.findUnique({
        where: { id: parseInt(id) },
        include: { features: true }
    });

    if (!plan) {
        throw new Error("Plan não encontrado");
    }
    return plan;
};

const subscribe = async (planId, userId) => {
    // verifica se o plano existe
    const plan = await prisma.plan.findUnique({
        where: { id: parseInt(planId) }
    });

    if (!plan) {
        throw new Error("Plano não encontrado");
    }

    //verifica se o usario ja tem assinatura ativa
    const activeSubscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: "ACTIVE"
        }
    });
    if (activeSubscription) {
        throw new Error("Você já possui uma assinatura ativa");
    }

    //calcular a data de termino da assinatura
    const startDate = new Date();
    const endDate = new Date();

    if (plan.interval === 'MONTHLY') {
        endDate.setMonth(endDate.getMonth() + 1);
    } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }

    //criar a assinatura
    const subscription = await prisma.subscription.create({
        data: {
            user: { 
                connect: { id: userId }
            },
            plan: {
                connect: { id: parseInt(planId) }
            },
            startDate,
            endDate,
            status: 'ACTIVE'
        },
        include: {
            plan: {
                include: {
                    features: true
                }
            }
        }
    });

    //emitir evento de assinatura criada
    EventEmitter.emit(SUBSCRIPTION_CREATED, subscription);

    return subscription;
};

const cancelSubscription = async (subscriptionId, userId) => {
    //verifica se a assinatura existe
    const subscription = await prisma.subscription.findUnique({
        where: { id: parseInt(subscriptionId) }
    });

    if (!subscription) {
        throw new Error("Assinatura não encontrada");
    }

    //verifica se a assinatura pertence ao usario
    if (subscription.userId !== userId) {
        throw new Error("Você não tem permissão para cancelar esta assinatura");

    }
    //verifica se a assinatura ja esta cancelada
    if (subscription.status !== 'ACTIVE') {
        throw new Error("Esta assinatura ja esta canelada ou expirada");
    }

    //cancelar assinatura
    const updatedSubscription = await prisma.subscription.update({
        where: { id: parseInt(subscriptionId) },
        data: { status: 'CANCELED' },
        include: {
            plan: {
                include: { features: true }
            }
        }
    });

    //emitir evento de assinatura cancelada
    EventEmitter.emit(SUBSCRIPTION_CANCELED, updatedSubscription);

    return updatedSubscription;
};

export default {
    findAll,
    findById,
    subscribe,
    cancelSubscription
}
