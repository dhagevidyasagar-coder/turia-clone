const http = require('http');
const server = http.createServer((req, res) => { res.end('ok'); });
server.listen(5005, '127.0.0.1', () => {
  console.log('Node bound to 127.0.0.1:5005');
  server.close();
});
