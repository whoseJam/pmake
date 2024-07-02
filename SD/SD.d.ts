declare module 'SD' {
    export interface MyInterface {
        name: string;
        age: number;
    }

    export function myFunction(arg: MyInterface): string;

    export class MyClass {
        constructor(name: string);
        method(param: number): void;
    }
}