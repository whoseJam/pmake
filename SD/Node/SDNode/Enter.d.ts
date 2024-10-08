import { SDNode } from "../SDNode";

export class Enter {
    static ordinary(parent: SDNode);
    static ordinary(parent: SDNode, layer: string);

    static fromExist(parent: SDNode);
    static fromExist(parent: SDNode, layer: string);

    static fromExistValue(parent: SDNode, value: SDNode);
    static fromExistValue(parent: SDNode, value: SDNode, layer: string);
}