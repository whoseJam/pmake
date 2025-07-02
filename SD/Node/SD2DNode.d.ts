import { SDNode } from "@/Node/SDNode";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";

export class SD2DNode extends SDNode {
    /**
     * Gets the current opacity of this component.
     * @returns The opacity of the component.
     */
    opacity(): number;
    /**
     * Sets the opacity of this component.
     * @param opacity - The opacity to apply, ranging from 0 (fully transparent) to 1 (fully opaque).
     * @returns The current component instance for method chaining.
     */
    opacity(opacity: number): this;

    inRange(point: [number, number]): boolean;
    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
    scale(scale: number): this;
    pos(x: number, y: number): this;
    pos(v: [number, number]): this;
    pos(xLocator: XLocator, yLocator: YLocator, dx?: number, dy?: number): [number, number];
    position(x: number, y: number): this;
    position(v: [number, number]): this;
    position(xLocator: XLocator, yLocator: YLocator, dx?: number, dy?: number): [number, number];
    center(): [number, number];
    center(center: [number, number]): this;
    center(cx: number, cy: number): this;
    kx(k: number): number;
    ky(k: number): number;
    dx(dx: number): this;
    dy(dy: number): this;
    cx(): number;
    cx(cx: number): this;
    cy(): number;
    cy(cy: number): this;
    mx(): number;
    mx(mx: number): this;
    my(): number;
    my(my: number): this;
}
