import express from "express";
import userModel from "../models/user";
import taskModule from "../models/task";
import auth, {RequestWithUser} from "../middleware/auth";
import {HydratedDocument} from "mongoose";

const taskRouter = express.Router();

taskRouter.get('/', auth,async (req: RequestWithUser, res, next) => {
    try {
        const task = await taskModule.find({user: req.user?.username});
        return res.send(task);
    } catch (e) {
        next(e)
    }
})

taskRouter.post('/', auth,async (req:RequestWithUser, res, next) => {
    try {
        const task = new taskModule({
            title: req.body.title,
            status: req.body.status
        });

        task.username(req.user?.username);

        await task.save();
        return  res.send(task);

    } catch (e) {
        next(e)
    }
});

taskRouter.put('/:id', auth,async (req:RequestWithUser, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await taskModule.findById(taskId);
        if (task.user.toString() !== req.user?.username.toString()) {
            return res.status(403).send({ error: "You are not allowed to delete this task" });
        }
        const updatedTask = await taskModule.findByIdAndUpdate({_id:taskId}, req.body, { new: true });
        return res.send(updatedTask);
    } catch (e) {
        next(e)
    }
});

taskRouter.delete('/:id', auth,async (req:RequestWithUser, res, next) => {
   try  {
       const taskId = req.params.id;
       const task = await taskModule.findById(taskId);

       if (!task) {
           return res.status(404).send({ error: "Task not found" });
       }
       if (task.user.toString() !== req.user?.username.toString()) {
           return res.status(403).send({ error: "You are not allowed to delete this task" });
       }
       const taskDelete = await taskModule.findByIdAndDelete({_id:taskId});

       return res.send({message: "task deleted"});

   } catch (e) {
       next(e)
   }
});


export default taskRouter