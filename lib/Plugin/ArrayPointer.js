import { Line } from "../Structure/Basic/Line";
import { Text } from "../Structure/Basic/Text";

export function EnableArrayPointer(array) {
    
    array.set("pointers", []);

    array.makePointer = makePointer;
    array.movePointer = movePointer;
    array.wherePointer = wherePointer;
    array.removePointer = removePointer;
    array.pointer = pointer;

    return array;
}

function pointer(name) {
    let pointers = this.get("pointers");
    for (let i = 0; i < pointers.length; i++) {
        if (pointers[i].name === name) {
            return pointers[i];
        }
    }
    return null;
}

function makePointer(name, priority = 1) {
    let line = Line(this)
        .x1(0).y1(100)
        .x2(0).y2(0)
        .markerEnd("arrow");
    line.priority = priority;
    line.pos = this.start();
    line.name = name;
    if (name !== undefined) {
        let label = Text(line, name).fontSize(20);
        let rule = () => {
            label.cx(line.cx()).y(line.my());
        }
        line.children.push(label, rule);
    }
    let pointers = this.get("pointers");
    pointers.push(line);
    this.children.push(line, () => { rule(this); });
    return this;
}

function wherePointer(name) {
    let pointers = this.get("pointers");
    for (let i = 0; i < pointers.length; i++) {
        if (pointers[i].name === name) {
            return pointers[i].pos;
        }
    }
    return null;
}

function removePointer(name) {
    let pointers = this.get("pointers");
    for (let i = 0; i < pointers.length; i++) {
        if (pointers[i].name === name) {
            this.children.remove(pointers[i]);
            pointers.splice(i, 1);
        }
    }
}

function movePointer(name, at) {
    let pointers = this.get("pointers");
    for (let i = 0; i < pointers.length; i++) {
        if (pointers[i].name === name) {
            pointers[i].pos = at;
        }
    }
    rule(this);
}

function rule(array) {
    let pointers = array.get("pointers");
    pointers.sort((a, b) => {
        if (a.pos !== b.pos) return a.pos - b.pos;
        return a.priority - b.priority;
    });
    // for (let i = 0; i < pointers.length; i++) {
    //     console.log("pointer=", pointers[i].name, pointers[i].pos, pointers[i].priority);
    // }
    let len = pointers.length;
    for (let l = 0, r; l < len; l = r + 1) {
        r = l;
        while (r + 1 < len && pointers[l].pos === pointers[r+1].pos) r++;
        let pos = pointers[l].pos;
        if (pos > array.end() || pos < array.start()) {
            for (let i = l; i <= r; i++)
                pointers[i].opacity(0);
            continue;
        }
        let elem = array.element(pos);
        let num = r - l + 1;
        let gap = (elem.mx() - elem.x()) / (num + 1);
        let cur = elem.x();
        for (let i = l; i <= r; i++) {
            cur += gap;
            pointers[i].x1(cur).x2(cur).opacity(1);
            pointers[i].y2(elem.my() + 10);
            if (pointers[i].length) {
                pointers[i].y1(elem.my() + 10 + pointers[i].length);
            } else pointers[i].y1(elem.my() + 40);
        }
    }
}