import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors'
import authRoute from './route/auth.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import connect from "./connectDB.js";
import boardRoutes from './route/board.js'
import taskRoutes from './route/task.js'
import sectionRoutes from './route/section.js'

dotenv.config();

connect();

const app = express();
app.use(cors())
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.get('/' ,(req, res) => {
    res.send('Hello World');
})

app.use('/data/auth', authRoute)
app.use('/data/board', boardRoutes)
app.use('/data/:boardId/task', taskRoutes)
app.use('/data/:boardId/section', sectionRoutes)

app.get('/*', function(req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
})

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`));