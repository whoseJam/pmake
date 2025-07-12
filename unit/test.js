import * as sd from "@/sd";

// Initialize the SVG canvas
const svg = sd.svg();

// Create three boxes representing (i,j), (i-1,j), and (i,j-1)
const boxIJ = new sd.Box(svg).x(200).y(100).width(50).height(50);
const boxIMinus1J = new sd.Box(svg).x(100).y(100).width(50).height(50);
const boxIJMinus1 = new sd.Box(svg).x(200).y(200).width(50).height(50);

// Add labels to the boxes
const labelIJ = new sd.Text(svg).text("(i,j)").x(200).y(160);
const labelIMinus1J = new sd.Text(svg).text("(i-1,j)").x(100).y(160);
const labelIJMinus1 = new sd.Text(svg).text("(i,j-1)").x(200).y(260);

// Create two lines with arrows to represent the transition
const lineFromIMinus1J = new sd.Line(svg).source(boxIMinus1J.mx(), boxIMinus1J.my()).target(boxIJ.mx(), boxIJ.my()).arrow(true).strokeWidth(2).opacity(0); // Initially hidden

const lineFromIJMinus1 = new sd.Line(svg).source(boxIJMinus1.mx(), boxIJMinus1.my()).target(boxIJ.mx(), boxIJ.my()).arrow(true).strokeWidth(2).opacity(0); // Initially hidden

sd.init(() => {
    // Initial setup using valid color format
    boxIJ.color("#ADD8E6"); // Light blue
    boxIMinus1J.color("#90EE90"); // Light green
    boxIJMinus1.color("#90EE90"); // Light green
});

sd.main(async () => {
    // Pause to show the initial state
    await sd.pause();

    // Animate the transition from (i-1,j) to (i,j)
    lineFromIMinus1J.startAnimate().opacity(1).endAnimate();
    await sd.pause();

    // Animate the transition from (i,j-1) to (i,j)
    lineFromIJMinus1.startAnimate().opacity(1).endAnimate();
    await sd.pause();

    // Highlight the (i,j) box after the transitions
    boxIJ.startAnimate().color("#0000FF").endAnimate(); // Blue
    await sd.pause();
});
