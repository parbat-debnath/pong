const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const winWidth = window.innerWidth;
canvas.width = winWidth;
canvas.height = 2 * winWidth;

let opponentScore = 0;
let playerScore = 0;

const bar = {
    height : 20,
    width : 100,
    x : canvas.width / 2,
    y : canvas.height * 0.7
}
const ball = {
    radius : 10,
    x : canvas.width / 2,
    y : canvas.height / 2
}
let maxVelX = 700;
let velX = 500; // pps
let velY = maxVelX;

let lastTime = performance.now();

ctx.font = 'normal 20px Arial'
ctx.fillStyle = '#212121'
ctx.textAlign = 'center';


canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const x = getPosition(e).x;
    bar.x = x - bar.width / 2;
}, {passive: false});

function gameLoop(currentTime)
{
    let deltaTime = (currentTime - lastTime) / 1000; // in seconds
    lastTime = currentTime;
    
    handleCollision();
    
    ball.x += velX * deltaTime;
    ball.y += velY * deltaTime;
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateBall(ball.x, ball.y);
    drawBar();
    printScore(playerScore, opponentScore);

    requestAnimationFrame(gameLoop);
}

function getPosition(e)
{
    const rect = canvas.getBoundingClientRect()
    const posX = e.touches[0].clientX - rect.left;
    const posY = e.touches[0].clientY - rect.top;
    
    return {x : posX, y : posY};
}

function drawBar()
{
    ctx.fillStyle = "#ffffff";

    let startX = bar.x;
    let startY = canvas.height * 0.7;

    if(startX < 0) startX = 0;
    else if (startX > canvas.width - bar.width) startX = canvas.width - bar.width;

    bar.x = startX;
    
    ctx.fillRect(startX, startY, bar.width, bar.height);
}

function updateBall (x, y)
{
    ctx.fillStyle = "#c81111";
    ctx.beginPath()
    ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
    ctx.fill()
}

function handleCollision()
{
    if((ball.x - ball.radius) <= 0) // left wall
    {
        velX = Math.abs(velX);
    }
    if((ball.x + ball.radius) >= canvas.width) // right wall
    {
        velX = -Math.abs(velX);
    }
    if((ball.y - ball.radius) <= 0) // top wall
    {
        velY = Math.abs(velY);
    }
    if((ball.y + ball.radius >= bar.y) && (ball.x <= bar.x + bar.width && ball.x >= bar.x) && (ball.y - ball.radius) < bar.y) // top of bar
    {
        velY = -Math.abs(velY);
        velX = maxVelX * (ball.x - (bar.x + bar.width / 2)) / bar.width;
    }
    if(ball.y - ball.radius >= canvas.height) // canvas end
    {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 4;
        opponentScore++;
    }
}

function printScore(pScore, oScore)
{
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.font = "14px 'Bebas Neue'";
    ctx.fillText('You                    Player', canvas.width / 2, 100);
    ctx.font = "bold 34px 'Pixelify Sans'";
    ctx.fillText(`${pScore}     ${oScore}`, canvas.width / 2, 150);
}

requestAnimationFrame(gameLoop);