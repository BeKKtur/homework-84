import mongoose from "mongoose";
import {Task, TaskMethods, TaskModel} from "../types";

const Schema = mongoose.Schema;

const taskSchema = new Schema<Task, TaskModel, TaskMethods>({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
        default: 'new',
        required: true
    }
}, {versionKey: false});

// @ts-ignore
taskSchema.methods.username = function (username) {
    return this.user = username
}

const taskModule = mongoose.model<Task, TaskModel>('task', taskSchema);

export default taskModule