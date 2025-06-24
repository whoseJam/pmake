import { Interp } from "@/Animate/Interp";
import { Image } from "@/Node/Shape/Image";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { RectSVG } from "@/Node/SVG/Shape/RectSVG";
import { Factory } from "@/Utility/Factory";

export class ImageSVG extends BaseShapeSVG {
    constructor(target) {
        super(target, "image");

        this.type("ImageSVG");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            href: "",
        });

        this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
        this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
        this.vars.associate("href", Factory.action(this, this._.nake, "href", Interp.stringInterp));
        this.vars.associate("width", Factory.action(this, this._.nake, "width", Interp.numberInterp));
        this.vars.associate("height", Factory.action(this, this._.nake, "height", Interp.numberInterp));

        this._.nake.setAttribute("x", this.vars.x);
        this._.nake.setAttribute("y", this.vars.y);
        this._.nake.setAttribute("width", this.vars.width);
        this._.nake.setAttribute("height", this.vars.height);
        this._.nake.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
}

ImageSVG.extend(Image);

Object.assign(ImageSVG.prototype, {
    x: RectSVG.prototype.x,
    y: RectSVG.prototype.y,
    href: Factory.handler("href"),
    width: RectSVG.prototype.width,
    height: RectSVG.prototype.height,
});
