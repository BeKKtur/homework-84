import express from 'express'
import userRoute from "./routers/user";
import mongoose from "mongoose";
import config from "./config";
import taskRouter from "./routers/task";

const app = express();
const port = 8000;

app.use(express.json());
app.use('/users', userRoute);
app.use('/tasks', taskRouter);


const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log(`port ${port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
}

void run()

