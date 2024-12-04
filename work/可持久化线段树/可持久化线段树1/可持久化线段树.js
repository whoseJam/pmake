import * as sd from "@/sd";
import { InsertBaseOn } from "../_/InsertBaseOn";

const svg = sd.svg();
let tot = 0;

sd.init(() => {

})

sd.main(async () => {
    const t1 = await InsertBaseOn(undefined, 4, 1, {
        OnNewNode: OnNewNode,
        OnTreeCreated: (tree) => tree.x(100).y(100).layerHeight(130)
    });
    const t2 = await InsertBaseOn(t1, 4, 2, {
        OnNewNode: OnNewNode,
        OnTreeCreated: (tree) => tree.x(200).y(100).layerHeight(130)
    });
})

function OnNewNode() {
    return ++tot;
}