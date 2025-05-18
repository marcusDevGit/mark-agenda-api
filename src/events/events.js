// src/events/events.js
import EventEmitter from './EventEmitter.js';

// Eventos de usuário
export const USER_REGISTERED = 'user.registered';
export const USER_LOGGED_IN = 'user.logged_in';
export const PASSWORD_RESET_REQUESTED = 'password.reset.requested';
export const PASSWORD_RESET_COMPLETED = 'password.reset.completed';

// Eventos de time
export const TEAM_CREATED = 'team.created';
export const TEAM_UPDATED = 'team.updated';
export const TEAM_DELETED = 'team.deleted';
export const TEAM_MEMBER_ADDED = 'team.member.added';
export const TEAM_MEMBER_REMOVED = 'team.member.removed';
export const TEAM_INVITE_SENT = 'team.invite.sent';
export const TEAM_INVITE_ACCEPTED = 'team.invite.accepted';
export const TEAM_INVITE_REJECTED = 'team.invite.rejected';

// Eventos de assinatura
export const SUBSCRIPTION_CREATED = 'subscription.created';
export const SUBSCRIPTION_UPDATED = 'subscription.updated';
export const SUBSCRIPTION_CANCELED = 'subscription.canceled';
export const SUBSCRIPTION_EXPIRED = 'subscription.expired';

// Eventos de agendamento
export const APPOINTMENT_CREATED = 'appointment.created';
export const APPOINTMENT_UPDATED = 'appointment.updated';
export const APPOINTMENT_DELETED = 'appointment.deleted';

export default EventEmitter;
