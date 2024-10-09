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
        return;
    }
    let startX = 0;
    let startY = 0;
    Snap(nake).drag(function(dx, dy) {
        if (typeof(arg) === "function") {
            [dx, dy] = arg(dx, dy);
        }
        const x = dx / window.RATE + startX;
        const y = dy / window.RATE + startY;
        const transform = `matrix(1,0,0,1,${x},${y})`;
        nake.setAttribute("transform", transform);
    }, function() {
        if (nake.transform.baseVal.length > 0) {
            startX = nake.transform.baseVal.getItem(0).matrix.e;
            startY = nake.transform.baseVal.getItem(0).matrix.f;
        }
    });
    return this;
}