import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

type AspectRatioType =
    "XMinYMin meet"|"XMinYMin slice"|
    "XMinYMid meet"|"XMinYMid slice"|
    "XMinYMax meet"|"XMinYMax slice"|
    "XMidYMin meet"|"XMidYMin slice"|
    "XMidYMid meet"|"XMidYMid slice"|
    "XMidYMax meet"|"XMidYMax slice"|
    "XMaxYMin meet"|"XMaxYMin slice"|
    "XMaxYMid meet"|"XMaxYMid slice"|
    "XMaxYMax meet"|"XMaxYMax slice";

export class Image extends BaseNake {
    constructor(parent: SDNode);
    
    href(): string;
    href(href: string): void;
    aspectRatio(): string;
    aspectRatio(aspectRatio: AspectRatioType): this;
}