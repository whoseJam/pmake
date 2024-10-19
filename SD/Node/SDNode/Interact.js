import { Dom } from "@/Dom/Dom";
import { Check } from "@/Utility/Check";

export function Interact(parent) {
    this.parent = parent;
    
    this.onClickCb = undefined;
    this.onDblClickCb = undefined;
    this.clickTimeout = undefined;
}

Interact.prototype.onClick = function(callback) {
    const nake = this.parent._.layer.nake();
    Dom.removeEventListener(nake, "click", this.onClickCb);
    this.onClickCb = () => {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = setTimeout(() => {
            callback(this.parent);
        }, 200);
    };
    Dom.addEventListener(nake, "click", this.onClickCb);
    return this;
}

Interact.prototype.onDblClick = function(callback) {
    const nake = this.parent._.layer.nake();
    Dom.removeEventListener(nake, "dblclick", this.onDblClickCb);
    this.onDblClickCb = () => {
        clearTimeout(this.clickTimeout);
        callback(this.parent);
    };
    Dom.addEventListener(nake, "dblclick", this.onDblClickCb);
    return this;
}

Interact.prototype.drag = function(arg) {
    const nake = this.parent._.layer.nake();
    if (Check.isFalseType(arg)) {
        Snap(nake).undrag();
        return this;
    }
    let currentX = 0;
    let currentY = 0;
    let lastDx = 0;
    let lastDy = 0;
    Snap(nake).drag(function(dx, dy) {
        let screenDx = (dx - lastDx) / window.RATE;
        let screenDy = (dy - lastDy) / window.RATE;
        console.log("rate=", window.RATE);
        if (typeof(arg) === "function") {
            [screenDx, screenDy] = arg(screenDx, screenDy);
        }
        lastDx = dx;
        lastDy = dy;
        currentX += screenDx;
        currentY += screenDy;
        const transform = `matrix(1,0,0,1,${currentX},${currentY})`;
        nake.setAttribute("transform", transform);
    }, function() {
        if (nake.transform.baseVal.length > 0) {
            currentX = nake.transform.baseVal.getItem(0).matrix.e;
            currentY = nake.transform.baseVal.getItem(0).matrix.f;
            lastDx = 0;
            lastDy = 0;
        }
    });
    return this;
}