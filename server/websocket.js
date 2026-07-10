const WebSocket = require("ws");
const { broadcast, setWebSocketServer } = require("./game/broadcast");
const { game } = require("./game/gameState");
const { triggerCountdown } = require("./game/gameLoop");

let wss;

function createWebSocketServer(server)
{
    wss = new WebSocket.Server({server});

    setWebSocketServer(wss);
    
    wss.on("connection", (socket) => {
        console.log("Someone joined");
        broadcast(JSON.stringify("Hello from server"));
    
        let id = game.players.length;
    
        if(id >= 2)
        {
            socket.close();
            return;
        }
        else if(id === 1)
        {
            triggerCountdown();
            setTimeout(() => {
                game.isPaused = false;
            }, 6000);
        }
    
        const player = {
            id : id,
            x : 150,
            y : id === 0? 487.5 : 112.5,
    
            width : 100,
            height : 20,
    
            socket : socket
        };
    
        game.players.push(player);
    
        socket.send(JSON.stringify({
            type : "init",
            id : player.id
        }));
        socket.send(JSON.stringify({
            type : "canvasDetails",
            canvas : game.canvas,
            ball : {
                radius : game.ball.radius
            }
        }));
    
        socket.on("message", (message) => {
            const data = JSON.parse(message);
    
            if(data.type === "move0" )
            {
                game.players[0].x = data.x;
            }
            if(data.type === "move1")
            {
                game.players[1].x = data.x;
            }
        });
    });
}

module.exports = { createWebSocketServer };