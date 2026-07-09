const socket = new WebSocket(`ws://${location.host}`);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let myID;
let ballRadius;

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if(data.type === "init")
    {
        myID = data.id;
    }
    if(data.type === "state")
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(data);
    }
    if(data.type === "canvasDetails")
    {
        canvas.width = data.canvas.width;
        canvas.height = data.canvas.height;
        ballRadius = data.radius
    }

}

function draw(state)
{
    if(!state || !state.game || !state.game.player);
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(state.game.ball.x, state.game.ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    state.game.players.forEach((player) => {
        ctx.fillStyle = player.id === myID ? "#212121" : "#00ff00";
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    });
}

canvas.addEventListener("touchmove", (event) => {
    const rect = canvas.getBoundingClientRect();

    const touch = event.touches[0];

    const x = touch.clientX - rect.left;
    const y = touch.clientY = rect.top;

    socket.send(JSON.stringify({
        type : `move${myID}`,
        x : x,
        y : y
    }));
});
