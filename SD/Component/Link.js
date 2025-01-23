import { svg } from "@/Interact/Root";
import { effect } from "@/Node/Core/Reactive";
import { Line } from "@/Node/Nake/Line";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";

let ID = 0;

export function Link(sourceElement, targetElement, linkType = Line, sourceXLocation = "cx", sourceYLocation = "cy", targetXLocation = "cx", targetYLocation = "cy") {
    const link = new linkType(svg());
    const name = `link_${++ID}`;

    link.vars.merge({
        element1: sourceElement,
        element2: targetElement,
        xlocation1: sourceXLocation,
        ylocation1: sourceYLocation,
        xlocation2: targetXLocation,
        ylocation2: targetYLocation,
    });

    effect(() => {
        console.log("id=", link.id, "trigger effect");
        if (link.vars.update) link.vars.update = false;
        const element1 = link.vars.element1;
        const element2 = link.vars.element2;
        link.source(element1[link.vars.xlocation1](), element1[link.vars.ylocation1]());
        link.target(element2[link.vars.xlocation2](), element2[link.vars.ylocation2]());
    });
    effect(() => {
        const element1 = link.vars.element1;
        const element2 = link.vars.element2;
        trim(link, element1, element2);
    });

    link.sourceElement = function (element) {
        if (element === undefined) return this.vars.element1;
        this.vars.element1.eraseChild(name);
        this.vars.element1 = element;
        element.childAs(name, this);
        return this;
    };

    link.targetElement = function (element) {
        if (element === undefined) return this.vars.element2;
        this.vars.element2.eraseChild(name);
        this.vars.element2 = element;
        element.childAs(name, this);
        return this;
    };

    link.sourceXLocation = Factory.handler("xlocation1");
    link.sourceYLocation = Factory.handler("ylocation1");
    link.targetXLocation = Factory.handler("xlocation2");
    link.targetYLocation = Factory.handler("ylocation2");

    sourceElement.childAs(name, link);
    targetElement.childAs(name, link);
    return link;
}
