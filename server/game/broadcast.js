const WebSocket = require("ws");

let wss = null;

function setWebSocketServer(server)
{
    wss = server;
}

function broadcast(data)
{
    if(!wss) return;

    wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN)
            client.send(data);
    });
}

module.exports = {
    setWebSocketServer,
    broadcast
};