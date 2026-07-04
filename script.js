const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const winWidth = window.innerWidth;
canvas.width = winWidth;
canvas.height = 2 * winWidth;

const bar = {
    height : 20,
    width : 100,
    x : canvas.width,
    y : canvas.height * 0.7
}
const ball = {
    radius : 10,
    x : canvas.width / 2,
    y : canvas.height / 2
}
let maxVelX = 700;
let velX = 300; // pps
let velY = 500;

let lastTime = performance.now();

ctx.font = 'normal 20px Arial'
ctx.fillStyle = '#212121'
ctx.textAlign = 'center';


canvas.addEventListener("touchmove", (e) => {
    const x = getPosition(e).x;
    bar.x = x - bar.width / 2;
});

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

    requestAnimationFrame(gameLoop);
}

function getPosition(e)
{
    const posX = e.touches[0].clientX;
    const posY = e.touches[0].clientY;
    
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
    ctx.fillStyle = "#ffffff";
    ctx.beginPath()
    ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
    ctx.fill()
}

function handleCollision()
{
    if((ball.x - ball.radius) < 0 && (ball.y - ball.radius) < bar.y) // left wall
    {
        velX = -velX;
    }
    if((ball.x + ball.radius) > canvas.width && (ball.y - ball.radius) < bar.y) // right wall
    {
        velX = -velX;
    }
    if((ball.y - ball.radius) < 0) // top wall
    {
        velY = -velY;
    }
    if((ball.y + ball.radius >= bar.y) && (ball.x <= bar.x + bar.width && ball.x >= bar.x) && (ball.y - ball.radius) < bar.y) // top of bar
    {
        velY = -velY;
        velX = maxVelX * (ball.x - (bar.x + bar.width / 2)) / bar.width;
        console.log(velX);
    }
    if(ball.y <= bar.y + bar.height && ball.y >= bar.y) // right side of bar
    {
        velX = -velX;
    }
    if((ball.y <= bar.y + bar.height && ball.y >= bar.y) && (ball.x - ball.radius) | 0 === (bar.x + bar.width) | 0) // right side of bar
    {
        velX = -velX;
    }
    if((ball.y <= bar.y + bar.height && ball.y >= bar.y) && (ball.x + ball.radius) | 0 === bar.x | 0) // right side of bar
    {
        velX = -velX;
    }
}

requestAnimationFrame(gameLoop);