const express = require('express');
const { setItem, getItem } = require('./cache');
const app = express();
app.use(express.json());

let server;

const startServer = () => {
  app.post('/', (req, res) => {
    const result = req.body;
    setItem(`response${result.data.requestId}`, result);

    return res.status(200).json({ success: true });
  })

  server = app.listen(5555, () => console.log('Started! :D'));
}

const closeServer = () => {
  console.log('Closed! :D');
  server.close();
}

module.exports = { startServer, closeServer };
