function handleCollision(game)
{
    if(game.ball.x + game.ball.radius >= game.canvas.width)
    {
        game.ball.velX = -Math.abs(game.ball.velX);
    }
    if(game.ball.x - game.ball.radius <= 0)
    {
        game.ball.velX = Math.abs(game.ball.velX);
    }
    if(game.ball.y - game.ball.radius >= game.canvas.height) // player 1 wins
    {
        game.score[1]++;
        game.ball.x = game.canvas.width / 2;
        game.ball.y = game.canvas.height / 2;
        game.ball.velX = 0;
        game.isPaused = true;
        setTimeout(() => {
            game.isPaused = false;
        }, 2000);
    }
    if(game.ball.y + game.ball.radius <= 0) // player 0 wins
    {
        game.score[0]++;
        game.ball.x = game.canvas.width / 2;
        game.ball.y = game.canvas.height / 2;
        game.ball.velX = 0;
        game.isPaused = true;
        setTimeout(() => {
            game.isPaused = false;
        }, 2000);
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
    });
}

module.exports = { handleCollision };