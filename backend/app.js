import express from 'express';
import { PORT } from './config.js';
import linesRoute from './routes/lines.routes.js';
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use(linesRoute);

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
