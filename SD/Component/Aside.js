import { Aside as A } from "@/Rule/Aside";
import { Factory } from "@/Utility/Factory";

export function Aside(parent, aside, location = "lc", gap = 5) {
    aside.vars.merge({
        location,
        gap,
    });

    aside.location = Factory.handler("location");
    aside.gap = Factory.handlerLowPrecise("asideGap");

    parent.childAs(aside, function (parent, child) {
        const rule = A(child.vars.location, child.vars.gap);
        rule(parent, child);
    });

    return aside;
}
