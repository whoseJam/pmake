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
        elements: [],
    });

    this._.BASE_GRID = true;
}

BaseGrid.prototype = {
    ...SDNode.prototype,
    startN: Factory.handler("startN"),
    startM: Factory.handler("startM"),
    endN: function () {
        return this.startN() + this.n() - 1;
    },
    endM: function (idx) {
        if (idx === undefined) return this.startM() + this.m() - 1;
        const elements = this.vars.elements;
        return this.startM() + elements[this.idxN(idx)].length - 1;
    },
    idxN: function (idx) {
        return idx - this.startN();
    },
    idxM: function (idx) {
        return idx - this.startM();
    },
    n: function (n) {
        let on = this.vars.n;
        if (n === undefined) return on;
        while (on < n) {
            this.pushRow();
            on++;
        }
        while (on > n) {
            this.popRow();
            on--;
        }
        return this;
    },
    m: function (m) {
        let om = this.vars.m;
        if (m === undefined) return om;
        while (om < m) {
            this.pushCol();
            om++;
        }
        while (om > m) {
            this.popCol();
            om--;
        }
        return this;
    },
    insertByBaseGrid: function (rowId, colId, element) {
        const ri = this.idxN(rowId);
        const rj = this.idxM(colId);
        const elements = this.vars.elements;
        element.triggerEnter(this, () => {
            while (elements.length <= ri) elements.push([]);
            elements[ri].splice(rj, 0, element);
            this.childAs(element);
            this.vars.n = elements.length;
            this.vars.m = Math.max(elements[ri].length, this.vars.m);
        });
        return this;
    },
    eraseByBaseGrid: function (rowId, colId) {
        const element = this.element(rowId, colId);
        const ri = this.idxN(rowId);
        const rj = this.idxM(colId);
        const elements = this.vars.elements;
        elements[ri].splice(rj, 1);
        this.eraseChild(element);
        let m = 0;
        for (let i = 0; i < elements.length; i++) m = Math.max(m, elements[i].length);
        this.vars.n = elements.length;
        this.vars.m = m;
        return this;
    },
    pushCol(rows) {
        const l = this.startN();
        const r = rows === undefined ? this.endN() : l + rows - 1;
        for (let i = l; i <= r; i++) this.insert(i, this.endM(i) + 1, null);
        if (l > r) this.vars.m++;
        return this;
    },
    pushRow(cols) {
        let n = this.endN() + 1;
        let l = this.startM();
        let r = cols === undefined ? this.endM() : l + cols - 1;
        for (let j = l; j <= r; j++) this.insert(n, j, null);
        if (l > r) {
            this.vars.n++;
            this.vars.elements.push([]);
        }
        return this;
    },
    element: function (rowId, colId) {
        [rowId, colId] = [this.idxN(rowId), this.idxM(colId)];
        if (0 <= rowId && rowId < this.vars.elements.length) {
            if (0 <= colId && colId < this.vars.elements[rowId].length) {
                return this.vars.elements[rowId][colId];
            }
            ErrorLauncher.outOfRangeError(rowId + this.startN(), colId + this.startM());
        }
        ErrorLauncher.outOfRangeError(rowId + this.startN(), colId + this.startM());
    },
    value: function () {
        const args = arguments;
        switch (args.length) {
            case 2: {
                const element = this.element(args[0], args[1]);
                return element.value();
            }
            case 3: {
                const element = this.element(args[0], args[1]);
                element.value(args[2]);
                return this;
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    intValue: function (rowId, colId) {
        const value = this.value(rowId, colId);
        if (!value) return 0;
        if (!value.text) ErrorLauncher.invalidInvoke("intValue");
        return +value.text();
    },
    opacity: function () {
        const args = arguments;
        switch (args.length) {
            case 0:
                return SDNode.prototype.opacity.call(this);
            case 1:
                return SDNode.prototype.opacity.call(this, args[1]);
            case 2: {
                const element = this.element(args[0], args[1]);
                return element.opacity();
            }
            case 3: {
                const element = this.element(args[0], args[1]);
                element.opacity(args[2]);
                return this;
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    color: function () {
        const args = arguments;
        switch (args.length) {
            case 1:
                this.forEachElement(element => element.color(args[0]));
                return this;
            case 2: {
                const element = this.element(args[0], args[1]);
                return element.color();
            }
            case 3: {
                const element = this.element(args[0], args[1]);
                element.color(args[2]);
                return this;
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    forEachElement: function (callback) {
        this.vars.elements.forEach((row, rowId) => {
            row.forEach((element, colId) => {
                callback(element, rowId + this.startN(), colId + this.startM());
            });
        });
        return this;
    },
};
