const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const { Pact, Matchers } = require('@pact-foundation/pact');
const axios = require('axios');
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

chai.use(chaiAsPromised);

describe('Pact', () => {
    const provider = new Pact({
        consumer: 'Consumer Example',
        provider: 'Provider Example',
        log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        logLevel: LOG_LEVEL,
        spec: 2,
    });

    const { like } = Matchers;

    const user = {
        id: 1,
        name: 'John Doe',
        accountNumber: '1234567890',
        balance: 5000.00,
    };


    const userBodyExpectation = {
        id: like(1),
        name: like('John Doe'),
        accountNumber: like('1234567890'),
        balance: like(5000.00),
    };

    before(() =>
        provider.setup().then((opts) => {
            process.env.API_HOST = `http://127.0.0.1:${opts.port}`;
        })
    );

    afterEach(() => provider.verify());

    const {
        getAllUsers,
        getUserById,
        transferMoney,
    } = require('../consumer');

    describe('when a call to list all users from the Banking User Service is made', () => {
        describe('and the user is not authenticated', () => {
            before(() =>
                provider.addInteraction({
                    state: 'is not authenticated',
                    uponReceiving: 'a request for all users',
                    withRequest: {
                        method: 'GET',
                        path: '/users',
                    },
                    willRespondWith: {
                        status: 401,
                    },
                })
            );

            it('returns a 401 unauthorized', async () => {

                await expect(
                    axios.get(`${process.env.API_HOST}/users`)
                ).to.be.rejectedWith('Request failed with status code 401');
            });
        });

        describe('and the user is authenticated', () => {
            describe('and there are users in the database', () => {
                before(() =>
                    provider.addInteraction({
                        state: 'Has some users',
                        uponReceiving: 'a request for all users',
                        withRequest: {
                            method: 'GET',
                            path: '/users',
                            headers: {
                                Authorization: like('Bearer token'),
                            },
                        },
                        willRespondWith: {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                            },
                            body: [userBodyExpectation],
                        },
                    })
                );
            });
        });
    });


    after(() => {
        return provider.finalize();
    });
});
