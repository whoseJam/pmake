import { BaseCurve }            from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";

import { Vector } from "@/Math/Vector";

export function FixedPointCurve(parent) {
    BaseCurve.call(this, parent);

    this.type("FixedPointCurve");

    this.member.new("fixedPoint", undefined);
    this.member.new("r", 60);

    this.member.new("path-calculator", update);

    return this;
}

FixedPointCurve.prototype = {
    ...BaseCurve.prototype
};

FixedPointCurve.prototype.fixedPoint = SDNode.OrdinaryGSet("fixedPoint", "set");

function update() {
    const v1 = this.source();
    const v2 = this.target();
    const vc = this.member.get("fixedPoint");
    const r = this.member.get("r");
    if (!vc) {
        return `M ${v1[0]}, ${v1[1]} L ${v2[0]}, ${v2[1]}`;
    }
    const dirVcV1 = Vector.norm(Vector.sub(v1, vc));
    const p1 = Vector.add(vc, Vector.numberMul(dirVcV1, r));
    const dirVcV2 = Vector.norm(Vector.sub(v2, vc));
    const p2 = Vector.add(vc, Vector.numberMul(dirVcV2, r));
    return `M ${v1[0]}, ${v1[1]} L ${p1[0]}, ${p1[1]} Q ${vc[0]}, ${vc[1]}, ${p2[0]}, ${p2[1]} L ${v2[0]}, ${v2[1]}`;
}