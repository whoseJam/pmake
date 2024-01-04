import * as sd from "#lib/slide";

let svg = sd.svg();
let arr = sd.BarArray(svg).x(200).y(400);
let data = [5, 2, 4, 1, 6, 3];
for (let i = 0; i < data.length; i++) {
    arr.push(data[i]);
    console.log(arr.element(i));
    arr.element(i).children.push(sd.Text(svg, data[i]).fontSize(20), function(parent, child) {
        child.cx(parent.cx()).y(parent.my() + 10);
    });
}