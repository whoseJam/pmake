import { Action } from "@/Animate/Action";
import { D3Layer } from "@/Node/D3Layer";
import { d3ToNake } from "@/Utility/Tool";
import { Interp } from "@/Animate/Interp";
import { nakeToSnap } from "@/Utility/Tool";
import { SDNode } from "@/Node/Node";
import { Text } from "@/Node/Basic/Text";

export class BaseNake extends SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {"rect"|"circle"|"text"|"line"|"path"|"g"} tag 
     */
    constructor(node, tag) {
        super(node);

        this.member.new("fill", "#000000");
        this.member.new("fill-opacity", 1);
        this.member.new("stroke", "#ffffff");
        this.member.new("stroke-opacity", 1);
        this.member.new("stroke-width", 1);
        this.member.new("stroke-dashoffset", 0);
        this.member.new("stroke-dasharray", [1, 0]);
        this.member.new("opacity", 1);

        this._.d3 = this.d3layer.append(tag);
        this._.nake = d3ToNake(this._.d3);
        this._.snap = nakeToSnap(this._.nake);
    }

    /**
     * 操作元素的fill属性
     * @overload
     * @param {string} color 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    fill(color) {
        if (color === undefined) {
            return this.member.get("fill");
        }
        this.member.set("fill", color);
        this.tryUpdate();
        return this;
    }
    /**
     * 操作元素的fill-opacity属性
     * @overload
     * @param {number} opacity 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    fillOpacity(opacity) {
        if (opacity === undefined) {
            return this.member.get("fill-opacity");
        }
        this.member.setByDqual("fill-opacity", opacity);
        this.tryUpdate();
        return this;
    }

    /**
     * 操作元素的stroke属性
     * @overload
     * @param {string} color 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    stroke(color) {
        if (color === undefined) {
            return this.member.get("stroke");
        }
        this.member.set("stroke", color);
        this.tryUpdate();
        return this;
    }

    /**
     * 操作元素的stroke-opacity属性
     * @overload
     * @param {number} opacity 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeOpacity(opacity) {
        if (opacity === undefined) {
            return this.member.get("stroke-opacity");
        }
        this.member.setByDqual("stroke-oapcity", opacity);
        this.tryUpdate();
        return this;
    }

    /**
     * 操作元素的stroke-width属性
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeWidth(width) {
        if (width === undefined) {
            return this.member.get("stroke-width");
        }
        this.member.setByDqual("stroke-width", width);
        this.tryUpdate();
        return this;
    }
    
    /**
     * 操作元素的stroke-dashoffset属性
     * @overload
     * @param {number} offset 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeDashOffset(offset) {
        if (offset === undefined) {
            return this.member.get("stroke-dashoffset");
        }
        this.member.setByDqual("stroke-dashoffset", offset);
        this.tryUpdate();
        return this;
    }

    /**
     * 操作元素的stroke-dasharray属性
     * @overload
     * @param {Array<number>} array 
     * @returns {this}
     * @overload
     * @returns {Array<number>}
     */
    strokeDashArray(array) {
        if (array === undefined) {
            return this.member.get("stroke-dasharray");
        }
        this.member.set("stroke-dasharray", array);
        this.tryUpdate();
        return this;
    }

    /**
     * @overload
     * @param {string|{ main: string, border: string }} color
     * @returns {this} 
     * @overload
     * @returns {{ main: string, border: string }}
     */
    color(color) {
        if (color === undefined) {
            return {
                main: this.fill(),
                border: this.stroke()
            };
        }
        if (typeof(color) === "string") {
            this.fill(color);
            if (this instanceof Text) {
                this.stroke(color);
            }
        } else {
            this.fill(color.main);
            this.stroke(color.border);
        }
        return this;
    }

    update() {
        super.update();
        if (this.member.hasChanged("fill")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("fill"),
                this.member.get("fill"),
                Interp.colorInterp(this._.nake, "fill"),
                this, "fill"
            );
            this.member.flush("fill");
        }
        if (this.member.hasChanged("fill-opacity")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("fill-opacity"),
                this.member.get("fill-opacity"),
                Interp.numberInterp(this._.nake, "fill-opacity"),
                this, "fill-opacity"
            );
            this.member.flush("fill-opacity");
        }
        if (this.member.hasChanged("stroke")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("stroke"),
                this.member.get("stroke"),
                Interp.colorInterp(this._.nake, "stroke"),
                this, "stroke"
            );
            this.member.flush("stroke");
        }
        if (this.member.hasChanged("stroke-opacity")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("stroke-opacity"),
                this.member.get("stroke-opacity"),
                Interp.numberInterp(this._.nake, "stroke-opacity"),
                this, "stroke-opacity"
            );
            this.member.flush("stroke-opacity");
        }
        if (this.member.hasChanged("stroke-width")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("stroke-width"),
                this.member.get("stroke-width"),
                Interp.numberInterp(this._.nake, "stroke-width"),
                this, "stroke-width"
            );
            this.member.flush("stroke-width");
        }
        if (this.member.hasChanged("stroke-dashoffset")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("stroke-dashoffset"),
                this.member.get("stroke-dashoffset"),
                Interp.numberInterp(this._.nake, "stroke-dashoffset"),
                this, "stroke-dashoffset"
            );
            this.member.flush("stroke-dashoffset");
        }
        if (this.member.hasChanged("stroke-dasharray")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("stroke-dasharray"),
                this.member.get("stroke-dasharray"),
                Interp.arrayInterp(this._.nake, "stroke-dasharray"),
                this, "stroke-dasharray"
            );
            this.member.flush("stroke-dasharray");
        }
    }
}