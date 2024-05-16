import { D3Layer } from "@/Node/D3Layer";
import { Fragment } from "@/Node/Basic/Fragment";
import { SDNode } from "@/Node/Node";

/**
 * @class Mathjax
 */
export class Mathjax extends Fragment {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {string} text 
     */
    constructor(node, text) {
        super(node);
        this.g().type("Mathjax");
        if (text) this.math(text);
    }

    /**
     * @param {string} text 
     * @returns {this}
     */
    math(text) {
        const svg = MathJax.tex2svg(text).children[0];
        this.fragment(svg.outerHTML);
        return this;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck("q");
        const owidth = this._.width;
        const oheight = this._.height;
        if (width === undefined)
            return owidth;
        const k = width / owidth;
        this._.width = owidth * k;
        this._.height = oheight * k;
        this.dirty(this, "R");
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck("q");
        const owidth = this._.width;
        const oheight = this._.height;
        if (height === undefined)
            return oheight;
        const k = height / oheight;
        this._.width = owidth * k;
        this._.height = oheight * k;
        this.dirty(this, "R");
        return this;
    }
}