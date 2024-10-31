
export class Dom {
    /**
     * 创建一个 HTML 元素
     * @param tag 
     * @param id 
     */
    static createElement(tag: string, id: number|string): HTMLElement;
    
    /**
     * 创建一个 HTML 元素，并附加到 body 后面
     * @param tag 
     * @param id 
     */
    static createElementAndAppendToBody(tag: string, id: number|string): HTMLElement;

    /**
     * 创建一个 SVG 元素
     * @param tag 
     * @param id 
     */
    static createSVGElement(tag: string, id: number|string): SVGElement;
    
    /**
     * 获取特定 id 的元素
     * @param id 
     */
    static getByID(id: number|string): Element;

    /**
     * 获取一个元素的标签名
     * @param element 
     */
    static tagName(element: Element): string;

    /**
     * 获取一个元素的父元素
     * @param element 
     */
    static parent(element: Element): Element;

    /**
     * 为某个元素添加监听回调
     * @param element 
     * @param event 
     * @param callback 
     */
    static addEventListener(element: Element, event: string, callback: any): void;

    /**
     * 移除某个元素上的监听回调
     * @param element 
     * @param event 
     * @param callback 
     */
    static removeEventListener(element: Element, event: string, callback: any): void;

    /**
     * 克隆一个元素
     * @param element 
     */
    static clone(element);

    /**
     * 深度克隆一个元素，包括它的所有后代
     * @param element 
     */
    static deepClone(element);
}