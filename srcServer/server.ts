import express from 'express';
import cors from 'cors';
import type { Express, RequestHandler } from 'express';



const port = process.env.PORT || 10000;

const app: Express = express();

const logger: RequestHandler = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
}

app.use(logger);
app.use(cors());
app.use(express.json());
app.use("/", express.static("./dist"));