import createGraph from "ngraph.graph";

let g = createGraph();
g.addNode('hello');
g.addNode('world');
g.addLink('space', 'bar');
g.addLink('hello', 'world');