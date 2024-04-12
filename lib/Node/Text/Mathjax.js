import { Fragment } from "../Basic/Fragment";

export class Mathjax extends Fragment {
    constructor(node, text) {
        super(node);
        this.g().attr("type", "Mathjax");
        if (text) this.math(text);
    }

    math(text) {
        let svg = MathJax.tex2svg(text).children[0];
        this.fragment(svg.outerHTML);
        return this;
    }

    width(width) {
        let owidth = this._.width;
        let oheight = this._.height;
        if (width === undefined)
            return owidth;
        let k = width / owidth;
        super.width(owidth * k);
        super.height(oheight * k);
        return this;
    }

    height(height) {
        let owidth = this._.width;
        let oheight = this._.height;
        if (height === undefined)
            return oheight;
        let k = height / oheight;
        super.width(owidth * k);
        super.height(oheight * k);
        return this;
    }
}