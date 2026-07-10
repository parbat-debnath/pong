const game = {
    ball : {
        x : 150,
        y : 300,
        velX : 0,
        velY : 500,
        radius : 10,
        maxYVel : 400
    },

    players : [],
    score : [0, 0],
    canvas :
    {
        width : 300,
        height : 600
    },

    isPaused : true,
    countDownText : ""
}

module.exports = { game };