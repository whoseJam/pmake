
export interface MyInterface {
    name: string;
    age: number;
}

export function myFunction(arg: MyInterface): string;

export class MyClass {
    constructor(name: string);
    method(param: number): void;
}

export { SDNode } from "./Node/SDNode";
export { SDValue } from "./Node/SDValue";
export { Rect } from "./Node/Nake/Rect";