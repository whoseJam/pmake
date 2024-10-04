import { Line } from "@/Node/Nake/Line";

import { svg } from "@/Interact/RootSvg";

import { trim } from "@/Utility/Trim";

let id = 0;

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

    sourceElement.childAs(`link_${++id}`, link, LinkRule);
    targetElement.childAs(`link_${++id}`, link, LinkRule);
    return link;
}