import { svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

type PathOperator = {
    operator: string;
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    rx?: number;
    ry?: number;
    xAxisRotation?: number;
    largeArcFlag?: number;
    sweepFlag?: number;
    r?: number;
};
type PathOperators = Array<PathOperator>;
function path2curve(path, path2) {
    var pth = !path2 && paths(path);
    if (!path2 && pth.curve) {
        return pathClone(pth.curve);
    }
    var p = pathToAbsolute(path),
        p2 = path2 && pathToAbsolute(path2),
        attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
        attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
        processPath = function (path, d, pcom) {
            var nx, ny;
            if (!path) {
                return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
            }
            !(path[0] in { T: 1, Q: 1 }) && (d.qx = d.qy = null);
            switch (path[0]) {
                case "M":
                    d.X = path[1];
                    d.Y = path[2];
                    break;
                case "A":
                    path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
                    break;
                case "S":
                    if (pcom == "C" || pcom == "S") {
                        // In "S" case we have to take into account, if the previous command is C/S.
                        nx = d.x * 2 - d.bx; // And reflect the previous
                        ny = d.y * 2 - d.by; // command's control point relative to the current point.
                    } else {
                        // or some else or nothing
                        nx = d.x;
                        ny = d.y;
                    }
                    path = ["C", nx, ny].concat(path.slice(1));
                    break;
                case "T":
                    if (pcom == "Q" || pcom == "T") {
                        // In "T" case we have to take into account, if the previous command is Q/T.
                        d.qx = d.x * 2 - d.qx; // And make a reflection similar
                        d.qy = d.y * 2 - d.qy; // to case "S".
                    } else {
                        // or something else or nothing
                        d.qx = d.x;
                        d.qy = d.y;
                    }
                    path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                    break;
                case "Q":
                    d.qx = path[1];
                    d.qy = path[2];
                    path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                    break;
                case "L":
                    path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
                    break;
                case "H":
                    path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
                    break;
                case "V":
                    path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
                    break;
                case "Z":
                    path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
                    break;
            }
            return path;
        },
        fixArc = function (pp, i) {
            if (pp[i].length > 7) {
                pp[i].shift();
                var pi = pp[i];
                while (pi.length) {
                    pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                    p2 && (pcoms2[i] = "A"); // the same as above
                    pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                }
                pp.splice(i, 1);
                ii = mmax(p.length, (p2 && p2.length) || 0);
            }
        },
        fixM = function (path1, path2, a1, a2, i) {
            if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                path2.splice(i, 0, ["M", a2.x, a2.y]);
                a1.bx = 0;
                a1.by = 0;
                a1.x = path1[i][1];
                a1.y = path1[i][2];
                ii = mmax(p.length, (p2 && p2.length) || 0);
            }
        },
        pcoms1 = [], // path commands of original path p
        pcoms2 = [], // path commands of original path p2
        pfirst = "", // temporary holder for original path command
        pcom = ""; // holder for previous path command of original path
    for (var i = 0, ii = mmax(p.length, (p2 && p2.length) || 0); i < ii; i++) {
        p[i] && (pfirst = p[i][0]); // save current path command

        if (pfirst != "C") {
            // C is not saved yet, because it may be result of conversion
            pcoms1[i] = pfirst; // Save current path command
            i && (pcom = pcoms1[i - 1]); // Get previous path command pcom
        }
        p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

        if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
        // which may produce multiple C:s
        // so we have to make sure that C is also C in original path

        fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

        if (p2) {
            // the same procedures is done to p2
            p2[i] && (pfirst = p2[i][0]);
            if (pfirst != "C") {
                pcoms2[i] = pfirst;
                i && (pcom = pcoms2[i - 1]);
            }
            p2[i] = processPath(p2[i], attrs2, pcom);

            if (pcoms2[i] != "A" && pfirst == "C") {
                pcoms2[i] = "C";
            }

            fixArc(p2, i);
        }
        fixM(p, p2, attrs, attrs2, i);
        fixM(p2, p, attrs2, attrs, i);
        var seg = p[i],
            seg2 = p2 && p2[i],
            seglen = seg.length,
            seg2len = p2 && seg2.length;
        attrs.x = seg[seglen - 2];
        attrs.y = seg[seglen - 1];
        attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
        attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
        attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
        attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
        attrs2.x = p2 && seg2[seg2len - 2];
        attrs2.y = p2 && seg2[seg2len - 1];
    }
    if (!p2) {
        pth.curve = pathClone(p);
    }
    return p2 ? [p, p2] : p;
}

