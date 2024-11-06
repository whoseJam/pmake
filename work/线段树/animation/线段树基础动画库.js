import * as sd from "@/sd";

const R = sd.rule();

export function createLazytagGraph(parent, oldTagList, newTagList, tagColor) {
    const graph = new sd.GridGraph(parent).height(80);
    const n = oldTagList.length + 1;
    const m = newTagList.length - 1;
    const gap1 = 1.0 / (n - 1);
    const gap2 = 1.0 / (m + 1);

    function id1(x) {
        return x + 1;
    }
    function id2(x) {
        return oldTagList.length + x + 10;
    }
    function math(text) {
        return new sd.Mathjax(graph, text);
    }
    for (let i = 0; i < n; i++) {
        graph.at(0, gap1 * i).newNode(id1(i), math(`e_${i}`)).element(id1(i)).rate(2);
        if (i > 0) {
            graph.link(id1(i-1), id1(i));
            const link = graph.element(id1(i-1), id1(i));
            link.value(math(oldTagList[i - 1]), R.pointAtPathByRate(0.5, "cx", "my", 0, -5)).arrow();
            if (i - 1 < oldTagList.length - 1) {
                link.stroke(tagColor[i - 1]).strokeWidth(3);
            }
        }
    }
    if (newTagList.length === 1) {
        const link = new sd.Curve(graph).arrow().stroke(tagColor[0]).strokeWidth(3);
        const e1 = graph.element(id1(0));
        const e2 = graph.element(id1(n - 1));
        graph.childAs("link_0", link, function(parent, child) {
            child.source(e1.center()).target(e2.center());
            sd.trim(child, e1, e2);
        });
        link.value(math(newTagList[0]), R.pointAtPathByRate(0.5, "cx", "y"));
    } else {
        for (let i = 0; i < m; i++) {
            graph.at(1, gap2 * (i+1)).newNode(id2(i), math(`e_${i + n}`)).element(id2(i)).rate(2);
            if (i > 1 && i < newTagList.length) {
                graph.link(id2(i-1), id2(i));
                const link = graph.element(id2(i-1), id2(i));
                link.value(math(newTagList[i]), R.pointAtPathByRate(0.5, "cx", "y")).arrow().stroke(tagColor[i]).strokeWidth(3);
            }
        }

        {   const link1 = new sd.Curve(graph).arrow().stroke(tagColor[0]).strokeWidth(3);
            const e1 = graph.element(id1(0));
            const e2 = graph.element(id2(0));
            graph.childAs("link_0", link1, function(parent, child) {
                child.source(e1.center()).target(e2.center());
                sd.trim(child, e1, e2);
            });
            link1.value(math(newTagList[0]), R.pointAtPathByRate(0.5, "mx", "y"));
        }
        {   const link2 = new sd.Curve(graph).arrow().stroke(tagColor[tagColor.length - 1]).strokeWidth(3);
            const e1 = graph.element(id2(m - 1));
            const e2 = graph.element(id1(n - 1));
            graph.childAs("link_1", link2, function(parent, child) {
                child.source(e1.center()).target(e2.center());
                sd.trim(child, e1, e2);
            });
            link2.value(math(newTagList[m]), R.pointAtPathByRate(0.5, "x", "y"));
        }
    }

    graph.nodes().forEach(node => {
        node.opacity(0);
    });
    const links = [...graph.links()];
    const bottomLinks = [];
    links.push(graph.child("link_0"));
    bottomLinks.push(graph.child("link_0"));
    for (let i = 0; i + 1 < m; i++) {
        bottomLinks.push(graph.element(id2(i), id2(i + 1)));
    }
    if (graph.child("link_1")) {
        links.push(graph.child("link_1"));
        bottomLinks.push(graph.child("link_1"));
    }
    links.forEach(link => {
        link.opacity(0);
    });

    graph.opacity(id1(0), 1);

    graph.showTagPath = async function() {
        await sd.pause();
        let last = 0;
        for (let i = 1; i < n - 1; i++) {
            const link = graph.element(id1(i-1), id1(i));
            link.after(last).opacity(1).startAnimate().pointStoT().endAnimate();
            last = link;
            
            const node = graph.element(id1(i));
            node.after(last).startAnimate().opacity(1).endAnimate();
            last = node;
        }
        await sd.pause();
        last = 0;
        for (let i = n - 1; i < n; i++) {
            const link = graph.element(id1(i-1), id1(i));
            link.after(last).opacity(1).startAnimate().pointStoT().endAnimate();
            last = link;
            
            const node = graph.element(id1(i));
            node.after(last).startAnimate().opacity(1).endAnimate();
            last = node;
        }
    }

    graph.showNewTagPath = async function() {
        await sd.pause();
        let last = 0;
        for (let i = 0; i < bottomLinks.length; i++) {
            const link = bottomLinks[i];
            link.after(last).opacity(1).startAnimate().pointStoT().endAnimate();
            last = link;

            const node = graph.element(id2(i));
            if (node) {
                node.after(last).startAnimate().opacity(1).endAnimate();
                last = node;
            }
        }
    }
    
    return graph;
}