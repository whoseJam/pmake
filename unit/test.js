import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Create a 5x5 grid
const grid = new sd.Grid(svg);
grid.n(5).m(5); // Set grid dimensions
grid.x(100).y(100);
grid.width(400).height(400);

// Highlight the center cell (3,3)
const centerCell = grid.element(3, 3);
centerCell.startAnimate().color(C.yellow).endAnimate();

// Highlight the cells from which the center cell receives transitions
const leftCell = grid.element(2, 3);
leftCell.startAnimate().color(C.blue).endAnimate();
const topCell = grid.element(3, 2);
topCell.startAnimate().color(C.blue).endAnimate();

// Draw arrows for the transitions using source/target coordinates
const arrow1 = new sd.Line(svg);
arrow1.source(leftCell.cx(), leftCell.cy()).target(centerCell.cx(), centerCell.cy()).stroke(C.black).width(2);

const arrow2 = new sd.Line(svg);
arrow2.source(topCell.cx(), topCell.cy()).target(centerCell.cx(), centerCell.cy()).stroke(C.black).width(2);

// Add text for the transition equation
const text = new sd.Text(svg);
text.text("f_{i,j}=f_{i-1,j}+f_{i,j-1}");
text.x(300).y(500);

sd.init(() => {
    // Initial setup
});

sd.main(async () => {
    await sd.pause(); // Wait for user to start

    // Animate the arrows appearing
    arrow1.startAnimate().opacity(1).endAnimate();
    arrow2.startAnimate().opacity(1).endAnimate();

    await sd.pause(); // Wait for user to proceed

    // Animate the text appearing
    text.startAnimate().opacity(1).endAnimate();
});
