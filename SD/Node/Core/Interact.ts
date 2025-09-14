type ClickCallback = () => void;
type ValueCallback = (value: string) => void;
type DragCallback = (dx: number, dy: number) => [number, number];

export class Interact {
    private onclick: any;
    private ondblclick: any;
    private timeout: any;
    private onchange: any;
    private oninput: any;
}
