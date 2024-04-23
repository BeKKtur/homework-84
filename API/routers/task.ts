import express from "express";
import userModel from "../models/user";
import taskModule from "../models/task";

const taskRouter = express.Router();


taskRouter.get('/', async (req, res, next) => {
    try {
        const tokenData = req.get('Authorization');

        if(!tokenData) {
            return res.status(400).send({error: "No token provider"})
        }

        const [_, token] = tokenData.split(' ');

        const user = await userModel.findOne({token});

        if(!user) {
            res.status(403).send({error: 'Wrong token'});
        }

        const task = await taskModule.find({user: user.username});

        return res.send(task);

    } catch (e) {
        next(e)
    }
})

taskRouter.post('/', async (req, res, next) => {
    try {
        const tokenData = req.get('Authorization');

        if(!tokenData) {
            return res.status(400).send({error: "No token provider"})
        }

        const [_, token] = tokenData.split(' ');

        const user = await userModel.findOne({token});

        if(!user) {
            res.status(403).send({error: 'Wrong token'});
        }

        const task = new taskModule({
            title: req.body.title,
            status: req.body.status
        });

        task.username(user.username);

        await task.save();
        return  res.send(task);

    } catch (e) {
        next(e)
    }
});

taskRouter.put('/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await taskModule.findById(taskId);
        const tokenData = req.get('Authorization');

        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        if(!tokenData) {
            return res.status(400).send({error: "No token provider"})
        }

        const [_, token] = tokenData.split(' ');

        const user = await userModel.findOne({token});

        if(!user) {
            res.status(403).send({error: 'Wrong token'});
        }
        if (task.user.toString() !== user.username.toString()) {
            return res.status(403).send({ error: "You are not allowed to delete this task" });
        }

        const updatedTask = await taskModule.findByIdAndUpdate({_id:taskId}, req.body, { new: true });

        return res.send(updatedTask);
    } catch (e) {
        next(e)
    }
});

taskRouter.delete('/:id', async (req, res, next) => {
   try  {
       const tokenData = req.get('Authorization');
       const taskId = req.params.id;
       const task = await taskModule.findById(taskId);

       if (!task) {
           return res.status(404).send({ error: "Task not found" });
       }
       if(!tokenData) {
           return res.status(400).send({error: "No token provider"})
       }

       const [_, token] = tokenData.split(' ');
       const user = await userModel.findOne({token});

       if(!user) {
           res.status(403).send({error: 'Wrong token'});
       }
       if (task.user.toString() !== user.username.toString()) {
           return res.status(403).send({ error: "You are not allowed to delete this task" });
       }
       const taskDelete = await taskModule.findByIdAndDelete({_id:taskId});

       return res.send({message: "task deleted"});

   } catch (e) {
       next(e)
   }
});


export default taskRouter