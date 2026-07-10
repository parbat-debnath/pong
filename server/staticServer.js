const fs = require("fs");
const path = require("path");

const mimeTypes = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".jpg" : "image/jpeg",
    ".png" : "image/png",
    ".gif" :"image/gif"
};

function handleRequest(request, response)
{
    let urlPath = request.url === "/" ? "index.html" : request.url;
    let filePath = path.join(__dirname, "..", "public", urlPath);
    
    if(filePath === "public/")
    filePath += "index.html";
    
    const extention = path.extname(filePath);
    
    fs.readFile(filePath, (err, data) => {
        if(!err)
        {
            response.writeHead(200, {
                "Content-Type" : mimeTypes[extention] || "application/octet-stream"
            });
    
            response.end(data);
        }
        else
        {
            response.writeHead(404);
            response.end(`ERROR 404 : ${filePath} not found`)
        }
    });

}



module.exports = {
    mimeTypes, handleRequest
}