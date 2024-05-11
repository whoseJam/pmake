
import * as sd from "../../lib/slide";

/**
 * @param {SDNode} node 
 * @param {string} main 
 * @param {Array<string>} list 
 * @param {sd.Text|sd.Mathjax} textType 
 */
export async function treeLikeUnorderedList(node, main, list, textType) {
    const tree = new sd.HorizontalValueTree(node).cx(600).cy(300);
    tree.root(1, new textType(tree, main));
    tree.layerWidth(200);
    for (let i = 0; i < list.length; i++) {
        tree.newNode(i + 2, new textType(tree, list[i]));
        tree.newLink(1, i + 2);
        tree.opacity(i + 2, 0).opacity(1, i + 2, 0);
    }
    for (let i = 0; i < list.length; i++) {
        await sd.pause();
        const e = tree.element(1, i + 2);
        e.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        const v = tree.element(i + 2);
        v.after(e).startAnimate().opacity(1).endAnimate();
    }
    return tree;
}