import * as sd from "@/sd";

const svg = sd.svg();
const CX = 600,
    CY = 300;

new sd.Rect({ targetNode: svg, x: 0, y: 0, width: 1200, height: 600, fill: "#050505" });

for (let i = 0; i < 150; i++) {
    new sd.Circle({
        targetNode: svg,
        cx: Math.random() * 1200,
        cy: Math.random() * 600,
        r: Math.random() * 1.5,
        fill: "#fff",
        opacity: Math.random() * 0.8 + 0.2,
    });
}

new sd.Circle({ targetNode: svg, cx: CX, cy: CY, r: 25, fill: "#FFD700" });

const planets = [
    { n: "Mercury", c: "#A5A5A5", s: 4, o: 40, v: 2.0, a: Math.random() * 6.28, el: null as any },
    { n: "Venus", c: "#E3BB76", s: 7, o: 65, v: 1.5, a: Math.random() * 6.28, el: null as any },
    { n: "Earth", c: "#4F86F7", s: 7.5, o: 95, v: 1.0, a: Math.random() * 6.28, el: null as any },
    { n: "Mars", c: "#E27B58", s: 5, o: 125, v: 0.8, a: Math.random() * 6.28, el: null as any },
    { n: "Jupiter", c: "#D6A574", s: 18, o: 175, v: 0.4, a: Math.random() * 6.28, el: null as any },
    { n: "Saturn", c: "#F4D03F", s: 15, o: 225, v: 0.3, a: Math.random() * 6.28, el: null as any, ring: null as any },
    { n: "Uranus", c: "#7DE3F4", s: 10, o: 265, v: 0.2, a: Math.random() * 6.28, el: null as any },
    { n: "Neptune", c: "#5B5DD1", s: 10, o: 295, v: 0.15, a: Math.random() * 6.28, el: null as any },
];

planets.forEach(p => {
    new sd.Circle({
        targetNode: svg,
        cx: CX,
        cy: CY,
        r: p.o,
        fill: "none",
        stroke: "#ffffff",
        strokeOpacity: 0.1,
        strokeWidth: 1,
    });

    if (p.n === "Saturn") {
        p.ring = new sd.Ellipse({
            targetNode: svg,
            cx: CX + p.o,
            cy: CY,
            rx: p.s * 2.2,
            ry: p.s * 0.6,
            fill: "none",
            stroke: "#C0A060",
            strokeWidth: 2,
            opacity: 0.6,
        })
            .setTransformOrigin("center", "center")
            .setRotation(20);
    }

    p.el = new sd.Circle({
        targetNode: svg,
        cx: CX + p.o,
        cy: CY,
        r: p.s,
        fill: p.c,
    });
});

sd.loopUpdate(() => {
    planets.forEach(p => {
        p.a += p.v * 0.01;
        const x = CX + Math.cos(p.a) * p.o;
        const y = CY + Math.sin(p.a) * p.o;
        p.el.setCx(x).setCy(y);
        if (p.ring) {
            p.ring.setCenterX(x).setCenterY(y);
        }
    });
});
