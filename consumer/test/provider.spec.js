// const { Verifier } = require('@pact-foundation/pact');
// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// const { server, importData, bankRepository } = require('../../provider/provider');
// const path = require('path');
// const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

// chai.use(chaiAsPromised);

// describe('Pact Verification', () => {
//     let token = 'Bearer token';
//     let serverInstance;

//     before(() => {
//         serverInstance = server.listen(7071, () => {
//             importData(bankRepository);
//             console.log('Banking User Service listening on http://localhost:7071');
//         });
//     });

//     it('validates the expectations of Consumer Example', function (done) {

//         this.timeout(10000);

//         const opts = {
//             provider: 'Provider Service',
//             logLevel: LOG_LEVEL,
//             providerBaseUrl: 'http://localhost:7071',
//             providerVersion: '1.0.0',
//             providerVersionBranch: 'test',
//             // pactUrls: [path.resolve(process.cwd(), 'pacts', 'BankingConsumer-BankingProvider.json')],
//             pactBrokerUrl: "http://127.0.0.1:8000",
//             pactBrokerUsername: "pact_workshop",
//             pactBrokerPassword: "pact_workshop",
//             consumerVersionSelectors: [{
//                 latest: true,
//             }],
//             stateHandlers: {
//                 'Has some users': () => {
//                     const user1 = {
//                         accountNumber: '1234567890',
//                         balance: 5000,
//                         id: 1,
//                         name: 'John Doe',
//                     };
//                     bankRepository.insert(user1);
//                     return Promise.resolve(`Users added to the db: ${JSON.stringify([user1])}`);
//                 },
//             },
//         };
//         requestFilter: (req, res, next) => {
//             if (!req.headers["authorization"]) {
//                 next();
//                 return;
//             }
//             req.headers["authorization"] = `Bearer ${new Date().toISOString()}`;
//             next();
//         };

//         if (process.env.CI || process.env.PACT_PUBLISH_RESULTS) {
//             Object.assign(opts, {
//                 publishVerificationResult: true,
//             });
//         }

//         new Verifier(opts)
//             .verifyProvider()
//             .then(() => {
//                 console.log('Pact verification successful');
//                 done();
//             })
//             .catch((error) => {
//                 console.error('Pact verification failed:', error);
//                 done(error);
//             });
//     });

//     after(() => {
//         serverInstance.close();
//     });
// });


const { Verifier } = require('@pact-foundation/pact');
const { server, importData, bankRepository } = require('../../provider/provider'); // Adjust the path accordingly
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

describe('Pact Verification', () => {
    let serverInstance;

    before(() => {
        serverInstance = server.listen(7071, () => {
            importData();
            console.log('Banking User Service listening on http://localhost:7071');
        });
    });

    after(() => {
        serverInstance.close();
    });

    it('validates the expectations of Consumer Example', function (done) {
        this.timeout(10000);

        const opts = {
            provider: 'BankingProvider',
            logLevel: LOG_LEVEL,
            providerBaseUrl: 'http://localhost:7071',
            providerVersion: '1.0.0',
            providerVersionBranch: 'test',
            pactBrokerUrl: 'http://127.0.0.1:8000',
            pactBrokerUsername: 'pact_workshop',
            pactBrokerPassword: 'pact_workshop',
            publishVerificationResult: process.env.CI === 'true' || process.env.PACT_BROKER_PUBLISH_VERIFICATION_RESULTS === 'true',
            // pactUrls: [/* Array of pact file URLs if needed */],
            consumerVersionSelectors: [{
                latest: true,
            }],
            stateHandlers: {
                'Has some users': () => {
                    const user1 = {
                        id: 1,
                        name: 'John Doe',
                        accountNumber: '1234567890',
                        balance: 5000.00,
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
});
