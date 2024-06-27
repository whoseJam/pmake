import { Text } from "../SD";
import { svg } from "../SD";

export function ValueBoard(name, init=0) {
    let board = new Text(svg());
    let inner = init;
    board.text(`${name} = ${init}`);
    board.value = function(value) {
        if (value === undefined)
            return inner;
        inner = value;
        if (this.isAnimating()) {
            let length = this.duration();
            this.endAnimate();
            this.startAnimate(length / 2).opacity(0).endAnimate();
            this.text(`${name} = ${inner}`);
            this.startAnimate(length / 2).opacity(1).endAnimate();
        } else this.text(`${name} = ${inner}`);
        return this;
    }
    return board;
}