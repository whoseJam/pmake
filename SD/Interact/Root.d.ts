import { RenderNode } from "@/Renderer/RenderNode";

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
export function svg(): RenderNode;

export class Root {
    static init(): void;
    static setViewBox(x: number, y: number, width: number, height: number, rate: number): void;
}
