import { Action } from "@/Animate/Action";

/**
 * @class ActionList
 */
export class ActionList {
    /**
     * @constructor
     */
    constructor() {
        this.actionList = null;
        this.actionListEnd = null;
        this.actionCount = 0;
    }
    
    /**
     * 添加一个 action 到调度器中，会启动自动优化
     * @param {Action} action 
     */
    push(action) {
        this.actionCount++;
        this.rebuild(action);
        this.directPush(action);
    }

    /**
     * 添加一个 action 到调度器中，不会启动自动优化
     * @param {Action} action 
     */
    directPush(action) {
        if (this.actionList === null) {
            this.actionList = this.actionListEnd = action;
        } else {
            this.actionListEnd.next = action;
            this.actionListEnd = action;
        }
        if (!action.isStopped && !action.hidden) this.size++;
    }

    /**
     * 检查两个 action 之间的冲突
     * @param {Action} before 先进入调度器的 action
     * @param {Action} after 后进入调度器的 action
     */
    checkConflict(before, after) {
        /**
         * before: |
         * after : |
         * @example
         * - before: opacity: [50, 50] 1 -> 0.5
         * - after : opacity: [50, 50] 0.5 -> 1
         * ===>
         * - after : opacity: [50, 50] 1 -> 1
         * 在这种情况下，认为 before 是一个短暂的错误，阻止突变
         */
        if (before.l === before.r && after.l === after.r && after.l === before.l) {
            after.from = before.from;
            if (after.from === after.to) before.hide();
            else                         before.stop();
            return;
        }



        /**
         * before: |----|
         * after : |----|
         * @example
         * - before: opacity: [0, 300] 0.5 -> 1
         * - after : opacity: [0, 300] 1 -> 0.75
         * ===>
         * - after : opacity: [0, 300] 0.5 -> 0.75
         */
        if (before.l === after.l && before.r === after.r) {
            after.from = before.from;
            before.hide();
            return;
        }
        return;
    }

    /**
     * 将一个 action 与之前已经存在于调度器中的 action，做一个自动优化
     * @param {Action} action 
     */
    rebuild(action) {
        for (let other = this.actionList; other; other = other.next) {
            if (other.hidden) continue;
            if (other.owner === action.owner && other.channel === action.channel) {
                this.checkConflict(other, action);
                if (other.hidden) this.size--;
            }
        }
        this.flushHidden();
    }

    /**
     * 将所有被标记为 hidden 的 action，从调度器中删去
     */
    flushHidden() {
        let prevAction = null, actionList = null;
        for (let action = this.actionList; action; action = action.next) {
            if (!action.hidden) {
                if (prevAction) prevAction.next = action;
                prevAction = action;
                if (!actionList) actionList = action;
            } else {
                if (prevAction) prevAction.next = null;
            }
        }
        this.actionList = actionList;
        this.actionListEnd = prevAction;
    }

    /**
     * 触发一次动画渲染，这个函数应该在 requestAnimationFrame 中被使用
     * @param {number} timestamp 
     */
    tick(timestamp) {
        this.currentTimestamp = timestamp;
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden || action.isStopped) continue;
            if (!action.startTimestamp) action.startTimestamp = timestamp;
            const duration = this.currentTimestamp - action.startTimestamp;
            action.call(duration);
        }
    }

    /**
     * 重启该调度器
     * @param {number} timestamp 
     */
    restart(timestamp) {
        for (let action = this.actionList; action; action = action.next) {
            action.startTimestamp = timestamp;
            action.isStopped = false;
        }
    }

    /**
     * 强制该调度器内所有的 action 立刻结束
     */
    finish() {
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden || action.isStopped) continue;
            action.finish();
        }
    }

    /**
     * 查询调度器中是否所有 action 都已结束
     * @returns {boolean}
     */
    finished() {
        for (let action = this.actionList; action; action = action.next)
            if (!action.hidden && !action.isStopped) return false;
        return true;
    }

    /**
     * 将当前调度器的时间线反转，返回一个新的反转后的调度器
     * @returns {ActionList}
     */
    rollback() {
        const other = new ActionList();
        let maxTimestamp = 0;
        const actionList = [];
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            maxTimestamp = Math.max(maxTimestamp, action.r);
            actionList.push(action);
        }
        for (let i = actionList.length - 1; i >= 0; i--) {
            const action = actionList[i];
            const newAction = action.clone();
            newAction.l = maxTimestamp - action.r;
            newAction.r = maxTimestamp - action.l;
            newAction.from = action.to;
            newAction.to = action.from;
            other.push(newAction);
        }
        return other;
    }

    /**
     * 返回一个新的和本调度器相同的调度器
     * @returns {ActionList}
     */
    replay() {
        const other = new ActionList();
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            const newAction = action.clone();
            other.push(newAction);
        } 
        return other;
    }

    /**
     * debug 时打印信息
     */
    debug() {
        console.log("---------------Action List debug---------------")
        let used = 0;
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            console.log(action.log(), action);
            used++;
        }
        console.log("input action count =", this.actionCount, 
                    "used action count =", used,
                    "rate =", used / this.actionCount);
        console.log("---------------Action List debug---------------");
        console.log("");
    }
}