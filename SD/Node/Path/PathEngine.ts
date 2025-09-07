import { svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class PathEngine {
    static pathSVG = undefined;
    static init() {
        this.pathSVG = RenderNode.createRenderNodeWithoutAction(undefined, svg(), "path");
        this.pathSVG.setAttribute("opacity", 0);
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
    static operatorsToPathStr(operators: Array<any>): string {
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
