import { Injectable, Logger } from "@nestjs/common";
import { TaskExercise, TaskID } from "./task";
import { TaskAbout } from "./task/TaskAbout";
import { TaskGreeting } from "./task/TaskGreeting";
import { TaskMenu } from "./task/TaskMenu";
import { TaskQnA } from "./task/TaskQnA";
import { TaskTopic } from "./task/TaskTopic";

@Injectable()
export class PostBackService {
    private readonly logTag = "[PostBackService]"

    constructor(
        protected readonly Log: Logger,
        protected readonly taskExercise: TaskExercise,
        protected readonly taskGreeting: TaskGreeting,
        protected readonly taskMenu: TaskMenu,
        protected readonly taskTopic: TaskTopic,
        protected readonly taskAbout: TaskAbout,
        protected readonly taskQnA: TaskQnA,
    ) { }

    public handler(payload: string, psid: string) {
        let obj
        if (payload.startsWith("{"))
            obj = JSON.parse(payload)
        else
            obj = payload

        switch (obj.tid) {
            case TaskID.About:
                return this.taskAbout.handler()
            case TaskID.Greeting:
                return this.taskGreeting.handler(psid)
            case TaskID.Menu:
                return obj.args ? this.taskMenu.handler(obj.args[0]) : this.taskMenu.handler()
            case TaskID.QnA:
                return this.taskQnA.onHelp()
            case TaskID.Test:
                return this.taskExercise.startTest(...obj.args)
            case TaskID.TestHelp:
                return this.taskExercise.testHelp(...obj.args)
            case TaskID.ExerciseChoosePage:
                return this.taskExercise.onChoosePage(...obj.args)
            case TaskID.ExerciseChooseQuestion:
                return this.taskExercise.onChooseQuestion(...obj.args)
            case TaskID.ExerciseChooseAnswer:
                return this.taskExercise.onChooseAnswer(...obj.args)
            case TaskID.ExerciseChooseVerifySubmit:
                return this.taskExercise.onVerifySubmit(...obj.args)
            case TaskID.ExerciseChooseSubmit:
                return this.taskExercise.onSubmit(...obj.args)
            default:
                this.Log.warn(obj, `${this.logTag} unhandler payload`)
        }
    }
}
