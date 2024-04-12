import { Color } from "../../Utility/Color";
import { Traiter } from "../../Utility/TypeTrait";
import { Rect } from "../Basic/Rect";
import { Text } from "../Basic/Text";
import { Node } from "../Node";

export class Code extends Node {
    constructor(node) {
        super(node);
        this.g().attr("type", "Code");
        
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
        this._.fontSize = 20;
        this._.codes = [];
        this._.l = null;
        this._.r = null;
        this._.start = 1;

        let focus = new Rect(this);
        focus.color(Color.BLUE).opacity(0);
        this.childAs("focus", focus);
    }
    
    /**
     * 将该代码块中的代码修改为source的内容
     * @param {string} source 
     * @returns 当前节点
     */
    code(source) {
        let codes = this._.codes;
        for (let code of codes) {
            this.children.erase(code);
            code.startAnimate(this).remove();
        }
        this._.codes = [];
        let ans = "";
        for (let i = 0; i < source.length; i++) {
            if (source[i] === "\n") {
                if (ans != "") this.push(ans);
                ans = "";
            } else ans += source[i];
        }
        if (ans.length > 0) this.push(ans);
        return this;
    }

    push(code) {
        let fs = this.fontSize();
        if (Traiter.isText(code))
            code = new Text(this, code);
        code.fontSize(fs);
        let codes = this._.codes;
        codes.push(code);
        this.children.push(code);
        this.update();
        this._.width = Math.max(this._.width, code.width());
        this._.height += code.height();
        return this;
    }

    focus(l, r) {
        let focus = this.child("focus");
        if (l === null) {
            this._.l = this._.r = null;
            focus.opacity(0);
            return;
        } else if (arguments.length === 1)
            l = r = arguments[0];
        this._.l = l;
        this._.r = r;
        if (focus.opacity() === 0) {
            let el = this._.codes[l - 1];
            let er = this._.codes[r - 1];
            focus.endAnimate();
            focus.after(this);
            focus.x(el.x()).width(this.width());
            focus.y(el.y()).height(er.my() - el.y());
            focus.opacity(0);
            focus.startAnimate(this);
            focus.opacity(1);
        } else this.update();
        return this;
    }

    width(width) {
        if (width === undefined)
            return this._.width;
        let w = this._.width;
        if (!w) return this;
        let k = width / w, fs = this.fontSize();
        this.fontSize(fs * k);
        return this;
    }

    height(height) {
        if (height === undefined)
            return this._.height;
        let h = this._.height;
        if (!h) return this;
        let k = height / h, fs = this.fontSize();
        this.fontSize(fs * k);
        return this;
    }

    fontSize(fs) {
        if (fs === undefined)
            return this._.fontSize;
        this._.fontSize = 0;
        let codes = this._.codes, width = 0, height = 0;
        for (let code of codes) {
            code.fontSize(fs);
            height += code.height();
            width = Math.max(width, code.width());
        }
        this._.width = width;
        this._.height = height;
        this.update();
        return this;
    }

    length() {
        return this._.codes.length;
    }

    row(idx) {
        return this._.codes[idx - 1];
    }

    update() {
        let x = this.x();
        let y = this.y();
        let width = this.width();
        let fs = this.fontSize();
        let codes = this._.codes;
        codes.forEach(function(code) {
            code.parent = null;
            code.fontSize(fs).x(x).y(y);
            code.parent = this;
            y += code.height();
        });
        let l = this.l();
        let r = this.r();
        if (l && r) {
            let light = this.child("focus");
            light.parent = null;
            light.x(this.row(l).x());
            light.width(width);
            light.y(this.row(l).y());
            light.height(
                this.row(r).my() - 
                this.row(l).y()
            );
            light.parent = this;
        }
        super.update();
    }

    l() {
        return this._.l;
    }

    r() {
        return this._.r;
    }
}