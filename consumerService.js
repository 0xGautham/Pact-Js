const { server } = require('./consumer.js');

server.listen(7070, () => {
    console.log('Banking Service listening on http://localhost:7070');
});
