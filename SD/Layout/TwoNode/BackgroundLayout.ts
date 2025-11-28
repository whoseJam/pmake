import { SDNode } from "@/Node/SDNode";
import { Circle } from "@/Node/Shape/Circle";

/**
 * Layout function for making a source node match the target's rectangular bounds.
 *
 * This function positions and sizes the source node to exactly match the target's
 * position and dimensions, effectively creating a background or overlay effect.
 *
 * @param source - The node to be sized and positioned (required)
 * @param target - The reference node (required)
 *
 * The source will have:
 * - Same x, y position as target
 * - Same width and height as target
 *
 * @example
 * // Make source match target's bounds (background effect)
 * BackgroundLayout(backgroundNode, parentNode);
 *
 * @example
 * // Create a colored background for a container
 * const container = new sd.Rect(svg).x(100).y(100).width(200).height(150);
 * const background = new sd.Rect(svg).fill("lightblue");
 * BackgroundLayout(background, container);
 */
export function BackgroundLayout(target: SDNode, source: SDNode) {
    source.width(target.width());
    source.height(target.height());
    source.x(target.x());
    source.y(target.y());
}

/**
 * Layout function for making a circular source node match the target's circular bounds.
 *
 * This function positions and sizes a circular source node to exactly match the target's
 * position and radius, effectively creating a circular background or overlay effect.
 *
 * @param source - The circular node to be sized and positioned (must have r() method) (required)
 * @param target - The circular reference node (must have r() method) (required)
 *
 * The source will have:
 * - Same x, y position as target
 * - Same radius as target
 *
 * @example
 * // Make circular source match target's bounds
 * CircleBackgroundLayout(circleBackground, circleNode);
 *
 * @example
 * // Create a colored circular background
 * const circle = new sd.Circle(svg).x(100).y(100).r(50);
 * const background = new sd.Circle(svg).fill("lightblue");
 * CircleBackgroundLayout(background, circle);
 */
export function CircleBackgroundLayout(target: Circle, source: Circle) {
    const x = target.x();
    const y = target.y();
    const r = target.r();

    source.r(r).x(x).y(y);
}
