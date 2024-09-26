import { Text }            from "@/Node/Nake/Text";
import { Enter }           from "@/Node/SDNode/Enter";
import { Aside }           from "@/Rule/Aside";
import { BaseArray }       from "@/Node/Array/BaseArray";
import { GetterAndSetter } from "@/Node/Common";

let indexID = 0;

function IndexRule(parent, child) {
    child.member.set("indexLength", parent.length());
    child.member.set("indexStart", parent.start());
    function aside(indexed, attach, location, fontSize, gap) {
        attach.fontSize(fontSize);
        const rule = Aside(location + "c", gap);
        rule(indexed, attach);
    }
    if (child.member.hasChanged("indexLength") ||
        child.member.hasChanged("indexStart") ||
        child.member.hasChanged("location") ||
        child.member.hasChanged("fontSize") ||
        child.member.hasChanged("indexGap")) {
        child.member.flush("indexLength");
        child.member.flush("indexStart");
        const location = child.member.getAndFlush("location");
        const dict = {};
        const elements = child.member.getAndFlush("elements");
        const fontSize = child.member.getAndFlush("fontSize");
        const gap = child.member.getAndFlush("indexGap");
        for (let i = 0; i < elements.length; i++)
            dict[elements[i].intValue()] = elements[i];
        for (let i = parent.start(); i <= parent.end(); i++) {
            const indexed = parent.element(i);
            if (!dict[i]) {
                const attach = new Text(child, i).fontSize(fontSize);
                attach.onEnter(Enter.Ordinary(child));
                elements.push(attach);
                child.children.push(attach);
                child.tryMove(attach, () => {
                    aside(indexed, attach, location, fontSize, gap);
                });
            } else {
                const attach = dict[i];
                child.tryMove(attach, () => {
                    aside(indexed, attach, location, fontSize, gap);
                })
                delete dict[i];
            }
        }
        for (let idx in dict) {
            const attach = dict[idx];
            child.children.erase(attach);
            elements.splice(elements.indexOf(attach), 1);
            attach.opacity(0).remove();
        }
    }
}

export function Index(parent, location = "t", fontSize = 15, gap = 3) {
    const index = new BaseArray(parent);

    index.attachUpdate(() => {
        index.triggerRule();
    })

    index.member.new("indexLength", undefined);
    index.member.new("indexStart", undefined);
    index.member.new("location", location);
    index.member.new("fontSize", fontSize);
    index.member.new("indexGap", gap);

    index.location = GetterAndSetter("location", "set");
    index.fontSize = GetterAndSetter("fontSize", "setByDqual");
    index.gap = GetterAndSetter("indexGap", "setByDqual");

    parent.childAs(`index_${++indexID}`, index, IndexRule);

    return index;
}