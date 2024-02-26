import { SDHelper } from "../../Utility/SDHelper";
import { Text } from "../Basic/Text";
import { Node } from "../Node";

/**
 * @class VarList
 * @description 提供了对变量的管理，可以定义变量，修改变量的值
 */
export class VarList extends Node {
    constructor(node) {
        super(node);
        this.g().attr("type", "VarList");

        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
        this._.fontSize = 20;
        this._.vars = [];
    }

    put(key, value) {
        let vars = this._.vars, s = this.delay(), l = this.duration();
        for (let v of vars) {
            if (v.key == key) {
                if (this.isAnimating()) { v.endAnimate().after(s).startAnimate(l/2).opacity(0).dx(40).endAnimate() }
                v.value = value;
                v.text(`${key}=${value}`);
                if (this.isAnimating()) { v.startAnimate(l/2).opacity(1).dx(-40); }
                return this;
            }
        }
        let v = new Text(this, `${key}=${value}`).fontSize(this._.fontSize);
        v.key = key; v.value = value;
        this._.vars.push(v);
        this.update();
        v.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    get(key) {
        let vars = this._.vars;
        for (let v of vars)
            if (v.key == key) return v.value;
        return null;
    }

    inc(key) {
        this.put(key, this.get(key) + 1);
        return this;
    }

    dec(key) {
        this.put(key, this.get(key) - 1);
        return this;
    }

    incBy(key, delta) {
        this.put(key, this.get(key) + delta);
        return this;
    }

    color() {
        if (arguments.length === 1) return color1.apply(this, arguments);
        if (arguments.length === 2) return color2.apply(this, arguments);
        console.log(arguments);
        throw new Error("参数错误");
    }

    fontSize(fs) {
        if (fs === undefined)
            return this._.fontSize;
        this._.fontSize = fs;
        this.update();
        return this;
    }

    width(width) {
        if (width === undefined)
            return this._.width;
        let owidth = this._.width , k = owidth > 0 ? width / owidth : 1;
        this.fontSize(this.fontSize() * k);
        return this;
    }

    height(height) {
        if (height === undefined)
            return this._.height;
        let oheight = this._.height, k = oheight > 0 ? height / oheight : 1;
        this.fontSize(this.fontSize() * k);
        return this;
    }

    update() {
        let x = this.x(), y = this.y();
        let height = 0, width = 0;
        let vars = this._.vars;
        for (let i = 0; i < vars.length; i++) {
            let v = vars[i];
            v.x(x).y(y).fontSize(this._.fontSize);
            width = Math.max(width, v.width());
            height += v.height();
            y += v.height();
        }
        this._.width = width;
        this._.height = height;
        this.children.update();
        return this;
    }
}

function color1(x) {
    let vars = this._.vars;
    if (SDHelper.isColor(x)) {
        for (let v of vars) v.color(x);
        return this;
    } else {
        for (let v of vars)
            if (v.key === x) return v.color();
        throw new Error(`${x}变量未找到`);
    }
}
function color2(key, color) {
    let vars = this._.vars;
    for (let v of vars)
        if (v.key === key) v.color(color);
    return this;
}