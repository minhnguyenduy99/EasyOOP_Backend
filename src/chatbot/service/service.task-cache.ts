import { Injectable } from "@nestjs/common";
import { ITask } from "./task/ITask";

@Injectable()
export class TaskCacheService {
    constructor() {
        this.__cacheTask = {}
    }
    private __cacheTask

    private pushTask(task: ITask, psid: string, args: any[]) {
        if (this.__cacheTask[psid] == null)
            this.__cacheTask[psid] = []
        this.__cacheTask[psid].push({ task: task, args: args })
    }

    public checkThenPopTask(psid): cacheTask | null {
        if (this.__cacheTask[psid])
            return this.__cacheTask[psid].pop()
        return null
    }

    public setNextTask(task: ITask, psid: string, ...args: any[]) {
        this.pushTask(task, psid, args)
    }
}

interface cacheTask {
    task: ITask
    args: any[]
}