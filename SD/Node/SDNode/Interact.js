import { D3ToNake } from "@/Utility/Cast";

export function Interact(parent) {
    this.parent = parent;
    this.onClickCallback = undefined;
    this.onDblClickCallback = undefined;
    this.clickTimeout = undefined;

    return this;
}

Interact.prototype.onClick = function(callback) {
    const nake = D3ToNake(this.parent.d3layer.self());
    nake.removeEventListener("click", this.onClickCallback);
    this.onClickCallback = () => {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = setTimeout(() => {
            callback(this.parent);
        }, 200);
    };
    nake.addEventListener("click", this.onClickCallback);
}

Interact.prototype.onDblClick = function(callback) {
    const nake = D3ToNake(this.parent.d3layer.self());
    nake.removeEventListener("dblclick", this.onDblClickCallback);
    this.onDblClickCallback = () => {
        clearTimeout(this.clickTimeout);
        callback(this.parent);
    };
    nake.addEventListener("dblclick", this.onDblClickCallback);
}

Interact.prototype.drag = function(type) {
    if (type) {
        const nake = D3ToNake(this.parent.d3layer.self());
        let startX = 0, startY = 0;
        Snap(nake).drag(function(dx, dy) {
            const transform = `matrix(1,0,0,1,${dx/window.RATE + startX},${dy/window.RATE + startY})`;
            nake.setAttribute("transform", transform);
        }, function() {
            startX = nake.transform.baseVal.getItem(0).matrix.e;
            startY = nake.transform.baseVal.getItem(0).matrix.f;
        });
    }
    return this;
}