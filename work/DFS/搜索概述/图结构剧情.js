import * as sd from "@/sd";

const svg = sd.svg();
const dag = new sd.DAG(svg).width(200).height(200);
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [2, 4],
    [3, 5],
    [4, 6],
    [4, 7],
    [4, 8],
    [5, 8]
]

sd.init(() => {
    links.forEach(link => {
        dag.link(link[0], link[1]);
        dag.element(link[0], link[1]).arrow();
    });
})

sd.main(() => {
});