import { Check } from "@/Utility/Check";

export class Cast {
    static castToSDNode(target, object, id) {
        if (object === null || object === undefined) {
            const { Text } = require("@/Node/Text/Text");
            if (id !== undefined) return new Text(target, id).opacity(0);
            return null;
        }
        if (typeof object === "function") return object(target).opacity(0);
        if (Check.isNumberOrString(object)) {
            const { Text } = require("@/Node/Text/Text");
            const { Mathjax } = require("@/Node/Text/Mathjax");
            object = String(object);
            if (object.startsWith("$") && object.endsWith("$")) return new Mathjax(target, object).opacity(0);
            return new Text(target, object).opacity(0);
        }
        return object;
    }
    static castHexToRGB(hex) {
        hex = hex.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }
    static castToArray(value) {
        if (Check.isNumber(value)) return [value];
        return value;
    }
    static castPointsToBox(points) {
        let x = Infinity;
        let mx = -Infinity;
        let y = Infinity;
        let my = -Infinity;
        points.forEach(point => {
            x = Math.min(x, point[0]);
            mx = Math.max(mx, point[0]);
            y = Math.min(y, point[1]);
            my = Math.max(my, point[1]);
        });
        if (x === Infinity || y === Infinity) return { x: 0, y: 0, width: 0, height: 0 };
        return { x, y, width: mx - x, height: my - y };
    }
}
