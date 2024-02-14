import { Text } from "../slide";
import { svg } from "../slide";

export function IntBoard(name, init=0) {
    let board = new Text(svg());
    let inner = init;
    board.text(`${name} = ${init}`);
    board.value = function(value) {
        if (value === undefined)
            return inner;
        inner = value;
        board.text(`${name} = ${inner}`);
        return this;
    }
    board.valueWithAnimate = function(value) {
        inner = value;
        board.startAnimate();
        board.opacity(0);
        board.endAnimate();
        board.text(`${name} = ${inner}`);
        board.startAnimate();
        board.opacity(1);
        board.endAnimate();
        return this;
    }
    return board;
}