const canvas = document.getElementById("canvas");

export function handleInput(event, myID, socket)
{
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
}