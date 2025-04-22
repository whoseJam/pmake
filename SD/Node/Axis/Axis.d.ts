import { BaseAxis } from "@/Node/BaseAxis";

type Direction = "horizontal" | "vertical";
type Ticks = "linear" | number;

class Axis extends BaseAxis {
    ticks(): Ticks;
    ticks(ticks: Ticks): this;
    length(): number;
    length(length: number): this;
    direction(): Direction;
    direction(direction: Direction): this;
}
