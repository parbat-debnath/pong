const { createWebSocketServer } = require("./server/websocket");
const { handleRequest } = require("./server/staticServer");
const http = require("http");

const server = http.createServer(handleRequest)
createWebSocketServer(server);

server.listen(3000, () => {
    console.log("Server started");
});
