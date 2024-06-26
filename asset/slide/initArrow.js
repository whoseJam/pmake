export function initArrow(currentSlide) {
    const arrows = currentSlide.getElementsByTagName("arrow");
    const nodes = currentSlide.getElementsByTagName("node");
    function findNodeCenter(name) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.getAttribute("name") === name) {
                const bbox = node.getBoundingClientRect();
                return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
            }
        }
        return null;
    }
    function getAngle(vec) {
        return Math.atan2(vec.y, vec.x) * (180 / Math.PI);
    }
    function getDelta(name1, name2) {
        const node1 = findNodeCenter(name1);
        const node2 = findNodeCenter(name2);
        if (!node1 || !node2) return "0deg";
        return {
            x: node2[0] - node1[0],
            y: node2[1] - node1[0],
            cx: (node1[0] + node2[0]) / 2,
            cy: (node1[1] + node2[1]) / 2
        };
    }
    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i];
        const vector = getDelta(
            arrow.getAttribute("from"),
            arrow.getAttribute("to"));
        if (!vector) return;
        arrow.style["display"] = "inline-block";
        arrow.style["position"] = "absolute";
        arrow.style["transform"] = `rotate(${getAngle(vector)}deg)`;
        arrow.style["left"] = `${vector.cx}px`;
        arrow.style["top"] = `${vector.cy}px`;
    }
}