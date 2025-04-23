import { BaseAxis } from "@/Node/Axis/BaseAxis";

type Direction = "horizontal" | "vertical";
type Ticks = "linear" | number;
type TickAlign = "center" | "source" | "target";
type TickLabelAlign = "source" | "target";

class Axis extends BaseAxis {
    length(): number;
    length(length: number): this;
    direction(): Direction;
    direction(direction: Direction): this;
    withTick(): boolean;
    withTick(withTick: boolean): this;
    withTickLabel(): boolean;
    withTickLabel(withTickLabel: boolean): this;
    tickLength(): number;
    tickLength(length: number): this;
    tickAlign(): TickAlign;
    tickAlign(align: TickAlign);
    fontSize(): number;
    fontSize(fontSize: number): this;
    tickLabelAlign(): TickLabelAlign;
    tickLabelAlign(align: TickLabelAlign): this;
}
