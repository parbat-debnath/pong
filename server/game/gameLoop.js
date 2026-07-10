const { game } = require("./gameState");
const { broadcast } = require("./broadcast");
const { handleCollision } = require("./collision");

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
            score : game.score,
            countDownText : game.countDownText
        }
    }));

}, 1000 / 60);

function updateGame(dt)
{
    if(!game.isPaused){
        game.ball.x += game.ball.velX * dt;
        game.ball.y += game.ball.velY * dt;
    }

    handleCollision(game);
}


function triggerCountdown()
{
    const sequence = ["READY?", "3", "2", "1", "GO!"]

    sequence.forEach((text, index) => {
        setTimeout(() => {
            game.countDownText = text;
        }, index * 1000);
    });

    setTimeout(() => {
        game.countDownText = "";
    }, sequence.length * 1000);
}

module.exports = {
    updateGame,
    triggerCountdown
};