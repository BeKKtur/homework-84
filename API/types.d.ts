export interface User {
    username: string;
    password: string;
    token: string;
}

export interface Task {
    user: string;
    title: string;
    status: string;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

export type UserModel = Model<User, {}, UserMethods>

interface TaskMethods {
    username(username: string): Promise<boolean>;
}

export type TaskModel = Model<Task, {}, TaskMethods>