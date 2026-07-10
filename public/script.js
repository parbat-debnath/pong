const socket = new WebSocket(`ws://${location.host}`);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let myID;
let ballRadius;
let countDownText = "";

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if(data.type === "init")
    {
        myID = data.id;
        if(myID === 1)
        {
            canvas.classList.add("reversed");
        }
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
    if(!state.game.countDownText)
        printScore(state);
    
    state.game.players.forEach((player) => {
        ctx.fillStyle = player.id === myID ? "#0084ff" : "#ff385c";
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    });
    
    if(state.game.countDownText)
    {
        printCountdown(state.game.countDownText);
        return;
    }
    
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(state.game.ball.x, state.game.ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

}

canvas.addEventListener("touchmove", (event) => {
    const rect = canvas.getBoundingClientRect();

    const touch = event.touches[0];

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if(myID === 1)
    {
        socket.send(JSON.stringify({
            type : `move${myID}`,
            x : canvas.width - x,
            y : canvas.height - y
        }));
    }
    else
    {
        socket.send(JSON.stringify({
            type : `move${myID}`,
            x : x,
            y : y
        }));
    }
}, {passive : false});

function printScore(state)
{
    if(state.game.players.length != 2) return;
    if(state.game.countDownText) return;

    ctx.save();
    ctx.font = '60px BebasNeue-Regular';
    ctx.fillStyle = "#3f3f3f";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.translate(canvas.width / 2, canvas.height / 2);

    if(myID === 1)
    {
        ctx.rotate(Math.PI);
    }

    ctx.fillText(`${state.game.score[myID]} : ${state.game.score[1 - myID]}`, 0, 0);

    ctx.restore();
}

function printCountdown(text)
{
    ctx.save();
    ctx.font = '60px BebasNeue-Regular';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.translate(canvas.width / 2, canvas.height / 2);

    if(myID === 1)
    {
        ctx.rotate(Math.PI);
    }

    ctx.fillText(text, 0, 0);
    
    ctx.restore();
}