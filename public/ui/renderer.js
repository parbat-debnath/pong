const ctx = canvas.getContext("2d");

let ballRadius;
let countDownText = "";

export function setCanvas(data, myID)
{
    canvas.height = data.canvas.height;
    canvas.width = data.canvas.width;
    ballRadius = data.ball.radius;

    if(myID === 1)
    {
        canvas.classList.add("reversed");
    }
}

export function clearCanvas()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function draw(state, myID)
{
    if(!state.game.countDownText)
        printScore(state, myID);
    
    state.game.players.forEach((player) => {
        ctx.fillStyle = player.id === myID ? "#0084ff" : "#ff385c";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
        ctx.shadowBlur = 0;
    });
    
    if(state.game.countDownText)
    {
        printCountdown(state.game.countDownText, myID);
        return;
    }
    
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(state.game.ball.x, state.game.ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function printScore(state, myID)
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

function printCountdown(text, myID)
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