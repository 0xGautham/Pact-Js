const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const pactBrokerUrl = 'http://127.0.0.1:8000';
const proxyPath = '/Users/gauthamgauth/pact-js/Pact-Js/consumer/pacts';

app.use(
    proxyPath,
    createProxyMiddleware({
        target: pactBrokerUrl,
        changeOrigin: true,
    })
);

const proxyPort = 3000;
app.listen(proxyPort, () => {
    console.log(`Proxy server listening on http://localhost:${proxyPort}`);
});
