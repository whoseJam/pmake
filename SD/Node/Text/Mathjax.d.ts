import { Fragment } from "SD/SD";

export class Mathjax extends Fragment {
    constructor(parent: any);
    constructor(parent: any, text: string);

    math(text: string): this;
}