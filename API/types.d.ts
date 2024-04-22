export interface User {
    name: string;
    password: string;
    token: string;
}

export interface Task {
    user: string;
    title: string;
    status: string;
}