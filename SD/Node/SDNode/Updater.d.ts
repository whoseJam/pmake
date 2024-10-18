import { SDNode } from "SD/Node/SDNode";

export class Updater {
    constructor(parent: SDNode);

    preUpdate();
    postUpdate();
    tryMove();
    update();
    freeze();
    unfreeze();
    freezing(): boolean;
    pendUpdate();
    tryUpdate();
    attachUpdate(callback: any): any;
    removeUpdate();
}