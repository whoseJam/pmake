import * as sd from "@/sd";

const svg = sd.svg();
const CX = 600,
    CY = 300;

const ps = [
    { d: 35, s: 4.1, c: "#aaa", r: 3, a: Math.random() * 6, e: null as any },
    { d: 55, s: 1.6, c: "#d80", r: 5, a: Math.random() * 6, e: null as any },
    { d: 75, s: 1, c: "#00f", r: 6, a: Math.random() * 6, e: null as any },
    { d: 100, s: 0.5, c: "#f00", r: 4, a: Math.random() * 6, e: null as any },
    { d: 145, s: 0.2, c: "#da8", r: 12, a: Math.random() * 6, e: null as any },
    { d: 195, s: 0.1, c: "#fd0", r: 10, a: Math.random() * 6, e: null as any },
    { d: 245, s: 0.05, c: "#0ff", r: 8, a: Math.random() * 6, e: null as any },
    { d: 290, s: 0.03, c: "#008", r: 7, a: Math.random() * 6, e: null as any },
];

new sd.Rect({ targetNode: svg, x: 0, y: 0, width: 1200, height: 600, fill: "#000" });
new sd.Circle({ targetNode: svg, cx: CX, cy: CY, r: 15, fill: "#fc0" });

ps.forEach(p => {
    new sd.Circle({ targetNode: svg, cx: CX, cy: CY, r: p.d, fill: "none", stroke: "#333", strokeWidth: 1 });
    p.e = new sd.Circle({
        targetNode: svg,
        cx: CX + Math.cos(p.a) * p.d,
        cy: CY + Math.sin(p.a) * p.d,
        r: p.r,
        fill: p.c,
    });
});

sd.loopUpdate(() => {
    ps.forEach((p, i) => {
        if (i !== 1) return;
        p.a += p.s * 0.012;
        console.log("a=", p.a, "cx=", CX + Math.cos(p.a) * p.d, "cy=", CY + Math.sin(p.a) * p.d);
        p.e.setCx(CX + Math.cos(p.a) * p.d).setCy(CY + Math.sin(p.a) * p.d);
    });
});
