import { SDNode } from "@/Node/SDNode";
import { Aside as AsideRuleFactory } from "@/Rule/Aside";

let asideID = 0;

function AsideRule(parent, child) {
    const location  = child.member.getAndFlush("location");
    const gap = child.member.getAndFlush("asideGap");
    const rule = AsideRuleFactory(location, gap);
    rule(parent, child);
}

export function Aside(parent, aside, location = "lc", gap = 5) {
    
    aside.member.new("location", location);
    aside.member.new("asideGap", gap);

    aside.attachUpdate(() => {
        if (aside.member.hasChanged("location") ||
            aside.member.hasChanged("asideGap")) {
            aside.triggerRule();
        }
    });

    aside.location = SDNode.OrdinaryGSet("location", "set");
    aside.gap = SDNode.OrdinaryGSet("asideGap", "setByDqual");

    parent.childAs(`aside_${++asideID}`, aside, AsideRule);

    return aside;
}