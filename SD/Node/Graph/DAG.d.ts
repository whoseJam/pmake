import { BaseGraph } from "./BaseGraph";

type DAGRankDirType = "TB"|"BT"|"LR"|"RL";
type DAGAlignType = "UL"|"UR"|"DL"|"DR"|"C";

export class DAG extends BaseGraph {
    constructor(parent: any);

    rankDir(): DAGRankDirType;
    rankDir(rankDir: DAGRankDirType): this;
    align(): DAGAlignType;
    align(align: DAGAlignType): this;
}