export class PathEngine {
    static pathSVG = undefined;
    static init() {
        this.pathSVG = RenderNode.createRenderNodeWithoutAction(undefined, svg(), "path");
        this.pathSVG.setAttribute("opacity", 0);
    }
    static l2c(x1: number, y1: number, x2: number, y2: number) {
        return [x1, y1, x2, y2, x2, y2];
    }
    static q2c(x1: number, y1: number, ax: number, ay: number, x2: number, y2: number) {
        const _13 = 1 / 3;
        const _23 = 2 / 3;
        return [_13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2];
    }
    static pathStrToBox(d: string) {
        this.pathSVG.setAttribute("d", d);
        return this.pathSVG.element().getBBox();
    }
    static pathStrToOperators(d: string) {
        let i = 0;
        const alphabeta = (char: string) => ("A" <= char && char <= "Z") || ("a" <= char && char <= "z");
        const valid = (char: string) => alphabeta(char) || ("0" <= char && char <= "9") || char === "." || char === "-";
        const read = () => {
            let ans = "";
            while (i < d.length && !valid(d[i])) i++;
            while (i < d.length && valid(d[i])) {
                if (ans.length > 0 && alphabeta(ans[0]) !== alphabeta(d[i])) break;
                if (ans.length > 0 && alphabeta(ans[0])) break;
                ans = ans + d[i++];
            }
            if (alphabeta(ans[0])) return ans;
            return +ans;
        };
        const operators = [];
        while (i < d.length) {
            const operator = read();
            if (i >= d.length) break;
            switch (operator) {
                case "M": {
                    const [x, y] = [read(), read()];
                    operators.push({ operator, x, y });
                    break;
                }
                case "L": {
                    const [x, y] = [read(), read()];
                    operators.push({ operator, x, y });
                    break;
                }
                case "H": {
                    const x = read();
                    operators.push({ operator, x });
                    break;
                }
                case "V": {
                    const y = read();
                    operators.push({ operator, y });
                    break;
                }
                case "Q": {
                    const [x1, y1, x, y] = [read(), read(), read(), read()];
                    operators.push({ operator, x1, y1, x, y });
                    break;
                }
                case "T": {
                    const [x, y] = [read(), read()];
                    operators.push({ operator, x, y });
                    break;
                }
                case "C": {
                    const [x1, y1, x2, y2, x, y] = [read(), read(), read(), read(), read(), read()];
                    operators.push({ operator, x1, y1, x2, y2, x, y });
                    break;
                }
                case "S": {
                    const [x2, y2, x, y] = [read(), read(), read(), read()];
                    operators.push({ operator, x2, y2, x, y });
                    break;
                }
                case "A": {
                    const [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y] = [read(), read(), read(), read(), read(), read(), read()];
                    operators.push({ operator, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y });
                }
                case "Z": {
                    operators.push({ operator: "Z" });
                    break;
                }
                default: {
                    ErrorLauncher.unknownKeyError(operator as string);
                }
            }
        }
        return operators;
    }
    static toCubic(path1: PathOperators, path2: PathOperators): PathOperators {
        const operators = [];
        return operators;
    }
    static operatorsToPathStr(operators: PathOperators): string {
        let ans = "";
        operators.forEach(operator => {
            switch (operator.operator) {
                case "M": {
                    const { x, y } = operator;
                    ans += `M ${x} ${y} `;
                    break;
                }
                case "L": {
                    const { x, y } = operator;
                    ans += `L ${x} ${y} `;
                    break;
                }
                case "H": {
                    const { x } = operator;
                    ans += `H ${x} `;
                    break;
                }
                case "V": {
                    const { y } = operator;
                    ans += `V ${y} `;
                    break;
                }
                case "Q": {
                    const { x1, y1, x, y } = operator;
                    ans += `Q ${x1} ${y1} ${x} ${y} `;
                    break;
                }
                case "T": {
                    const { x, y } = operator;
                    ans += `T ${x} ${y} `;
                    break;
                }
                case "C": {
                    const { x1, y1, x2, y2, x, y } = operator;
                    ans += `C ${x1} ${y1} ${x2} ${y2} ${x} ${y} `;
                    break;
                }
                case "S": {
                    const { x2, y2, x, y } = operator;
                    ans += `S ${x2} ${y2} ${x} ${y} `;
                    break;
                }
                case "A": {
                    const { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y } = operator;
                    ans += `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y} `;
                    break;
                }
                default: {
                    ErrorLauncher.unknownKeyError(operator.operator);
                }
            }
        });
        return ans;
    }
    static updatePath(d: string, x0: number, y0: number, dx: number, dy: number, sx: number, sy: number): string {
        const fx = (x: number) => (x - x0) * sx + x0 + dx;
        const fy = (y: number) => (y - y0) * sy + y0 + dy;
        const operators = this.pathStrToOperators(d);
        operators.forEach(operator => {
            if (operator.x) operator.x = fx(operator.x);
            if (operator.y) operator.y = fy(operator.y);
            if (operator.x1) operator.x1 = fx(operator.x1);
            if (operator.y1) operator.y1 = fy(operator.y1);
            if (operator.x2) operator.x2 = fx(operator.x2);
            if (operator.y2) operator.y2 = fy(operator.y2);
            if (operator.rx) operator.rx = operator.rx * sx;
            if (operator.ry) operator.ry = operator.ry * sy;
        });
        return this.operatorsToPathStr(operators);
    }
    static getPointAtLength(d: string, length: number): [number, number] {
        try {
            this.pathSVG.setAttribute("d", d);
            const point = this.pathSVG.element().getPointAtLength(length);
            return [point.x, point.y];
        } catch (err) {
            return [0, 0];
        }
    }
    static getPointByRate(d: string, k: number): [number, number] {
        try {
            this.pathSVG.setAttribute("d", d);
            const length = this.pathSVG.element().getTotalLength() * k;
            const point = this.pathSVG.element().getPointAtLength(length);
            return [point.x, point.y];
        } catch (err) {
            return [0, 0];
        }
    }
    static getTotalLength(d: string) {
        try {
            this.pathSVG.setAttribute("d", d);
            return this.pathSVG.element().getTotalLength();
        } catch (err) {
            return 0;
        }
    }
    static __trimSource(source: SDNode) {
        if (!source) return 0;
        const t = this.pathSVG.element().getTotalLength();
        let l = 0;
        let r = 1;
        while (r - l > 1e-3) {
            const mid = (l + r) / 2.0;
            const length = t * mid;
            const point = this.pathSVG.element().getPointAtLength(length);
            if (source.inRange([point.x, point.y])) l = mid;
            else r = mid;
        }
        if (t * l <= 1) return 0;
        return l;
    }
    static __trimTarget(target: SDNode) {
        if (!target) return 1;
        const t = this.pathSVG.element().getTotalLength();
        let l = 0;
        let r = 1;
        while (r - l > 1e-3) {
            const mid = (l + r) / 2.0;
            const length = t * mid;
            const point = this.pathSVG.element().getPointAtLength(length);
            if (target.inRange([point.x, point.y])) r = mid;
            else l = mid;
        }
        if (t * (1 - l) <= 1) return 1;
        return l;
    }
    static trim(d: string, source: SDNode, target: SDNode) {
        try {
            this.pathSVG.setAttribute("d", d);
            const length = this.pathSVG.element().getTotalLength();
            const s = this.__trimSource(source);
            const t = this.__trimTarget(target);
            const ps = this.pathSVG.element().getPointAtLength(s * length);
            const pt = this.pathSVG.element().getPointAtLength(t * length);
            return [
                [ps.x, ps.y],
                [pt.x, pt.y],
            ];
        } catch (err) {
            return [
                [0, 0],
                [0, 0],
            ];
        }
    }
}
