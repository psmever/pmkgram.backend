import express, { Application } from 'express';
import * as Server from './Server/Server'

const app: Application = express();

Server.initServer(app);
Server.startServer(app);

