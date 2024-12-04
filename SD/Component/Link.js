import { Line }   from "@/Node/Nake/Line";
import { SDNode } from "@/Node/SDNode";

import { svg } from "@/Interact/RootSvg";

import { trim } from "@/Utility/Trim";

let linkID = 0;

function LinkRule(parent, child) {
    child.update();
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

    link.beforeUpdate(() => {
        console.log("link update");
        const element1 = link.member.getAndFlush("linkElement1");
        const element2 = link.member.getAndFlush("linkElement2");
        const xlocation1 = link.member.getAndFlush("xlocation1");
        const ylocation1 = link.member.getAndFlush("ylocation1");
        const xlocation2 = link.member.getAndFlush("xlocation2");
        const ylocation2 = link.member.getAndFlush("ylocation2");
        link.source(element1[xlocation1](), element1[ylocation1]());
        link.target(element2[xlocation2](), element2[ylocation2]());
    });

    link.afterUpdate(() => {
        const element1 = link.member.getAndFlush("linkElement1");
        const element2 = link.member.getAndFlush("linkElement2");
        trim(link, element1, element2);
        link.updateList.forEach(callback => {
            callback.call(link);
        });
    });

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

    link.sourceXLocation = SDNode.ordinaryGetterAndSetter("xlocation1", "set");
    link.sourceYLocation = SDNode.ordinaryGetterAndSetter("ylocation1", "set");
    link.targetXLocation = SDNode.ordinaryGetterAndSetter("xlocation2", "set");
    link.targetYLocation = SDNode.ordinaryGetterAndSetter("ylocation2", "set");

    sourceElement.childAs(name, link, LinkRule);
    targetElement.childAs(name, link, LinkRule);
    console.log("linkCreated!!!");
    return link;
}