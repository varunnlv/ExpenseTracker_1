// functions/api.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Path to your db.json file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

exports.handler = async (event, context) => {
  const handler = server.handle.bind(server);
  return new Promise((resolve, reject) => {
    const req = {
      method: event.httpMethod,
      url: event.path.replace('/.netlify/functions/api', ''),
      headers: event.headers,
      query: event.queryStringParameters,
      body: event.body,
    };

    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      setHeader(name, value) {
        this.headers[name] = value;
      },
      getHeader(name) {
        return this.headers[name];
      },
      end(body) {
        this.body = body;
        resolve({
          statusCode: this.statusCode,
          body: this.body,
          headers: this.headers,
        });
      },
      writeHead(statusCode, headers) {
        this.statusCode = statusCode;
        this.headers = { ...this.headers, ...headers };
      },
      write(chunk) {
        this.body += chunk;
      },
    };

    handler(req, res);
  });
};
