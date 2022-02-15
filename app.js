const express = require("express");
const cluster = require("cluster");
const os = require("os");

const app = express();

const numCPUs = os.cpus().length;

app.get("/", (req, res) => {
  for (let i = 0; i < 100; i++) {
    // some long running task
  }
  res.send(`Hello from ${process.pid}`);
  //   cluster.worker.kill();
});

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
