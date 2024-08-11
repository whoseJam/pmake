import { D3ToNake } from "@/Utility/Cast";

export function OnClick(callback) {
    const nake = D3ToNake(this.d3layer.d3);
    nake.removeEventListener("click", this.member.get("clickHandle"));
    this.member.setAndFlush("clickHandle", () => {
        clearTimeout(this.member.get("clickTimeoutObject"));
        this.member.set("clickTimeoutObject", setTimeout(() => {
            callback(this);
        }, 200));
    });
    nake.addEventListener("click", this.member.get("clickHandle"));
}

export function OnDblClick(callback) {
    const nake = D3ToNake(this.d3layer.d3);
    nake.removeEventListener("dblclick", this.member.get("dblClickHandle"));
    this.member.setAndFlush("dblClickHandle", () => {
        clearTimeout(this.member.get("clickTimeoutObject"));
        callback(this);
    });
    nake.addEventListener("dblclick", this.member.get("dblClickHandle"));
}

export function Drag(type) {
    if (type) {
        const nake = D3ToNake(this.d3layer.d3);
        Snap(nake).drag();
    }
    return this;
}