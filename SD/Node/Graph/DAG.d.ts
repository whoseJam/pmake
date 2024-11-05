import { SDNode }    from "@/Node/SDNode";
import { BaseGraph } from "@/Node/Graph/BaseGraph";

type DAGRankDirType = "TB"|"BT"|"LR"|"RL";
type DAGAlignType = "UL"|"UR"|"DL"|"DR"|"C";

export class DAG extends BaseGraph {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
    rankDir(): DAGRankDirType;
    rankDir(rankDir: DAGRankDirType): this;
    align(): DAGAlignType;
    align(align: DAGAlignType): this;
}