import * as sd from "../../lib/slide";

let svg = sd.svg();

main();

async function main() {
    let r1 = new sd.Tree(svg);
    r1._.makeLink = function(node) {
        return new sd.Curve(node).arrow();
    }
    r1.root(1);
    r1.link(1, 2);
    r1.link(1, 3);
}