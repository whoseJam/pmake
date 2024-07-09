import { Context } from "@/Animate/Context";
import { Text } from "@/Node/Nake/Text";
import { svg } from "@/Interact/Svg";

export function ValueBoard(name, init = 0) {
    const board = new Text(svg());
    
    let inner = init;
    
    board.text(`${name} = ${init}`);
    
    board.value = function(value) {
        if (value === undefined)
            return inner;
        inner = value;

        const context = new Context(this);
        context.till(0, 0.5);
        this.opacity(0);
        context.till(0.5, 0.5);
        this.text(`${name} = ${inner}`);
        context.till(0.5, 1);
        this.opacity(1);

        return this;
    }
    return board;
}