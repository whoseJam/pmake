import * as sd from "@/sd";

const svg = sd.svg();
const C_ = sd.color();

sd.init(() => {
    vennDiagram3();
});

sd.main(async () => {});

function vennDiagram3() {
    const V = sd.vec();
    const arcDict = {
        0: -Math.PI / 2,
        1: (-Math.PI * 7) / 6,
        2: (+Math.PI * 1) / 6,
    };
    function MoveDelta(center, r, type) {
        return V.add(center, V.makeComplex(r, arcDict[type]));
    }
    function GetBoxCenter(parent) {
        const x = parent.cx();
        const y = parent.ky(0.55);
        return [x, y];
    }
    const R1 = 0.55;
    const venn = new sd.Rect(svg).width(200).height(200).x(100).y(100);
    const A = new sd.Circle(venn).fillOpacity(0);
    const B = new sd.Circle(venn).fillOpacity(0);
    const C = new sd.Circle(venn).fillOpacity(0);
    A.childAs(new sd.Math(A, "A"), (parent, child) => {
        const point = MoveDelta(parent.center(), parent.r(), 0);
        child.cx(point[0]).y(point[1] + 5);
    });
    B.childAs(new sd.Math(B, "B"), (parent, child) => {
        const point = MoveDelta(parent.center(), parent.r(), 1);
        child.x(point[0]).my(point[1]);
    });
    C.childAs(new sd.Math(C, "C"), (parent, child) => {
        const point = MoveDelta(parent.center(), parent.r(), 2);
        child.mx(point[0]).my(point[1]);
    });
    venn.childAs(A, (parent, child) => {
        child.r((parent.width() * R1) / 2).center(MoveDelta(GetBoxCenter(parent), parent.width() * 0.2, 0));
    });
    venn.childAs(B, (parent, child) => {
        child.r((parent.width() * R1) / 2).center(MoveDelta(GetBoxCenter(parent), parent.width() * 0.2, 1));
    });
    venn.childAs(C, (parent, child) => {
        child.r((parent.width() * R1) / 2).center(MoveDelta(GetBoxCenter(parent), parent.width() * 0.2, 2));
    });
    venn.childAs(new sd.Math(venn, "U"), (parent, child) => {
        child.mx(parent.mx() - 5);
        child.my(parent.my() - 5);
    });

    const vAB = V.polyIntersect(A, B).fillOpacity(0.2).color(C_.blue);
    const vBC = V.polyIntersect(B, C).fillOpacity(0.2).color(C_.green);
    const vAC = V.polyIntersect(A, C).fillOpacity(0.2).color(C_.red);
    const vABC = V.polyIntersect(A, B, C).fillOpacity(0.2).color(C_.purple);

    return venn;
}
