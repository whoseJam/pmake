import * as sd from "@/sd";

/**
 * 
 * @param {sd.BaseTree} lastTree 
 * @param {{
 *  OnNewNode: () => number
 *  OnCreateValueAtLeaf: (x: number) => void
 *  OnTreeCreated: (tree: sd.BinaryTree) => void
 * }} args
 */
export async function InsertBaseOn(lastTree, n, position, args, skipAll = false) {
    const svg = sd.svg();
    const C = sd.color();
    const OnNewNode = args.OnNewNode;
    const OnCreateValueAtLeaf = args.OnCreateValueAtLeaf;
    const OnTreeCreated = args.OnTreeCreated;
    const currentTree = new sd.BinaryTree(svg);
    
    if (OnTreeCreated) {
        // if (!skipAll) await sd.pause();
        await OnTreeCreated(currentTree);
    }

    async function Dfs(fa, childDirection, lastNode, l, r, position) {
        await sd.pause();

        const currentNodeId = OnNewNode();
        if (!fa) currentTree.startAnimate().root(currentNodeId).endAnimate();
        else currentTree.startAnimate().newNode(currentNodeId)[childDirection](fa, currentNodeId).endAnimate();
        const currentNode = currentTree.element(currentNodeId);
        currentNode.my_id = currentNodeId;
        currentNode.left_child = lastNode?.left_child;
        currentNode.right_child = lastNode?.right_child; 

        console.log("l=", l, "r=", r, "pos=", position);

        if (l === r) {
            if (OnCreateValueAtLeaf) {
                if (!skipAll) await sd.pause();
                await OnCreateValueAtLeaf(currentNodeId);
            }
            return currentNode;
        }

        const mid = (l + r) >> 1;
        if (position <= mid) {
            if (lastNode && lastNode.right_child) {
                console.log("link current_node=", currentNode, "right_child=", lastNode.right_child);
                sd.Link(currentNode, lastNode.right_child).stroke(C.red).strokeWidth(3).opacity(0).arrow().startAnimate().opacity(1).endAnimate();
            }
            currentNode.left_child = await Dfs(currentNodeId, "leftChild", lastNode?.left_child, l, mid, position);
        } else {
            if (lastNode && lastNode.left_child) {
                console.log("link current_node=", currentNode, "left_child=", lastNode.left_child);
                sd.Link(currentNode, lastNode.left_child).stroke(C.textBlue).strokeWidth(3).opacity(0).arrow().startAnimate().opacity(1).endAnimate();
            }
            currentNode.right_child = await Dfs(currentNodeId, "rightChild", lastNode?.right_child, mid + 1, r, position);
        }
        return currentNode;
    }

    await Dfs(undefined, undefined, lastTree?.root(), 1, n, position);
    return currentTree;
}