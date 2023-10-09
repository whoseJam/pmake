import * as d3 from "d3";

export function Basis() {
    return d3.line()
        .x((d) => { return d.x; })
        .y((d) => { return d.y; })
        .curve(d3.curveBasis);
}

export function BasisClosed() {
    return d3.line()
        .x((d) => { return d.x; })
        .y((d) => { return d.y; })
        .curve(d3.curveBasisClosed);
}

export function BasisOpen() {
    return d3.line()
        .x((d) => { return d.x; })
        .y((d) => { return d.y; })
        .curve(d3.curveBasisOpen);
}

export function Linear() {
    return d3.line()
        .x((d) => { return d.x; })
        .y((d) => { return d.y; })
        .curve(d3.curveLinear);
}