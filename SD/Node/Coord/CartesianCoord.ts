import { dqual } from "@/Math/Math";
import { Vector as V } from "@/Math/Vector";
import { BaseAxis } from "@/Node/Axis/BaseAxis";
import { BaseCoord } from "@/Node/Coord/BaseCoord";
import { Enter as EN } from "@/Node/Core/Enter";
import { Path } from "@/Node/Path/Path";
import { SDNode } from "@/Node/SDNode";
import { Circle } from "@/Node/Shape/Circle";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { PathPen } from "@/Utility/PathPen";

type Origin = "bl" | "c";

interface CoordElement {
    element: SDNode | RenderNode;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    func?: (x: number) => number;
    sampleCount?: number;
    position?: [number, number];
    direction?: [number, number];
}

export class CartesianCoord<AxisType extends BaseAxis = BaseAxis> extends BaseCoord<AxisType> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            origin: "bl",
        });
    }
    axis(by: "x" | "y"): AxisType {
        return this.child(by) as AxisType;
    }
    local(v: [number, number]): [number, number];
    local(x: number, y: number): [number, number];
    local(x: number | [number, number], y?: number): [number, number] {
        if (arguments.length === 1) {
            const v = x as [number, number];
            return this.local(v[0], v[1]);
        }
        return [this.axis("x").local(x as number, y!), this.axis("y").local(x as number, y!)];
    }
    global(v: [number, number]): [number, number];
    global(x: number, y: number): [number, number];
    global(x: number | [number, number], y?: number): [number, number] {
        if (arguments.length === 1) {
            const v = x as [number, number];
            return this.global(v[0], v[1]);
        }
        return [this.axis("x").globalX(x as number), this.axis("y").globalY(y!)];
    }
    origin(): Origin;
    origin(origin: Origin): this;
    origin(origin?: Origin) {
        if (arguments.length === 0) return this.vars.origin;
        this.vars.origin = origin;
        return this;
    }
    drawRect(x: number, y: number): Rect {
        const rect = new Rect(this).opacity(0).onEnter(EN.appear());
        this.vars.elements.push({ element: rect, x, y });
        this.childAs(rect, rectRule);
        return rect;
    }
    rectX(rect: Rect): number | undefined;
    rectX(rect: Rect, x: number): this;
    rectX(rect: Rect, x?: number) {
        const element = this.__getElement(rect);
        if (arguments.length === 1) return element?.x;
        if (element) element.x = x;
        return this;
    }
    rectY(rect: Rect): number | undefined;
    rectY(rect: Rect, y: number): this;
    rectY(rect: Rect, y?: number) {
        const element = this.__getElement(rect);
        if (arguments.length === 1) return element?.y;
        if (element) element.y = y;
        return this;
    }
    drawCircle(x: number, y: number): Circle {
        const circle = new Circle(this).opacity(0).onEnter(EN.appear());
        this.vars.elements.push({ element: circle, x, y });
        this.childAs(circle, circleRule);
        return circle;
    }
    circleX(circle: Circle): number | undefined;
    circleX(circle: Circle, x: number): this;
    circleX(circle: Circle, x?: number) {
        const element = this.__getElement(circle);
        if (arguments.length === 1) return element?.x;
        if (element) element.x = x;
        return this;
    }
    circleY(circle: Circle): number | undefined;
    circleY(circle: Circle, y: number): this;
    circleY(circle: Circle, y?: number) {
        const element = this.__getElement(circle);
        if (arguments.length === 1) return element?.y;
        if (element) element.y = y;
        return this;
    }
    drawFunction(func: (x: number) => number): Path {
        const path = new Path(this).opacity(0).onEnter(EN.pointStoT());
        this.vars.elements.push({ element: path, func, sampleCount: 20 });
        this.childAs(path, functionRule);
        return path;
    }
    function(path: Path): (x: number) => number;
    function(path: Path, func: (x: number) => number): this;
    function(path: Path, func?: (x: number) => number) {
        const element = this.__getElement(path);
        if (arguments.length === 1) return element?.func;
        if (element) element.func = func;
        return this;
    }
    functionSampleCount(path: Path): number;
    functionSampleCount(path: Path, count: number): this;
    functionSampleCount(path: Path, count?: number) {
        const element = this.__getElement(path);
        if (arguments.length === 1) return element?.sampleCount;
        if (element) element.sampleCount = count;
        return this;
    }
    drawLine(v: [number, number], d: [number, number]): Path;
    drawLine(v: [number, number], dx: number, dy: number): Path;
    drawLine(x: number, y: number, d: [number, number]): Path;
    drawLine(x: number, y: number, dx: number, dy: number): Path;
    drawLine(): Path {
        if (arguments.length === 2) {
            const [v, d] = arguments;
            return this.drawLine(v[0], v[1], d[0], d[1]);
        } else if (arguments.length === 3) {
            if (Array.isArray(arguments[0])) {
                const [v, dx, dy] = arguments;
                return this.drawLine(v[0], v[1], dx, dy);
            } else {
                const [x, y, d] = arguments;
                return this.drawLine(x, y, d[0], d[1]);
            }
        }
        const [x, y, dx, dy] = arguments;
        const position = [x, y];
        const direction = [dx, dy];
        const path = new Path(this).opacity(0).onEnter(EN.pointStoT());
        this.vars.elements.push({ element: path, position, direction, sampleCount: 2 });
        this.childAs(path, lineRule);
        return path;
    }
    lineDirection(line: Path): [number, number];
    lineDirection(line: Path, d: [number, number]): this;
    lineDirection(line: Path, dx: number, dy: number): this;
    lineDirection(line: Path, dx?: number | [number, number], dy?: number) {
        const element = this.__getElement(line);
        if (arguments.length === 1) return element?.direction;
        if (arguments.length === 2) {
            const d = dx as [number, number];
            if (element) element.direction = [d[0], d[1]];
        } else {
            if (element) element.direction = [dx as number, dy!];
        }
        return this;
    }
    linePosition(line: Path): [number, number];
    linePosition(line: Path, v: [number, number]): this;
    linePosition(line: Path, x: number, y: number): this;
    linePosition(line: Path, x?: number | [number, number], y?: number) {
        const element = this.__getElement(line);
        if (arguments.length === 1) return element?.position;
        if (arguments.length === 2) {
            const v = x as [number, number];
            if (element) element.position = [v[0], v[1]];
        } else {
            if (element) element.position = [x as number, y!];
        }
        return this;
    }
    lineSampleCount(line: Path): number;
    lineSampleCount(line: Path, count: number): this;
    lineSampleCount(line: Path, count?: number) {
        const element = this.__getElement(line);
        if (arguments.length === 1) return element?.sampleCount;
        if (element) element.sampleCount = count;
        return this;
    }
    drawRay(v: [number, number], d: [number, number]): Path;
    drawRay(v: [number, number], dx: number, dy: number): Path;
    drawRay(x: number, y: number, d: [number, number]): Path;
    drawRay(x: number, y: number, dx: number, dy: number): Path;
    drawRay(): Path {
        if (arguments.length === 2) {
            const [v, d] = arguments;
            return this.drawRay(v[0], v[1], d[0], d[1]);
        } else if (arguments.length === 3) {
            if (Array.isArray(arguments[0])) {
                const [v, dx, dy] = arguments;
                return this.drawRay(v[0], v[1], dx, dy);
            } else {
                const [x, y, d] = arguments;
                return this.drawRay(x, y, d[0], d[1]);
            }
        }
        const [x, y, dx, dy] = arguments;
        const position = [x, y];
        const direction = [dx, dy];
        const ray = new Path(this).opacity(0).onEnter(EN.pointStoT());
        this.vars.elements.push({ element: ray, position, direction, sampleCount: 2 });
        this.childAs(ray, rayRule);
        return ray;
    }
    rayDirection(ray: Path): [number, number];
    rayDirection(ray: Path, d: [number, number]): this;
    rayDirection(ray: Path, dx: number, dy: number): this;
    rayDirection(ray: Path, dx?: number | [number, number], dy?: number) {
        const element = this.__getElement(ray);
        if (arguments.length === 1) return element?.direction;
        if (arguments.length === 2) {
            const d = dx as [number, number];
            if (element) element.direction = [d[0], d[1]];
        } else {
            if (element) element.direction = [dx as number, dy!];
        }
        return this;
    }
    rayPosition(ray: Path): [number, number];
    rayPosition(ray: Path, v: [number, number]): this;
    rayPosition(ray: Path, x: number, y: number): this;
    rayPosition(ray: Path, x?: number | [number, number], y?: number) {
        const element = this.__getElement(ray);
        if (arguments.length === 1) return element?.position;
        if (arguments.length === 2) {
            const v = x as [number, number];
            if (element) element.position = [v[0], v[1]];
        } else {
            if (element) element.position = [x as number, y!];
        }
        return this;
    }
    raySampleCount(ray: Path): number;
    raySampleCount(ray: Path, count: number): this;
    raySampleCount(ray: Path, count?: number) {
        const element = this.__getElement(ray);
        if (arguments.length === 1) return element?.sampleCount;
        if (element) element.sampleCount = count;
        return this;
    }
    __getElement(element: SDNode | RenderNode): CoordElement | undefined {
        for (const _element of this.vars.elements) {
            if (_element.element === element) return _element;
        }
        return undefined;
    }
}

