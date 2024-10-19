import { Line } from "@/Node/Nake/Line";

import { svg } from "@/Interact/RootSvg";

import { trim } from "@/Utility/Trim";
import { SDNode } from "@/Node/SDNode";

let linkID = 0;

function LinkRule(parent, child) {
    const element1 = child.member.getAndFlush("linkElement1");
    const element2 = child.member.getAndFlush("linkElement2");
    const xlocation1 = child.member.getAndFlush("xlocation1");
    const ylocation1 = child.member.getAndFlush("ylocation1");
    const xlocation2 = child.member.getAndFlush("xlocation2");
    const ylocation2 = child.member.getAndFlush("ylocation2");
    child.source(element1[xlocation1](), element1[ylocation1]());
    child.target(element2[xlocation2](), element2[ylocation2]());
    trim(child, element1, element2);
}

export function Link(sourceElement, targetElement, linkType = Line, sourceXLocation = "cx", sourceYLocation = "cy", targetXLocation = "cx", targetYLocation = "cy", callback = () => {}) {
    const link = new linkType(svg());
    const name = `link_${++linkID}`;
    callback(link);

    link.member.new("linkElement1", sourceElement);
    link.member.new("linkElement2", targetElement);
    link.member.new("xlocation1", sourceXLocation);
    link.member.new("ylocation1", sourceYLocation);
    link.member.new("xlocation2", targetXLocation);
    link.member.new("ylocation2", targetYLocation);

    link.attachUpdate(() => {
        if (link.member.hasChanged("linkElement1") ||
            link.member.hasChanged("linkElement2") ||
            link.member.hasChanged("xlocation1") ||
            link.member.hasChanged("ylocation1") ||
            link.member.hasChanged("xlocation2") || 
            link.member.hasChanged("ylocation2")) {
            link.triggerRule();
        }
    })

    link.sourceElement = function(element) {
        if (element === undefined) return this.member.get("linkElement1");
        this.member.get("linkElement1").eraseChild(name);
        this.member.set("linkElement1", element);
        element.childAs(name, this, LinkRule);
        return this;
    }

    link.targetElement = function(element) {
        if (element === undefined) return this.member.get("linkElement2");
        this.member.get("linkElement2").eraseChild(name);
        this.member.set("linkElement2", element);
        element.childAs(name, this, LinkRule);
        return this;
    }

    link.sourceXLocation = SDNode.OrdinaryGSet("xlocation1", "set");
    link.sourceYLocation = SDNode.OrdinaryGSet("ylocation1", "set");
    link.targetXLocation = SDNode.OrdinaryGSet("xlocation2", "set");
    link.targetYLocation = SDNode.OrdinaryGSet("ylocation2", "set");

    sourceElement.childAs(name, link, LinkRule);
    targetElement.childAs(name, link, LinkRule);
    return link;
}