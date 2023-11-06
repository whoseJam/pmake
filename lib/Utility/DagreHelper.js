
export const DagreHelper = {
    graphBox: graphBox
};

function graphBox(graph) {
    let minX, maxX, minY, maxY;
    graph.nodes().forEach(function(info) {
        let layout = graph.node(info);
        if (minX === undefined) {
            minX = maxX = layout.x;
            minY = maxY = layout.y;
        } else {
            minX = Math.min(minX, layout.x);
            maxX = Math.max(maxX, layout.x);
            minY = Math.min(minY, layout.y);
            maxY = Math.max(maxY, layout.y);
        }
    })
    if (minX === undefined)
        minX = maxX = minY = maxY = 0;
    return {
        x: minX, y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}