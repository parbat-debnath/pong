const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const mimeTypes = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".jpg" : "image/jpeg",
    ".png" : "image/png",
    ".gif" :"image/gif"
};

const server = http.createServer((request, response) => {
    let urlPath = request.url === "/" ? "index.html" : request.url;
    let filePath = path.join(__dirname, "public", urlPath);

    if(filePath === "public/")
        filePath += "index.html";

    const extention = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if(!err)
        {
            response.writeHead(200, {
                "Content-Type" : mimeTypes[extention] || "application/octet-stream"
            });

            response.end(data);
        }
        else
        {
            response.writeHead(404);
            response.end(`ERROR 404 : ${filePath} not found`)
        }
    });
    
});

const wss = new WebSocket.Server({server});

wss.on("connection", (socket) => {
    console.log("Someone joined");
    broadcast(JSON.stringify("Hello from server"), wss);

    let id = game.players.length;

    if(id >= 2)
    {
        socket.close();
        return;
    }

    const player = {
        id : id,
        x : 150,
        y : id === 0? 550 : 50,

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
        radius : game.ball.radius
    }));


    socket.on("message", (message) => {
        const data = JSON.parse(message);

        if(data.type === "move0")
        {
            game.players[0].x = data.x;
        }
        if(data.type === "move1")
        {
            game.players[1].x = data.x;
        }
    })
});


server.listen(3000, () => {
    console.log("Server started");
});

function broadcast(data, wss)
{
    wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN)
            client.send(data);
    });
}


const game = {
    ball : {
        x : 250,
        y : 400,
        velX : 100,
        velY : 200,
        radius : 5,
        maxYVel : 400
    },

    players : [],
    score : [0, 0],
    canvas :
    {
        width : 300,
        height : 600
    }
}

let lastTime = Date.now();

setInterval(() => {
    const now = Date.now();

    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    updateGame(deltaTime);

    const clearPlayers = game.players.map((p) => ({
        id : p.id,
        x : p.x,
        y : p.y,
        width : p.width,
        height : p.height
    }));

    broadcast(JSON.stringify({
        type : "state",
        game : {
            ball : game.ball,
            players : clearPlayers,
            score : game.score
        }
    }), wss);

}, 1000 / 400);

function updateGame(dt)
{
    game.ball.x += game.ball.velX * dt;
    game.ball.y += game.ball.velY * dt;

    handleCollision();
}

function handleCollision()
{
    if(game.ball.x + game.ball.radius >= game.canvas.width)
    {
        game.ball.velX = -Math.abs(game.ball.velX);
    }
    if(game.ball.x - game.ball.radius <= 0)
    {
        game.ball.velX = Math.abs(game.ball.velX);
    }
    if(game.ball.y + game.ball.radius >= game.canvas.height) // player 1 wins
    {
        game.score[1]++;
        game.ball.x = game.canvas.width / 2;
        game.ball.y = game.canvas.height / 2
    }
    if(game.ball.y - game.ball.radius <= 0)
    {
        game.score[0]++;
        game.ball.x = game.canvas.width / 2;
        game.ball.y = game.canvas.height / 2
    }

    game.players.forEach((player) => {
        if(player.x + player.width / 2 >= game.canvas.width)
        {
            player.x = game.canvas.width - player.width / 2;
        }
        if(player.x - player.width / 2 <= 0)
        {
            player.x = player.width / 2;
        }

        if(player.id === 0) // bottom paddle
        {
            if((game.ball.y + game.ball.radius >= player.y - player.height / 2 
                && game.ball.y <= player.y + player.height / 2)
                && (
                    game.ball.x >= player.x - player.width / 2
                    && game.ball.x <= player.x + player.width / 2
                )
            )
            {
                game.ball.velY = - Math.abs(game.ball.velY);
                game.ball.velX = game.ball.maxYVel * (game.ball.x - player.x) / player.width;
            }
        }
        if(player.id === 1) // upper paddle
        {
            if((game.ball.y - game.ball.radius <= player.y + player.height / 2
                && game.ball.y >= player.y - player.height / 2)
                && (
                    game.ball.x >= player.x - player.width / 2
                    && game.ball.x <= player.x + player.width / 2
                )
            )
            {
                game.ball.velY = Math.abs(game.ball.velY);
                game.ball.velX = game.ball.maxYVel * (game.ball.x - player.x) / player.width;
            }
        }
    })
}