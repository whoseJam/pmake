import { SDNode } from "@/Node/SDNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseGrid(parent) {
    SDNode.call(this, parent);

    this.vars.merge({
        n: 0,
        m: 0,
        x: 0,
        y: 0,
        startN: 0,
        startM: 0,
        elements: []
    });

    this._.BASE_GRID = true;
}

BaseGrid.prototype = {
    ...SDNode.prototype
};

BaseGrid.prototype.startN = Factory.handler("startN");
BaseGrid.prototype.startM = Factory.handler("startM");

BaseGrid.prototype.endN = function () {
    return this.startN() + this.n() - 1;
}

BaseGrid.prototype.endM = function (idx) {
    if (idx === undefined) return this.startM() + this.m() - 1;
    const elements = this.vars.elements;
    return this.startM() + elements[this.idxN(idx)].length - 1;
}

BaseGrid.prototype.idxN = function (idx) {
    return idx - this.startN();
}

BaseGrid.prototype.idxM = function (idx) {
    return idx - this.startM();
}

BaseGrid.prototype.n = function (n) {
    let on = this.vars.n;
    if (n === undefined) return on;
    while (on < n) { this.pushRow(); on++; }
    while (on > n) { this.popRow(); on--; }
    return this;
}

BaseGrid.prototype.m = function (m) {
    let om = this.vars.m;
    if (m === undefined) return om;
    while (om < m) { this.pushCol(); om++; }
    while (om > m) { this.popCol(); om--; }
    return this;
}

BaseGrid.prototype.getM = function (idx) {
    return this.endM() - this.startM() + 1;
}

BaseGrid.prototype.insertByBaseGrid = function (i, j, element) {
    const ri = this.idxN(i);
    const rj = this.idxM(j);
    const elements = this.vars.elements;
    element.triggerEnter(this, () => {
        while (elements.length <= ri) elements.push([]);
        elements[ri].splice(rj, 0, element);
        this.childAs(element);
        this.vars.n = elements.length;
        this.vars.m = Math.max(elements[ri].length, this.vars.m);
    });
    return this;
}

BaseGrid.prototype.eraseByBaseGrid = function (i, j) {
    const element = this.element(i, j);
    const ri = this.idxN(i);
    const rj = this.idxM(j);
    const elements = this.vars.elements;
    elements[ri].splice(rj, 1);
    this.eraseChild(element);
    let m = 0;
    for (let i = 0; i < elements.length; i++) m = Math.max(m, elements[i].length);
    this.vars.n = elements.length;
    this.vars.m = m;
    return this;
}

BaseGrid.prototype.pushCol = function (rows) {
    let l = this.startN();
    let r = (rows === undefined) ? this.endN() : l + rows - 1;
    for (let i = l; i <= r; i++) {
        this.insert(i, this.endM(i) + 1, null);
    }
    if (l > r) { this.vars.m++; }
    return this;
}

BaseGrid.prototype.pushRow = function (cols) {
    let n = this.endN() + 1;
    let l = this.startM();
    let r = (cols === undefined) ? this.endM() : l + cols - 1;
    for (let j = l; j <= r; j++)
        this.insert(n, j, null);
    if (l > r) {
        this.vars.n++;
        this.vars.elements.push([]);
    }
    return this;
}

BaseGrid.prototype.element = function (i, j) {
    return this.vars.elements[this.idxN(i)][this.idxM(j)];
}

BaseGrid.prototype.value = function (arg0, arg1, arg2) {
    if (arguments.length === 2) {
        const element = this.element(arg0, arg1);
        if (!element) {
            throw new Error(`Element ${arg0} ${arg1} Do Not Exists`);
        }
        return element.value();
    }
    if (arguments.length === 3) {
        const element = this.element(arg0, arg1);
        if (!element) {
            throw new Error(`Element ${arg0} ${arg1} Do Not Exists`);
        }
        element.value(arg2);
        return this;
    }
    console.log(arguments);
    throw new Error("Invalid Arguments");
}

BaseGrid.prototype.intValue = function (i, j) {
    const value = this.value(i, j);
    if (!value) return 0;
    if (!value.text) ErrorLauncher.invalidInvoke("intValue");
    return +value.text();
}

BaseGrid.prototype.opacity = function (arg0, arg1, arg2) {
    if (arguments.length === 0) {
        return SDNode.prototype.opacity.call(this);
    }
    if (arguments.length === 1) {
        SDNode.prototype.opacity.call(this, arg0);
        return this;
    }
    if (arguments.length === 2) {
        const element = this.element(arg0, arg1);
        if (!element) {
            throw new Error(`Element ${arg0} ${arg1} Do Not Exists`);
        }
        return element.opacity();
    }
    if (arguments.length === 2) {
        const element = this.element(arg0, arg1);
        if (!element) {
            throw new Error(`Element ${arg0} ${arg1} Do Not Exists`);
        }
        element.opacity(arg2);
        return this;
    }
    console.log(arguments);
    throw new Error("Invalid Arguments");
}

BaseGrid.prototype.color = function (arg0, arg1, arg2) {
    if (arguments.length === 1) {
        const elements = this.member.get("elements");
        elements.forEach(row => {
            row.forEach(col => {
                col.color(arg0);
            })
        });
        return this;
    }
    if (arguments.length === 2) {
        const element = this.element(arg0, arg1);
        if (!element) {
            throw new Error(`Element ${arg0} ${arg1} Do Not Exists`);
        }
        return element.color();
    }
    if (arguments.length === 3) {
        const element = this.element(arg0, arg1);
        if (!element) {
            throw new Error(`Element ${arg0} ${arg1} Do Not Exists`);
        }
        element.color(arg2);
        return this;
    }
    console.log(arguments);
    throw new Error("无效的参数");
}


BaseGrid.prototype.forEachElement = function (callback) {
    const elements = this.vars.elements;
    elements.forEach((row, rowId) => {
        row.forEach((col, colId) => {
            callback(col, rowId + this.startN(), colId + this.startM());
        });
    });
    return this;
}