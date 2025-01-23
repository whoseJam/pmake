import { ActionList } from "@/Animate/ActionList";
import { Status as S } from "@/Interact/Status";

export class Animate {
    static lastTickFlag = false;
    static currentTimestamp = 0;
    static historyActionList = {};
    static currentActionList = new ActionList();
    static shouldStop = false;
    static animationRequest = Animate.tick.bind(Animate);
    static count = 0;
    static trigger() {
        this.count++;
    }
    static stop() {
        this.shouldStop = true;
    }
    static start() {
        if (this.shouldStop) {
            this.shouldStop = false;
            requestAnimationFrame(this.animationRequest);
        }
    }
    static tick(t) {
        const dt = t - this.currentTimestamp;
        this.currentTimestamp = t;
        const currentActionList = this.currentActionList;
        if (window.SHOULD_FLUSH || this.shouldStop) return;
        if (this.count || (currentActionList.enabled && !currentActionList.finished())) {
            if (!currentActionList.enabled) {
                currentActionList.enabled = true;
                this.count--;
            }
            currentActionList.tick(t, dt);
        }
        requestAnimationFrame(this.animationRequest);
    }
    static finished() {
        return this.currentActionList.finished();
    }
    static forceToFinish() {
        this.currentActionList.forceToFinish();
    }
    static push(action) {
        const currentActionList = this.currentActionList;
        action.t = this.currentTimestamp;
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
        S.updateFrameStatus();
    }
    static rollbackFrame() {
        const nextFrame = window.CURRENT_FRAME;
        if (nextFrame === window.MAXIMUM_FRAME) this.historyActionList[nextFrame] = this.currentActionList;
        if (nextFrame < 0) return; // no frame to rollback
        window.CURRENT_FRAME--;
        if (!this.historyActionList[nextFrame]) {
            this.historyActionList[nextFrame] = this.currentActionList;
        }
        this.currentActionList = this.historyActionList[nextFrame].rollback();
        this.currentActionList.restart();
        S.updateFrameStatus();
    }
    static replayFrame() {
        let frame = ++window.CURRENT_FRAME;
        this.currentActionList = this.historyActionList[frame].replay();
        this.currentActionList.restart();
        S.updateFrameStatus();
    }
    static debug() {
        this.currentActionList.debug();
    }
}

requestAnimationFrame(Animate.animationRequest);
