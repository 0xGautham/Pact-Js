const { server, importData } = require('./provider.js');
importData();

server.listen(7071, () => {
    console.log('Banking Profile Service listening on http://localhost:7071');
});
