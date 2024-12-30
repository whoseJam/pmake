import { Line } from "@/Node/Nake/Line";
import { svg } from "@/Interact/RootSvg";
import { trim } from "@/Utility/Trim";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

let ID = 0;

export function Link(
    sourceElement,
    targetElement,
    linkType = Line,
    sourceXLocation = "cx",
    sourceYLocation = "cy",
    targetXLocation = "cx",
    targetYLocation = "cy",
    callback = () => {},
) {
    const link = new linkType(svg());
    const name = `link_${++ID}`;
    callback(link);

    link.vars.merge({
        element1: sourceElement,
        element2: targetElement,
        xlocation1: sourceXLocation,
        ylocation1: sourceYLocation,
        xlocation2: targetXLocation,
        ylocation2: targetYLocation,
    });

    effect(() => {
        link.source(
            link.vars.element1[link.vars.xlocation1](),
            link.vars.element1[link.vars.ylocation1](),
        );
        link.target(
            link.vars.element2[link.vars.xlocation2](),
            link.vars.element2[link.vars.ylocation2](),
        );
        trim(link, element1, element2);
    });

    link.sourceElement = function (element) {
        if (element === undefined) return this.vars.element1;
        this.vars.element1.eraseChild(name);
        this.vars.element1 = element;
        element.childAs(name, this, LinkRule);
        return this;
    };

    link.targetElement = function (element) {
        if (element === undefined) return this.vars.element2;
        this.vars.element2.eraseChild(name);
        this.vars.element2 = element;
        element.childAs(name, this, LinkRule);
        return this;
    };

    link.sourceXLocation = Factory.handler("xlocation1");
    link.sourceYLocation = Factory.handler("ylocation1");
    link.targetXLocation = Factory.handler("xlocation2");
    link.targetYLocation = Factory.handler("ylocation2");

    sourceElement.childAs(name, link, LinkRule);
    targetElement.childAs(name, link, LinkRule);
    return link;
}
