import * as sd from "@/sd";

/**
 * @param {sd.Array} str 
 * @param {Array<number>} len 
 * @param {{
 *  OnTreeCreated: (tree: sd.HorizontalValueTree) => void
 * }} args 
 */
export async function BuildFailTreeFromLen(str, len, args) {
    const svg = sd.svg();

    await sd.pause();
    const links = [];
    for (let i = 1; i <= str.length(); i++) {
        const link = new sd.Curve(svg).bending(-0.5);
        link.source(str.element(len[i]).pos("cx", "y"));
        link.target(str.element(i).pos("cx", "y"));
        link.startAnimate().pointTtoS().endAnimate().revArrow();
        links.push({
            link: link,
            fa: len[i],
            u: i
        });
    }

    await sd.pause();
    const tree = new sd.HorizontalValueTree(svg);
    if (OnTreeCreated) {
        await OnTreeCreated(tree);
    }
    tree.freeze();
    tree.startAnimate();
    for (let i = 0; i <= str.length(); i++) {
        tree.newNodeFromExistElement(i, str.element(i));
        if (i > 0) {
            const link = links[i - 1];
            link.link.startAnimate().bending(0).endAnimate();
            tree.newLinkFromExistElement(link.fa, link.u, link.link);
        }
    }
} 