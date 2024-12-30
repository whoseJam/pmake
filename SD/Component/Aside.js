import { Aside as AsideRule } from "@/Rule/Aside";
import { Factory } from "@/Utility/Factory";

let ID = 0;

export function Aside(parent, aside, location = "lc", gap = 5) {
    aside.vars.location = location;
    aside.vars.gap = gap;

    aside.location = Factory.handler("location");
    aside.gap = Factory.handlerLowPrecise("asideGap");

    parent.childAs(`aside_${++ID}`, aside, function (parent, child) {
        const rule = AsideRule(child.vars.location, child.vars.gap);
        rule(parent, child);
    });

    return aside;
}
