import { ActionList } from "@/Animate/ActionList";

import { Status } from "@/Interact/Status";

export class Animate {
    static lastTickFlag = false;
    static currentTimestamp = 0;
    static historyActionList = {};
    static currentActionList = new ActionList();

    static tick(t) {
        if (t !== undefined) {
            this.currentTimestamp = t;
            const currentActionList = this.currentActionList;
            if (window.SHOULD_FLUSH) return;
            currentActionList.tick(t);
            requestAnimationFrame(Animate.tick.bind(Animate));
        } else {
            throw new Error("Not Implemented Yet");
            this.currentActionList.tick();
        }
    }

    static reset() {
        const currentActionList = this.currentActionList;
        currentActionList.finish();
    }

    static push(action) {
        const currentActionList = this.currentActionList;
        action.startTimestamp = this.currentTimestamp;
        currentActionList.push(action);
    }

    static startNewFrame() {
        const frame = ++window.CURRENT_FRAME;
        window.MAXIMUM_FRAME = Math.max(window.CURRENT_FRAME, window.MAXIMUM_FRAME);
        const lastFrame = frame - 1;
        if (!this.historyActionList[lastFrame]) {
            this.historyActionList[lastFrame] = this.currentActionList;
        }
        this.currentActionList = new ActionList();
        Status.updateFrameStatus();
    }

    static rollbackFrame() {
        const nextFrame = window.CURRENT_FRAME;
        if (nextFrame === window.MAXIMUM_FRAME)
            this.historyActionList[nextFrame] = this.currentActionList;
        if (nextFrame < 0) return; // no frame to rollback
        window.CURRENT_FRAME--;
        if (!this.historyActionList[nextFrame]) {
            this.historyActionList[nextFrame] = this.currentActionList;
        }
        this.currentActionList = this.historyActionList[nextFrame].rollback();
        this.currentActionList.restart();
        Status.updateFrameStatus();
    }

    static replayFrame() {
        let frame = ++window.CURRENT_FRAME;
        this.currentActionList = this.historyActionList[frame].replay();
        this.currentActionList.restart();
        Status.updateFrameStatus();
    }

    static currentFinished() {
        return this.currentActionList.finished();
    }

    static debug() {
        this.currentActionList.debug();
    }
}

requestAnimationFrame(Animate.tick.bind(Animate));