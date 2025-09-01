import { config } from "dotenv";
import cors from "cors";

config();

// 中间件-pg
// 中间件-express
import express from "express";
import bodyParser from "body-parser";
import { WebSocketServer } from 'ws';

// 中间件-各级路由
import { mounthttp, mountws } from "../lib/mount";
import { emailController, emailWSController } from "../controller/email.controller";

const app = express();
app.use(bodyParser.json()).use(cors());

mounthttp(app, [
    emailController
]);

app.listen(process.env.SERVER_HTTP_PORT, async () => {
    console.log(`App http listening at http://localhost:${process.env.SERVER_HTTP_PORT}`);
});

// 中间件-websocket
const wss = new WebSocketServer({ port: Number(process.env.SERVER_WS_PORT) }, () => {
    console.log(`App websocket listening at ws://localhost:${process.env.SERVER_WS_PORT}`);
});
mountws(wss, [
    emailWSController
]);
