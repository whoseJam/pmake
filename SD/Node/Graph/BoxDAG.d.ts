import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";

type RankDir = "TB" | "BT" | "LR" | "RL";
type Align = "UL" | "UR" | "DL" | "DR" | "C";

export class BoxDAG extends BaseGraph {
    constructor(parent: SDNode);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
    rankDir(): RankDir;
    rankDir(rankDir: RankDir): this;
    align(): Align;
    align(align: Align): this;
}