
export class ActionList {
    constructor() {
        this.actionList = null;
        this.actionListEnd = null;
        this.actionCount = 0;
    }
    
    push(action) {
        this.actionCount++;
        this.rebuild(action);
        this.directPush(action);
    }

    directPush(action) {
        if (this.actionList === null) {
            this.actionList = this.actionListEnd = action;
        } else {
            this.actionListEnd.next = action;
            this.actionListEnd = action;
        }
        if (!action.isStopped && !action.hidden) this.size++;
    }

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
        if (before.l === before.r && after.l === after.r && after.l === before.r) {
            after.from = before.from;
            before.stop();
            return;
        }
        return;
    }

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

    tick(timestamp) {
        this.currentTimestamp = timestamp;
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden || action.isStopped) continue;
            if (!action.startTimestamp) action.startTimestamp = timestamp;
            let duration = this.currentTimestamp - action.startTimestamp;
            action.call(duration);
        }
    }

    restart(timestamp) {
        for (let action = this.actionList; action; action = action.next) {
            action.startTimestamp = timestamp;
            action.isStopped = false;
        }
    }

    finish() {
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden || action.isStopped) continue;
            action.finish();
        }
    }

    finished() {
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden || action.isStopped) continue;
            return false;
        }
        return true;
    }

    rollback() {
        let other = new ActionList();
        let maxTimestamp = 0, actionList = [];
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            maxTimestamp = Math.max(maxTimestamp, action.r);
            actionList.push(action);
        }
        for (let i = actionList.length - 1; i >= 0; i--) {
            let action = actionList[i];
            let newAction = action.clone();
            newAction.l = maxTimestamp - action.r;
            newAction.r = maxTimestamp - action.l;
            newAction.from = action.to;
            newAction.to = action.from;
            other.push(newAction);
        }
        return other;
    }

    replay() {
        let other = new ActionList();
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            let newAction = action.clone();
            other.push(newAction);
        } 
        return other;
    }

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