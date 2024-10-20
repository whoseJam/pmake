import { Action } from "./Action";

export class Animate {
    static tick(t: number);

    static reset();
    static push(action: Action);
    static startNewFrame();
    static rollbackFrame();
    static replayFrame();
    static currentFinished(): boolean;
    static debug();
}
