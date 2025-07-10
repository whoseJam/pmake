import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

/**
 * Gets the svg canvas.
 *
 * The canvas spans the entire screen, and its internal content is automatically
 * centered both horizontally and vertically.
 * @example
 * const svg = sd.svg();
 * const rect = new sd.Rect(svg);
 * const circle = new sd.Circle(svg);
 */
export function svg(): SVGNode;

/**
 * Gets the div canvas.
 *
 * The canvas spans the entire screen, and its internal content is automatically
 * centered both horizontally and vertically.
 * @example
 * const div = sd.div();
 * const button = new sd.Button(div);
 * const slider = new sd.Slider(div);
 */
export function div(): HTMLNode;

export class Root {
    static init(): void;
    static setViewBox(x: number, y: number, width: number, height: number, rate: number): void;
}
