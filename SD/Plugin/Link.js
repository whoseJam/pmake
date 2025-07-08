import { Exit as EX } from "@/Node/Core/Exit";
import { Line } from "@/Node/Path/Line";
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

    self.effect("element", () => {
        if (self.vars.update) self.vars.update = false;
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;
        self.source(element1[self.sourceLocationX()](), element1[self.sourceLocationY()]());
        self.target(element2[self.targetLocationX()](), element2[self.targetLocationY()]());
    });
    self.effect("trim", () => {
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;
        trim(self, element1, element2);
    });

    source.childAs(self);
    target.childAs(self);

    return self;
}
