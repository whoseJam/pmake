import { SDNode } from "@/Node/SDNode";

export class Factory {
    static handler(key: string);
    static handlerLowPrecise(key: string);
    static handlerMediumPrecise(key: string);
    static handlerHighPrecise(key: string);

    static action(node: SDNode, object: any, key: string, interp: (t: number) => void);
    static actionForCamera(node: SDNode, object: any, key: string, interp: (t: number) => void);
}
