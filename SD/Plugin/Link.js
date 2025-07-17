import { Exit as EX } from "@/Node/Core/Exit";
import { Line } from "@/Node/Path/Line";
import { PathEngine } from "@/Node/Path/PathEngine";
import { trim } from "@/Utility/Trim";

class LinkPlugin {
    sourceElement(source) {
        if (arguments.length === 0) return this.vars.element1;
        console.log("source=", source);
        this.vars.element1.eraseChild(this.onExit(EX.nothing()));
        this.vars.element1 = source;
        this.vars.element1.childAs(this);
        return this;
    }
    targetElement(target) {
        if (arguments.length === 0) return this.vars.element2;
        this.vars.element2.eraseChild(this.onExit(EX.nothing()));
        this.vars.element2 = target;
        this.vars.element2.childAs(this);
        return this;
    }
    sourceLocationX(location) {
        if (arguments.length === 0) return this.vars.sx;
        this.vars.sx = location;
        return this;
    }
    sourceLocationY(location) {
        if (arguments.length === 0) return this.vars.sy;
        this.vars.sy = location;
        return this;
    }
    targetLocationX(location) {
        if (arguments.length === 0) return this.vars.tx;
        this.vars.tx = location;
        return this;
    }
    targetLocationY(location) {
        if (arguments.length === 0) return this.vars.ty;
        this.vars.ty = location;
        return this;
    }
}

function trimSource(link, source) {
    if (!source) return 0;
    let l = 0,
        r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (source.inRange(link.at(mid))) l = mid;
        else r = mid;
    }
    if (link.totalLength() * l <= 1) return 0;
    return l;
}

function trimTarget(link, target) {
    if (!target) return 1;
    let l = 0,
        r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (target.inRange(link.at(mid))) r = mid;
        else l = mid;
    }
    if (link.totalLength() * (1 - l) <= 1) return 1;
    return l;
}

export function Link(source, target, clazz = Line, sx = "cx", sy = "cy", tx = "cx", ty = "cy") {
    const self = new clazz(target);
    self.vars.merge({
        element1: source,
        element2: target,
        sx,
        sy,
        tx,
        ty,
    });

    self.sourceElement = LinkPlugin.prototype.sourceElement;
    self.targetElement = LinkPlugin.prototype.targetElement;
    self.sourceLocationX = LinkPlugin.prototype.sourceLocationX;
    self.sourceLocationY = LinkPlugin.prototype.sourceLocationY;
    self.targetLocationX = LinkPlugin.prototype.targetLocationX;
    self.targetLocationY = LinkPlugin.prototype.targetLocationY;

    const curve = self._.curve;
    if (curve) self.uneffect("curve");

    self.effect("link", () => {
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;
        const source = [element1[self.sourceLocationX()](), element1[self.sourceLocationY()]()];
        const target = [element2[self.targetLocationX()](), element2[self.targetLocationY()]()];
        if (curve) {
            const d = curve(source, target);
            const [ps, pt] = PathEngine.trimPath(d, element1, element2);
            self.source(ps).target(pt).d(curve(ps, pt));
        } else {
            self.source(source).target(target);
            trim(self, element1, element2);
        }
    });

    source.childAs(self);
    target.childAs(self);

    return self;
}
