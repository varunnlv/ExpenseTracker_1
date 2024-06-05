// functions/api.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json'); // Path to your db.json file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

exports.handler = async (event, context) => {
    return new Promise((resolve, reject) => {
        server.listen(3000, () => {
            resolve({
                statusCode: 200,
                body: JSON.stringify({ message: 'JSON Server is running' }),
            });
        });
    });
};
