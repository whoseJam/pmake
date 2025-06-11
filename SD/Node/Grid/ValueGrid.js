import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { Grid } from "@/Node/Grid/Grid";

export class ValueGrid extends Grid {
    constructor(target) {
        super(target);

        this.type("ValueGrid");

        this.uneffect("graph");
        this.effect("graph", () => {
            const x = this.x();
            const y = this.y();
            const elementWidth = this.elementWidth();
            const elementHeight = this.elementHeight();
            const elements = this.vars.elements;
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
        });
    }
}

Object.assign(ValueGrid.prototype, {
    insert(i, j, value) {
        const element = value;
        element.onEnterDefault(EN.appear("elements"));
        element.onExitDefault(EX.fade());
        this.__insert(i, j, element);
        return this;
    },
});
