import { Vector as V } from "@/Math/Vector";
import { SDNode } from "@/Node/SDNode";
import { Check } from "@/Utility/Check";

/**
 * Mixin that provides source and target point management functionality.
 * This mixin adds methods for managing x1, y1, x2, y2 coordinates and their composite source/target accessors.
 */
export function PointPairMixin<T extends new (...args: any[]) => SDNode>(Base: T) {
    return class extends Base {
        /**
         * Gets the x1 coordinate.
         * @returns The x1 coordinate value.
         */
        x1(): number;
        /**
         * Sets the x1 coordinate.
         * @param x1 - The x1 coordinate value to set.
         * @returns The current component instance for method chaining.
         */
        x1(x1: number): this;
        x1(x1?: number): number | this {
            if (arguments.length === 0) return this.vars.x1;
            Check.validateNumber(x1, `${this.constructor.name}.x1`);
            this.vars.lpset("x1", x1);
            return this;
        }

        /**
         * Gets the y1 coordinate.
         * @returns The y1 coordinate value.
         */
        y1(): number;
        /**
         * Sets the y1 coordinate.
         * @param y1 - The y1 coordinate value to set.
         * @returns The current component instance for method chaining.
         */
        y1(y1: number): this;
        y1(y1?: number): number | this {
            if (arguments.length === 0) return this.vars.y1;
            Check.validateNumber(y1, `${this.constructor.name}.y1`);
            this.vars.lpset("y1", y1);
            return this;
        }

        /**
         * Gets the x2 coordinate.
         * @returns The x2 coordinate value.
         */
        x2(): number;
        /**
         * Sets the x2 coordinate.
         * @param x2 - The x2 coordinate value to set.
         * @returns The current component instance for method chaining.
         */
        x2(x2: number): this;
        x2(x2?: number): number | this {
            if (arguments.length === 0) return this.vars.x2;
            Check.validateNumber(x2, `${this.constructor.name}.x2`);
            this.vars.lpset("x2", x2);
            return this;
        }

        /**
         * Gets the y2 coordinate.
         * @returns The y2 coordinate value.
         */
        y2(): number;
        /**
         * Sets the y2 coordinate.
         * @param y2 - The y2 coordinate value to set.
         * @returns The current component instance for method chaining.
         */
        y2(y2: number): this;
        y2(y2?: number): number | this {
            if (arguments.length === 0) return this.vars.y2;
            Check.validateNumber(y2, `${this.constructor.name}.y2`);
            this.vars.lpset("y2", y2);
            return this;
        }

        /**
         * Gets the source point coordinates.
         * @returns A tuple [x1, y1] representing the source point.
         */
        source(): [number, number];
        /**
         * Sets the source point coordinates using a point tuple.
         * @param point - A tuple [x, y] representing the source point.
         * @returns The current component instance for method chaining.
         */
        source(point: [number, number]): this;
        /**
         * Sets the source point coordinates using separate x and y values.
         * @param x - The x coordinate of the source point.
         * @param y - The y coordinate of the source point.
         * @returns The current component instance for method chaining.
         */
        source(x: number, y: number): this;
        source(x?: number | [number, number], y?: number): [number, number] | this {
            if (arguments.length === 0) {
                return [this.x1(), this.y1()];
            } else if (arguments.length === 1) {
                const point = x as [number, number];
                return this.source(point[0], point[1]);
            }
            this.freeze()
                .x1(x as number)
                .y1(y as number)
                .unfreeze();
            return this;
        }

        /**
         * Gets the target point coordinates.
         * @returns A tuple [x2, y2] representing the target point.
         */
        target(): [number, number];
        /**
         * Sets the target point coordinates using a point tuple.
         * @param point - A tuple [x, y] representing the target point.
         * @returns The current component instance for method chaining.
         */
        target(point: [number, number]): this;
        /**
         * Sets the target point coordinates using separate x and y values.
         * @param x - The x coordinate of the target point.
         * @param y - The y coordinate of the target point.
         * @returns The current component instance for method chaining.
         */
        target(x: number, y: number): this;
        target(x?: number | [number, number], y?: number): [number, number] | this {
            if (arguments.length === 0) {
                return [this.x2(), this.y2()];
            } else if (arguments.length === 1) {
                const point = x as [number, number];
                return this.target(point[0], point[1]);
            }
            this.freeze()
                .x2(x as number)
                .y2(y as number)
                .unfreeze();
            return this;
        }

        /**
         * Shifts both source and target points horizontally by dx.
         * @param dx - The horizontal offset to apply.
         * @returns The current component instance for method chaining.
         */
        dx(dx: number): this {
            this.freeze();
            this.source(V.add(this.source(), [dx, 0]));
            this.target(V.add(this.target(), [dx, 0]));
            this.unfreeze();
            return this;
        }

        /**
         * Shifts both source and target points vertically by dy.
         * @param dy - The vertical offset to apply.
         * @returns The current component instance for method chaining.
         */
        dy(dy: number): this {
            this.freeze();
            this.source(V.add(this.source(), [0, dy]));
            this.target(V.add(this.target(), [0, dy]));
            this.unfreeze();
            return this;
        }
    };
}
