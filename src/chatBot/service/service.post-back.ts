import { Injectable, Logger } from "@nestjs/common";
import { TaskExercise, TaskID } from "./task";
import { TaskMenu } from "./task/TaskMenu";
import { TaskTopic } from "./task/TaskTopic";

@Injectable()
export class PostBackService {
    private readonly logTag = "[PostBackService]"

    constructor(
        protected readonly Log: Logger,
        protected readonly taskExercise: TaskExercise,
        protected readonly taskMenu: TaskMenu,
        protected readonly taskTopic: TaskTopic,
    ) { }

    public handler(payload: string, psid: string) {
        let obj
        if (payload.startsWith("{"))
            obj = JSON.parse(payload)
        else
            obj = payload

        switch (obj.tid) {
            case TaskID.Menu:
                return obj.args ? this.taskMenu.handler(obj.args[0]) : this.taskMenu.handler()
            case TaskID.Test:
                return this.taskExercise.startTest(obj.args[0])
            case TaskID.ExerciseChoosePage:
                return this.taskExercise.onChoosePage(...obj.args)
            case TaskID.ExerciseChooseQuestion:
                return this.taskExercise.onChooseQuestion(...obj.args)
            default:
                this.Log.warn(obj, `${this.logTag} unhandler payload`)
        }
    }
}
