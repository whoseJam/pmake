export class Location {
    static scale(scale: number): this;
    static position(xLocator: "x" | "cx" | "mx", yLocator: "y" | "cy" | "my", dx: number, dy: number);

    static center(cx: number, cy: number): this;
    static center(vector: [number, number]): this;
    static center(): [number, number];

    static kQuantileLocation(locator: "x" | "y", size: "width" | "height"): (k: number) => number;
    static centerLocation(locator: "x" | "y", size: "width" | "height"): (x: number | undefined) => this | number;
    static maxiumLocation(locator: "x" | "y", size: "width" | "height"): (mx: number | undefined) => this | number;
    static moveLocation(locator: "x" | "y"): (d: number) => this;
}
