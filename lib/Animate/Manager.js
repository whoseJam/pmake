import { transition } from "d3";

export function Manager(node) {
    self = {};

    self._ = {};
    self.node = node;
    self.launch = launch;

    return self;
}

function launch(action) {
    action.owner = this;
    let channel = action.channel;
    let actions = self._[channel];
    if (actions === undefined)
        actions = self._[channel] = [];
    
    let pos = 0;
    for (; pos < actions.length; pos++) {
        if (actions[pos].frame === action.frame &&
            actions[pos].startStamp > action.startStamp) {
            break;
        }
    }
    actions.push(action);
    for (let i = actions.length; i > pos; i--) {
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
            actions[i].stop();
        }
        if (i > 0) actions.splice(0, i);
        action.start();
    });
    trans.on("end", function() { action.stop(); });
}