import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

function onSocketPreError(error: Error) {
  console.error("WebSocket pre-error:", error);
}

function onSocketPostError(error: Error) {
  console.error("WebSocket post-error:", error);
}

app.use(cors());
app.use(express.json());

console.log(`Attempting to start server on port ${port}`);

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  //perform auth
  if (req.headers["BadAuth"]) {
    console.log("Unauthorized WebSocket connection attempt");
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws: WebSocket, req: express.Request) => {
  ws.on("error", onSocketPostError);

  ws.on("message", (msg, isBinary) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});
