import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Create a 5x5 grid
const grid = new sd.Grid(svg);
grid.x(100).y(100);
grid.n(5).m(5).startN(1).startM(1);

// Text to show the transfer formula
const formulaText = new sd.Text(svg);
formulaText.text("f_{i,j} = f_{i-1,j} + f_{i,j-1}");
formulaText.x(300).y(450);
formulaText.fontSize(20);

// Arrow from (i-1,j) to (i,j)
const arrow1 = new sd.Polyline(svg, [
    [150, 200],
    [250, 200],
    [250, 250],
]);
arrow1.stroke(C.black).strokeWidth(2);

// Arrow from (i,j-1) to (i,j)
const arrow2 = new sd.Polyline(svg, [
    [200, 150],
    [200, 250],
    [250, 250],
]);
arrow2.stroke(C.black).strokeWidth(2);

// Get coordinates for the center cell (3,3)
const centerX = 100 + (3 - 1) * 40; // Assuming 40 is the cell width
const centerY = 100 + (3 - 1) * 40; // Assuming 40 is the cell height

// Create a rectangle to highlight the center cell
const centerCell = new sd.Rect(svg);
centerCell.x(centerX).y(centerY).width(40).height(40);

sd.init(() => {
    arrow1.opacity(0);
    arrow2.opacity(0);
    formulaText.opacity(0);
    centerCell.stroke(C.black).strokeWidth(1);
});

sd.main(async () => {
    // Animate the first arrow
    await sd.pause();
    arrow1.startAnimate().opacity(1).endAnimate().pointStoT();

    // Animate the second arrow
    await sd.pause();
    arrow2.startAnimate().opacity(1).endAnimate().pointStoT();

    // Show the transfer formula
    await sd.pause();
    formulaText.startAnimate().opacity(1).endAnimate();

    await sd.pause();
    centerCell.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
});
