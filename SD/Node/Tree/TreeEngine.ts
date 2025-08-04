import { Vertex } from "@/Node/Element/Vertex";
import { BasePath } from "@/Node/Path/BasePath";
import { SD2DNode } from "@/Node/SD2DNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { BinaryTree } from "@/Node/Tree/BinaryTree";
import { Splay } from "@/Node/Tree/Splay";
import { trim } from "@/Utility/Trim";
import { hierarchy, stratify, tree as tree_ } from "d3";

export class TreeEngine {
    static layout<NodeElement extends SD2DNode, NodeValue extends SD2DNode, LinkElement extends BasePath, LinkValue extends SD2DNode>(
        tree: BaseTree<NodeElement, NodeValue, LinkElement, LinkValue>,
        params: {
            width: number;
            height: number;
            location: (layout: any) => [number, number];
            size?: (node: NodeElement) => void;
        }
    ) {
        try {
            const size = params.size;
            const location = params.location;
            const template = stratify();
            template.id(node => tree.nodeId(node as NodeElement));
            template.parentId(node => tree.fatherId(node as NodeElement));
            const data = template(tree.nodes());
            const root = hierarchy(data);
            const layout = tree_().size([params.width, params.height]);
            // @ts-ignore
            const result = layout(root);
            const nodes = result.descendants();
            const nodesMap = new Map();
            nodes.forEach(node => {
                // @ts-ignore
                nodesMap.set(node.data.data, node);
            });
            tree.forEachNode(node => {
                const layout = nodesMap.get(node);
                // @ts-ignore
                tree.tryUpdate(node, () => {
                    if (size) size(node);
                    // @ts-ignore
                    node.center(location(layout));
                });
            });
            tree.forEachLink((link, sourceId, targetId) => {
                const source = tree.findNodeById(sourceId);
                const target = tree.findNodeById(targetId);
                // @ts-ignore
                tree.tryUpdate(link, () => {
                    // @ts-ignore
                    link.source(source.center());
                    // @ts-ignore
                    link.target(target.center());
                    trim(link, source, target);
                });
            });
        } catch (err) {
            tree.forEachNode(node => {
                if (tree.inRange(node.center())) return;
                tree.tryUpdate(node, () => {
                    node.center(tree.pos("x", "y"));
                });
            });
            tree.forEachLink((link, sourceId, targetId) => {
                const source = tree.findNodeById(sourceId);
                const target = tree.findNodeById(targetId);
                // @ts-ignore
                tree.tryUpdate(link, () => {
                    // @ts-ignore
                    link.source(source.center());
                    // @ts-ignore
                    link.target(target.center());
                    trim(link, source, target);
                });
            });
        }
    }
    static binaryLayout(
        tree: BinaryTree,
        params: {
            width: number;
            location: (layout: any) => [number, number];
            size?: (node: Vertex) => void;
        }
    ) {
        try {
            const location = params.location;
            const size = params.size;
            const roots = tree.findNodes(node => tree.father(node) === undefined);
            if (roots.length !== 1) throw new Error("Tree Structure Error");
            const dfs = (current: Vertex, rank: number, gap: number, depth: number) => {
                tree.tryUpdate(current, () => {
                    if (size) size(current);
                    current.center(location({ rank, gap, depth }));
                });
                if (tree.leftChild(current)) dfs(tree.leftChild(current), rank * 2, gap / 2, depth + 1);
                if (tree.rightChild(current)) dfs(tree.rightChild(current), rank * 2 + 1, gap / 2, depth + 1);
            };
            dfs(roots[0], 0, params.width / 2, 0);
            tree.forEachLink((link, sourceId, targetId) => {
                const source = tree.findNodeById(sourceId);
                const target = tree.findNodeById(targetId);
                tree.tryUpdate(link, () => {
                    link.source(source.center());
                    link.target(target.center());
                    trim(link, source, target);
                });
            });
        } catch (err) {
            tree.forEachNode(node => {
                if (tree.inRange(node.center())) return;
                tree.tryUpdate(node, () => {
                    node.center(tree.pos("x", "y"));
                });
            });
            tree.forEachLink((link, sourceId, targetId) => {
                const source = tree.findNodeById(sourceId);
                const target = tree.findNodeById(targetId);
                tree.tryUpdate(link, () => {
                    link.source(source.center());
                    link.target(target.center());
                    trim(link, source, target);
                });
            });
        }
    }
    static splayLayout(
        tree: Splay,
        params: {
            width: number;
            location: (node: { i: number; depth: number; gap: number }) => [number, number];
            size?: (node: Vertex) => void;
        }
    ) {
        try {
            const location = params.location;
            const size = params.size;
            const roots = tree.findNodes(node => tree.father(node) === undefined);
            if (roots.length !== 1) throw new Error("Tree Structure Error");
            const sequence: Array<[Vertex, number]> = [];
            const dfs = (current: Vertex, depth: number) => {
                if (tree.leftChild(current)) dfs(tree.leftChild(current), depth + 1);
                sequence.push([current, depth]);
                if (tree.rightChild(current)) dfs(tree.rightChild(current), depth + 1);
            };
            dfs(roots[0], 1);
            const gap = params.width / (sequence.length + 1);
            for (const [i, pack] of sequence.entries()) {
                const node = pack[0];
                tree.tryUpdate(node, () => {
                    if (size) size(node);
                    node.center(
                        location({
                            i,
                            gap,
                            depth: pack[1],
                        })
                    );
                });
            }
            tree.forEachLink((link, sourceId, targetId) => {
                const source = tree.findNodeById(sourceId);
                const target = tree.findNodeById(targetId);
                tree.tryUpdate(link, () => {
                    link.source(source.center());
                    link.target(target.center());
                    trim(link, source, target);
                });
            });
        } catch (err) {
            tree.forEachNode(node => {
                if (tree.inRange(node.center())) return;
                tree.tryUpdate(node, () => {
                    node.center(tree.pos("x", "y"));
                });
            });
            tree.forEachLink((link, sourceId, targetId) => {
                const source = tree.findNodeById(sourceId);
                const target = tree.findNodeById(targetId);
                tree.tryUpdate(link, () => {
                    link.source(source.center());
                    link.target(target.center());
                    trim(link, source, target);
                });
            });
        }
    }
}
