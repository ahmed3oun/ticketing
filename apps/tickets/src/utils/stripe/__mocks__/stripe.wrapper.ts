const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({
            id: 'ch_1234567890',
            amount: 2000,
            currency: 'usd',
            status: 'succeeded',
        }),
        list: jest.fn().mockResolvedValue({
            data: [{
                id: 'ch_1234567890',
                amount: 2000,
                currency: 'usd',
                status: 'succeeded',
            }],
        }),
    },
}

export default stripe;