function valid(v: [number, number]): boolean {
    return Check.isNumber(v[0]) && Check.isNumber(v[1]);
}

function circleRule(parent: CartesianCoord, child: Circle): void {
    const element = parent.__getElement(child);
    if (!element) return;
    const circle = element.element as Circle;
    circle.center(parent.global(element.x!, element.y!));
}

function rectRule(parent: CartesianCoord, child: Rect): void {
    const element = parent.__getElement(child);
    if (!element) return;
    const rect = element.element as Rect;
    parent.tryUpdate(rect, () => {
        rect.center(parent.global(element.x!, element.y!));
    });
}

function functionRule(parent: CartesianCoord, child: Path): void {
    const element = parent.__getElement(child);
    if (!element) return;
    const path = element.element as Path;
    const func = element.func!;
    const sampleCount = element.sampleCount!;
    const pen = sampleBy(parent, sampleCount, func, "x");
    parent.tryUpdate(path, () => {
        path.d(pen.toString());
    });
}

function lineRule(parent: CartesianCoord, child: Path): void {
    const element = parent.__getElement(child);
    if (!element) return;
    const line = element.element as Path;
    const p = element.position!;
    const d = element.direction!;
    const sampleCount = element.sampleCount!;
    let pen: PathPen;
    if (!dqual(d[0], 0)) {
        const func = (x: number) => (d[1] / d[0]) * x + (p[1] - (p[0] * d[1]) / d[0]);
        pen = sampleBy(parent, sampleCount, func, "x");
    } else {
        const func = (y: number) => (d[0] / d[1]) * y + (p[0] - (p[1] * d[0]) / d[1]);
        pen = sampleBy(parent, sampleCount, func, "y");
    }
    parent.tryUpdate(line, () => {
        line.d(pen.toString());
    });
}

