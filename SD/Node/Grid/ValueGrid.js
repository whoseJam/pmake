import { Grid } from "@/Node/Grid/Grid";

export function ValueGrid(parent) {
    Grid.call(this, parent);

    this.type("ValueGrid");
}

ValueGrid.prototype = {
    ...Grid.prototype
};

ValueGrid.prototype.updateList = [
    ...ValueGrid.prototype.updateList.slice(0, -1),
    update
];

ValueGrid.prototype.insert = function(i, j, value) {
    const element = value;
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this);
        element.opacity(1);
    };
    this.insertByBaseGrid(i, j, element);
    return this;
}


function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements")) {
        const x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        for (let i = 0; i < elements.length; i++) { 
            if (!elements[i]) continue;
            for (let j = 0; j < elements[i].length; j++) {
                const element = elements[i][j];
                this.tryMove(element, () => {
                    element.cx(x + j * elementWidth + elementWidth / 2);
                    element.cy(y + i * elementHeight + elementHeight / 2);
                });
            }
        }
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
    }
}