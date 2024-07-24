import * as sd from "@/sd";

const svg = sd.svg();

main();

async function main() {
    const m = draw(svg, ["L_1", "L_2", "L_3"], (items) => {
        return new sd.Mathjax(svg, `送对${items}`);
    }, "一封也没有送对");
    m.childOne().forEach(child => child.height(18));
    m.childTwo().forEach(child => child.height(12));
    m.childThree().forEach(child => child.height(8));
    await sd.pause();
}

/**
 * 
 * @param {SDNode} node 
 * @param {Array<any>} items 
 * @param {(string) => SDNode} fmt 
 * @param {string} allHint 
 */
export function draw(node, items, fmt, allHint, args = {
    K1: 1,
    K2: 0.6,
    L: 100,
    R: 80,
}) {
    const x = 600;
    const y = 300;
    // 等边三角形长度
    let L = args["L"] ? args["L"] : 100;
    // 圆的半径
    const R = args["R"] ? args["R"] : 80;
    const length = items.length;
    const U = new sd.Rect(node);
    const vec = sd.vec();
    const identLength = () => {
        return L / Math.sqrt(3) / 2.0;
    }
    const getItems = (status) => {
        let result = "";
        for (let i = 0; i < length; i++)
            if ((status >> i) & 1) result += String(items[i]);
        return result;
    }
    const V1 = new sd.Circle(U).fillOpacity(0), dir1 = vec.makeComplex(identLength(), Math.PI/2);
    const V2 = new sd.Circle(U).fillOpacity(0), dir2 = vec.makeComplex(identLength(), Math.PI/6*7);
    const V3 = new sd.Circle(U).fillOpacity(0), dir3 = vec.makeComplex(identLength(), -Math.PI/6);
    dir1[1] = -dir1[1];
    dir2[1] = -dir2[1];
    dir3[1] = -dir3[1];
    U.childAs("V1", V1, (parent, child) => {
        child.r(R);
        child.cx(parent.cx());
        child.cy(parent.cy() - identLength() * 2);
    });
    U.childAs("V2", V2, (parent, child) => {
        child.r(R);
        child.cx(parent.cx() - Math.sqrt(3) * identLength());
        child.cy(parent.cy() + identLength());
    });
    U.childAs("V3", V3, (parent, child) => {
        child.r(R);
        child.cx(parent.cx() + Math.sqrt(3) * identLength());
        child.cy(parent.cy() + identLength());
    });
    U.childAs("All", new sd.Text(U, allHint), (parent, child) => {
        child.x(parent.x() + 5);
        child.y(parent.y() + 5);
    });
    const centerLocation = (nodes) => {
        let x = 0, y = 0;
        for (let node of nodes) {
            x += node.cx();
            y += node.cy();
        }
        return [x / nodes.length, y / nodes.length];
    }
    const setLocation = (node, vec) => {
        node.cx(vec[0]);
        node.cy(vec[1]);
    }
    const K1 = args["K1"] ? args["K1"] : 1;
    const K2 = args["K2"] ? args["K2"] : 0.6;
    U.childAs("One_1", fmt(getItems(0b001)), (parent, child) => {
        setLocation(child, vec.add(centerLocation([V1]), vec.numberMul(dir1, K1)));
    });
    U.childAs("One_2", fmt(getItems(0b010)), (parent, child) => {
        setLocation(child, vec.add(centerLocation([V2]), vec.numberMul(dir2, K1)));
    });
    U.childAs("One_3", fmt(getItems(0b100)), (parent, child) => {
        setLocation(child, vec.add(centerLocation([V3]), vec.numberMul(dir3, K1)));
    });
    U.childAs("Two_12", fmt(getItems(0b011)), (parent, child) => {
        const center = centerLocation([V1, V2]);
        const dir = vec.identity(vec.add(dir1, dir2));
        const target = vec.add(center, vec.numberMul(dir, K2 * identLength()));
        setLocation(child, target);
    });
    U.childAs("Two_13", fmt(getItems(0b101)), (parent, child) => {
        const center = centerLocation([V1, V3]);
        const dir = vec.identity(vec.add(dir1, dir3));
        const target = vec.add(center, vec.numberMul(dir, K2 * identLength()));
        setLocation(child, target);
    });
    U.childAs("Two_23", fmt(getItems(0b110)), (parent, child) => {
        const center = centerLocation([V2, V3]);
        const dir = vec.identity(vec.add(dir2, dir3));
        const target = vec.add(center, vec.numberMul(dir, K2 * identLength()));
        setLocation(child, target);
    });
    U.childAs("Three_123", fmt(getItems(0b111)), (parent, child) => {
        setLocation(child, centerLocation([V1, V2, V3]));
    });
    U.width(L * 3.5);
    U.height(L * 3.5);
    U.cx(x).cy(y);
    U.childOne = () => {
        return [
            U.child("One_1"),
            U.child("One_2"),
            U.child("One_3")
        ];
    }
    U.childTwo = () => {
        return [
            U.child("Two_12"),
            U.child("Two_13"),
            U.child("Two_23")
        ];
    }
    U.childThree = () => {
        return [
            U.child("Three_123")
        ];
    };
    return U;
}