function rayRule(parent: CartesianCoord, child: Path): void {
    const element = parent.__getElement(child);
    if (!element) return;
    const ray = element.element as Path;
    const p = element.position!;
    const d = element.direction!;
    const sampleCount = element.sampleCount!;
    const x = parent.axis("x").inversePercent(0);
    const mx = parent.axis("x").inversePercent(1);
    const y = parent.axis("y").inversePercent(0);
    const my = parent.axis("y").inversePercent(1);
    const intersect = V.intersectRayWithBox(p, d, x, y, mx - x, my - y);
    let pen: PathPen;
    if (intersect === undefined) {
        pen = new PathPen();
    } else if (intersect.length === 1) {
        if (!dqual(d[0], 0)) {
            const func = (x: number) => (d[1] / d[0]) * x + (p[1] - (p[0] * d[1]) / d[0]);
            const at = parent.axis("x").percent(p[0]);
            if (d[0] > 0) pen = sampleBy(parent, sampleCount, func, "x", [at, 1]);
            else pen = sampleBy(parent, sampleCount, func, "x", [at, 0]);
        } else {
            const func = (y: number) => (d[0] / d[1]) * y + (p[0] - (p[1] * d[0]) / d[1]);
            const at = parent.axis("y").percent(p[1]);
            if (d[1] > 0) pen = sampleBy(parent, sampleCount, func, "y", [at, 1]);
            else pen = sampleBy(parent, sampleCount, func, "y", [at, 0]);
        }
    } else {
        if (!dqual(d[0], 0)) {
            const func = (x: number) => (d[1] / d[0]) * x + (p[1] - (p[0] * d[1]) / d[0]);
            if (d[0] > 0) pen = sampleBy(parent, sampleCount, func, "x");
            else pen = sampleBy(parent, sampleCount, func, "x", [1, 0]);
        } else {
            const func = (y: number) => (d[0] / d[1]) * y + (p[0] - (p[1] * d[0]) / d[1]);
            if (d[1] > 0) pen = sampleBy(parent, sampleCount, func, "y");
            else pen = sampleBy(parent, sampleCount, func, "y", [1, 0]);
        }
    }
    parent.tryUpdate(ray, () => {
        ray.d(pen.toString());
    });
}

