import * as sd from "@/sd";

/**
 * @param {sd.TreeBase} tree
 */
export async function DSUOnTree(tree) {
    const C = sd.color();
    const rt = tree.root().nodeId;
    const focus = sd.Focus(tree);
    const count = u => {
        const children = tree.children(u);
        const nodeU = tree.element(u);
        nodeU.siz = 1;
        nodeU.son = undefined;
        for (let child of children) {
            count(child.nodeId);
            nodeU.siz += child.siz;
            if (!nodeU.son || nodeU.son.siz < child.siz) nodeU.son = child;
        }
    };
    const clear = u => {
        tree.color(u, C.white);
        const children = tree.children(u);
        children.forEach(child => {
            clear(child.nodeId);
        });
    };
    const add = u => {
        tree.color(u, C.green);
        const children = tree.children(u);
        children.forEach(child => {
            add(child.nodeId);
        });
    };
    const dfs = async u => {
        const children = tree.children(u);
        const nodeU = tree.element(u);
        for (let i = 0; i < children.length; i++) {
            if (children[i] !== nodeU.son) {
                await dfs(children[i].nodeId);
                await sd.pause();
                tree.startAnimate();
                clear(children[i].nodeId);
                tree.endAnimate();
            }
        }
        if (nodeU.son) await dfs(nodeU.son.nodeId);
        for (let i = 0; i < children.length; i++) {
            if (children[i] !== nodeU.son) {
                await sd.pause();
                tree.startAnimate();
                add(children[i].nodeId);
                tree.endAnimate();
            }
        }
        await sd.pause();
        tree.startAnimate().color(u, C.green).endAnimate();
        await sd.pause();
        focus.startAnimate().focus(u).endAnimate();
        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();
    };
    count(rt);
    await dfs(rt);
}
