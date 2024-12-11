import { Action } from "./Action";

export class Animate {
    static tick(t: number);

    static finished(): boolean;
    static forceToFinish();

    static push(action: Action);
    static startNewFrame();
    static rollbackFrame();
    static replayFrame();

    static debug();
}
