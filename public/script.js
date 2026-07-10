import { handleInput } from "./ui/input.js";
import { setCanvas, draw, clearCanvas } from "./ui/renderer.js";

const socket = new WebSocket(`ws://${location.host}`);

let myID;

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if(data.type === "init")
    {
        myID = data.id;
    }
    if(data.type === "state")
    {
        clearCanvas();
        draw(data, myID);
    }
    if(data.type === "canvasDetails")
    {
        setCanvas(data, myID);
    }

}

canvas.addEventListener("touchmove", (event) => {
    handleInput(event, myID, socket);
}, {passive : false});
