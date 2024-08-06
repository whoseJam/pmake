import * as sd from "@/sd";

const svg = sd.svg();
const dag = new sd.BoxDAG(svg).width(160).height(100).rankDir("LR");

init();
main();

function init() {
    dag.freeze();
    dag.elementWidth(80).elementHeight(30);
    function link(a, b) {
        dag.link(a, b);
        dag.element(a, b).arrow();
    }
    link("我", "后辈1");
    link("我", "后辈2");
    link("我", "后辈3");
    dag.unfreeze();
}

async function main() {
    await sd.pause();
}