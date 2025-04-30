// api/index.js

const jsonServer = require("json-server");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json")); // Adjusted path
const middlewares = jsonServer.defaults();

// Middleware to set custom headers
const customHeadersMiddleware = (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("abc", "XYZ123");
  next();
};

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(customHeadersMiddleware);

server.post("/:purpose", (req, res) => {
  const newData = req.body;
  const db = router.db; // get lowdb instance
  db.get(req.params.purpose).push(newData).write();
  res.status(200).json(newData);
});

// Important: wrap server in a handler function
module.exports = (req, res) => {
  server(req, res);
};