function sampleBy(
    parent: CartesianCoord,
    sampleCount: number,
    func: (v: number) => number,
    by: "x" | "y",
    range?: [number, number]
): PathPen {
    let firstMoveTo = false;
    const pen = new PathPen();

    function sample(i: number): number {
        if (range === undefined) return i / (sampleCount - 1);
        const [l, r] = range;
        return (i / (sampleCount - 1)) * (r - l) + l;
    }

    for (let i = 0; i < sampleCount; i++) {
        let x: number;
        let y: number;
        let prevX: number;
        let prevY: number;

        if (by === "x") {
            x = parent.axis("x").inversePercent(sample(i));
            y = func(x);
            prevX = parent.axis("x").inversePercent(sample(i - 1));
            prevY = func(prevX);
        } else {
            y = parent.axis("y").inversePercent(sample(i));
            x = func(y);
            prevY = parent.axis("y").inversePercent(sample(i - 1));
            prevX = func(prevY);
        }

        const point = parent.global(x, y);
        const prevPoint = parent.global(prevX, prevY);

        if (i > 0) {
            if (valid([x, y]) && valid([prevX, prevY])) {
                const intersect = V.cohenSutherland(
                    prevPoint,
                    point,
                    parent.x(),
                    parent.y(),
                    parent.width(),
                    parent.height()
                );
                if (!intersect) {
                    firstMoveTo = false;
                    continue;
                }
                const [source, target] = intersect;
                if (!firstMoveTo) {
                    pen.MoveTo(source);
                    firstMoveTo = true;
                }
                pen.LineTo(target);
            } else if (valid([x, y])) {
                if (by === "x") {
                    if (Math.abs(parent.my() - point[1]) < parent.height() / 2) {
                        const source: [number, number] = [prevPoint[0], parent.my()];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LineTo(target);
                    } else {
                        const source: [number, number] = [prevPoint[0], parent.y()];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LineTo(target);
                    }
                } else {
                    if (Math.abs(parent.mx() - point[0]) < parent.width() / 2) {
                        const source: [number, number] = [parent.mx(), prevPoint[1]];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LineTo(target);
                    } else {
                        const source: [number, number] = [parent.x(), prevPoint[0]];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LineTo(target);
                    }
                }
            }
        } else if (i === 0) {
            if (valid([x, y])) {
                if (
                    parent.x() > point[0] ||
                    point[0] > parent.mx() ||
                    parent.y() > point[1] ||
                    point[1] > parent.my()
                ) {
                    firstMoveTo = false;
                    continue;
                }
                if (!firstMoveTo) {
                    pen.MoveTo(point);
                    firstMoveTo = true;
                }
            }
        }
    }
    return pen;
}
