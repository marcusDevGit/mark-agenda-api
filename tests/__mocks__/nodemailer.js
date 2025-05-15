export const createTransport = jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({
        messageId: 'mocked-message-id'
    })
}));
