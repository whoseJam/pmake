import { BaseGraph } from "@/Node/Graph/BaseGraph";

/**
 * GridGraph divides its container into an n×m grid with 0-based indexing.
 * Use the `at` method to reference any position in the grid graph and place nodes
 * at specific coordinates.
 *
 * For precise control over graph component layout, use the GridGraph component
 * to explicitly position each node within a structured grid system.
 */
export class GridGraph extends BaseGraph {
    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;
    at(i: number, j: number): this;
}
