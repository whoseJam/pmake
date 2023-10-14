import { timeout, transition } from "d3";

export function Manager(node) {
    self = {};

    self._ = {};
    self.node = node;
    self.launch = launch;

    return self;
}

function launch(action) {
    if (action.startStamp > 0)
        timeout(function() { action.start(); }, action.startStamp);
    else action.start();
    return;

    action.owner = this;
    let channel = action.channel;
    let actions = self._[channel];
    if (actions === undefined)
        actions = self._[channel] = [];

    if (action.startStamp === 0 && action.endStamp === 0) {
        let i = 0;
        for (; i < actions.length; i++) {
            if (actions[i] === action) break;
            if (actions[i]) {
                if (actions[i].frame === action.frame &&
                    actions[i].startStamp >= action.startStamp) break;
                if (actions[i].frame > action.frame) break;
                // actions[i].stop(action);
            } 
        }
        // if (i > 0) actions.splice(0, i);
        action.start();
        return;
    }
    
    let pos = 0;
    for (; pos < actions.length; pos++) {
        if (!action[pos]) continue;
        if (actions[pos].frame === action.frame &&
            actions[pos].startStamp > action.startStamp) {
            break;
        }
    }
    actions.push(action);
    console.log(actions);
    for (let i = actions.length - 1; i > pos; i--) {
        let tmp = actions[i];
        actions[i] = actions[i - 1];
        actions[i - 1] = tmp;
    }
    
    let trans = transition();
    trans.delay(action.startStamp)
    trans.duration(action.endStamp - action.startStamp);
    trans.on("start", function() {
        let i = 0;
        for (; i < actions.length; i++) {
            if (actions[i] === action) break;
            if (action.owner.node.type() === "Line")
                console.log("actions[i]=", actions[i]);
            if (actions[i]) {
                if (actions[i].frame === action.frame &&
                    actions[i].startStamp >= action.startStamp) break;
                if (actions[i].frame > action.frame) break;
                actions[i].stop(action);
            } 
        }
        // if (i > 0) actions.splice(0, i - 1);
        action.start();
    });
}