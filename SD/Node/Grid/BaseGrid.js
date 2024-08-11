import { SDNode }               from "@/Node/SDNode";
import { GetterAndSetter } from "@/Node/Common";

export function BaseGrid(parent) {
    SDNode.call(this, parent);

    this.member.new("n", 0);
    this.member.new("m", 0);
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("startN", 0);
    this.member.new("startM", 0);
    this.member.new("elements", []);

    this._.BASE_GRID = true;

    return this;
}

BaseGrid.prototype = {
    ...SDNode.prototype
};

BaseGrid.prototype.startN = GetterAndSetter("startN", "set");
BaseGrid.prototype.startM = GetterAndSetter("startM", "set");

BaseGrid.prototype.endN = function() {
    return this.startN() + this.n() - 1;
}

BaseGrid.prototype.endM = function(idx) {
    if (idx === undefined) return this.startM() + this.m() - 1;
    let elems = this.member.get("elements");
    return this.startM() + elems[this.idxN(idx)].length - 1;
}

BaseGrid.prototype.idxN = function(idx) {
    return idx - this.startN();
}

BaseGrid.prototype.idxM = function(idx) {
    return idx - this.startM();
}

BaseGrid.prototype.n = function(n) {
    let on = this.member.get("n");
    if (n === undefined) return on;
    while (on < n) { this.pushRow(); on++; }
    while (on > n) { this.popRow(); on--; }
    return this;
}

BaseGrid.prototype.m = function(m) {
    let om = this.member.get("m");
    if (m === undefined) return om;
    while (om < m) { this.pushCol(); om++; }
    while (om > m) { this.popCol(); om--; }
    return this;
}

BaseGrid.prototype.getM = function(idx) {
    return this.endM() - this.startM() + 1;
}

BaseGrid.prototype.insertByBaseGrid = function(i, j, element) {
    const ri = this.idxN(i);
    const rj = this.idxM(j);
    const elements = this.member.get("elements");
    while (elements.length <= ri) {
        elements.push([]);
    }
    elements[ri].splice(rj, 0, element);
    this.children.push(element);
    this.member.set("n", Math.max(ri + 1, this.member.get("n")));
    this.member.set("m", Math.max(rj + 1, this.member.get("m")));
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseGrid.prototype.eraseByBaseGrid = function(i, j) {
    const element = this.element(i, j);
    const ri = this.idxN(i);
    const rj = this.idxM(j);
    const elements = this.member.get("elements");
    elements[ri].splice(rj, 1);
    this.children.erase(element);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseGrid.prototype.pushCol = function(rows) {
    let l = this.startN();
    let r = (rows === undefined) ? this.endN() : l + rows - 1;
    for (let i = l; i <= r; i++) {
        this.insert(i, this.endM(i) + 1, null);
    }
    if (l > r) { this._.m++; }
    return this;
}

BaseGrid.prototype.pushRow = function(cols) {
    let n = this.endN() + 1;
    let l = this.startM();
    let r = (cols === undefined) ? this.endM() : l + cols - 1;
    for (let j = l; j <= r; j++)
        this.insert(n, j, null);
    if (l > r) {
        this.member.set("n", this.member.get("n") + 1);
        this.member.get("elements").push([]);
    }
    return this;
}

BaseGrid.prototype.element = function(i, j) {
    let elems = this.member.get("elements");
    return elems[this.idxN(i)][this.idxM(j)];
}

BaseGrid.prototype.value = function(arg0, arg1, arg2) {
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

BaseGrid.prototype.intValue = function(i, j) {
    const value = this.value(i, j);
    if (!value) {
        return 0;
    }
    if ("text" in value) {
        return +value.text();
    }
    throw new Error(`Element ${i} ${j} Cannot Cast To Int`);
}

BaseGrid.prototype.opacity = function(arg0, arg1, arg2) {
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

BaseGrid.prototype.color = function(arg0, arg1, arg2) {
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
