import { SDNode }    from "@/Node/SDNode";
import { D3Layer }   from "@/Node/SDNode/D3Layer";
import { BaseGraph } from "@/Node/Graph/BaseGraph";

type DAGRankDirType = "TB"|"BT"|"LR"|"RL";
type DAGAlignType = "UL"|"UR"|"DL"|"DR"|"C";

export class BoxDAG extends BaseGraph {
    constructor(parent: SDNode|D3Layer);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
    rankDir(): DAGRankDirType;
    rankDir(rankDir: DAGRankDirType): this;
    align(): DAGAlignType;
    align(align: DAGAlignType): this;
}