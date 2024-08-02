import { BaseNake } from "SD/Node/Nake/BaseNake";

export class Text extends BaseNake {
    constructor(parent: any);

    /**
     * 获取文本字体大小
     */
    fontSize(): number;
    
    /**
     * 设置文本字体大小
     * @param fontSize 
     */
    fontSize(fontSize: number): this;

    /**
     * 获取文本
     */
    text(): string;

    /**
     * 设置文本
     * @param text 
     */
    text(text: string): this;
}