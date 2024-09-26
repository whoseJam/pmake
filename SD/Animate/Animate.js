import { ActionList } from "@/Animate/ActionList";

/**
 * @class ActionPool
 * @description 用来管理所有的Actions，当一个Action被生成后，它将自动被塞入ActionPool
 */
class ActionPool {
    constructor() {
        this.lastTickFlag = false;
        this.currentTimestamp = 0;
        this.historyActionList = {};
        this.currentActionList = new ActionList();
    }

    tick(timestamp) {
        if (timestamp !== undefined) {
            this.currentTimestamp = timestamp;
            let currentActionList = this.currentActionList;
            if (window.SHOULD_FLUSH) return;
            currentActionList.tick(timestamp);
            requestAnimationFrame(this.tick.bind(this));
        } else {
            this.currentActionList.tick();
        }
    }

    reset() {
        let currentActionList = this.currentActionList;
        currentActionList.finish();
    }

    /**
     * 第一次来到某一帧，开始添加action时，应该调用此函数
     * 
     * 此函数将action分别放入历史列表和调度列表
     * @param {Action} action 
     */
    push(action) {
        let currentActionList = this.currentActionList;
        if (!currentActionList) throw new Error("currentActionList Not Found");
        action.startTimestamp = this.currentTimestamp;
        currentActionList.push(action);
    }

    play() {
        const frame = ++window.CURRENT_FRAME;
        window.MAXIMUM_FRAME = window.CURRENT_FRAME;
        const lastframe = frame - 1;
        if (!this.historyActionList[lastframe])
            this.historyActionList[lastframe] = this.currentActionList;
        this.currentActionList = new ActionList();
    }

    rollback() {
        const nextframe = window.CURRENT_FRAME;
        if (nextframe === window.MAXIMUM_FRAME)
            this.historyActionList[nextframe] = this.currentActionList;
        if (nextframe < 0) return;
        window.CURRENT_FRAME--;
        if (!this.historyActionList[nextframe])
            this.historyActionList[nextframe] = this.currentActionList;
        this.currentActionList = this.historyActionList[nextframe].rollback();
        this.currentActionList.restart();
    }

    replay() {
        let frame = ++window.CURRENT_FRAME;
        this.currentActionList = this.historyActionList[frame].replay();
        this.currentActionList.restart();
    }

    currentFinished() {
        return this.currentActionList.finished();
    }
}

export const Animate = new ActionPool();

requestAnimationFrame(Animate.tick.bind(Animate))