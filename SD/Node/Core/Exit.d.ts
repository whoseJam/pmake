import { SDNode } from "@/Node/SDNode";

export class Exit {
    /**
     * 子节点逐渐从不透明变成透明，从正确的位置上消失
     */
    static fade(): (element: SDNode) => void;

    /**
     * 子节点从父节点上脱落到场景中，但不修改自己的位置，也不改变自己的透明度
     */
    static drop(): (element: SDNode) => void;
}

export function exit(): typeof Exit;
