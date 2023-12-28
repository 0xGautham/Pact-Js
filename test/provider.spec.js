const { Verifier } = require('@pact-foundation/pact');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { server, importData, bankRepository } = require('../provider');
const path = require('path');
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

chai.use(chaiAsPromised);

describe('Pact Verification', () => {
    let token = 'Bearer token';
    let serverInstance;

    before(() => {
        serverInstance = server.listen(7071, () => {
            importData(bankRepository);
            console.log('Banking User Service listening on http://localhost:7071');
        });
    });

    it('validates the expectations of Consumer Example', function (done) {

        this.timeout(10000);

        const opts = {
            provider: 'Provider Service',
            logLevel: LOG_LEVEL,
            providerBaseUrl: 'http://localhost:7071',
            providerVersion: '1.0.0',
            providerVersionBranch: 'test',
            pactUrls: [path.resolve(process.cwd(), 'pacts', 'Consumer Example-Provider Example.json')],

            consumerVersionSelectors: [{
                latest: true,
            }],
            stateHandlers: {

                'Has some users': () => {
                    const user1 = {
                        accountNumber: '1234567890',
                        balance: 5000,
                        id: 1,
                        name: 'John Doe',
                    };
                    bankRepository.insert(user1);
                    return Promise.resolve(`Users added to the db: ${JSON.stringify([user1])}`);
                },
            },
        };

        new Verifier(opts)
            .verifyProvider()
            .then(() => {
                console.log('Pact verification successful');
                done();
            })
            .catch((error) => {
                console.error('Pact verification failed:', error);
                done(error);
            });



    });

    after(() => {

        serverInstance.close();
    });
});
