import * as sd from "#lib/slide";

console.log(MathJax);


let svg = sd.svg();
let C = sd.color();

function flatten(node) {
	let ans = [];
	let useNodes = node.selectAll("use");
	for (let i = 0; i < useNodes.length; i++) {
		let node = useNodes[i];
		let nakeNode = node.node;
		let src = nakeNode.getAttribute("xlink:href");
		src = Snap("#svg").select(src);
		let matrix = node.transform().globalMatrix;
		ans.push(Snap(src).clone().transform(matrix));
	}
	return ans;
}

main();

async function main() {
	let input1 = "\\frac A B"
    let input2 = "B"
    let output = sd.svg()._groups[0][0];

    let ans1 = MathJax.tex2svg(input1);
	let svg1 = ans1.children[0];
	svg1.children[1].id = "math1";
	let viewBox1 = svg1.viewBox;
    let frag1 = Snap.parse(svg1.innerHTML);
	Snap("#svg").add(frag1);
	let scale1 = (30 / 600);
    let mat1 = new Snap.Matrix().scale(scale1, -scale1);
	mat1.f = 30;

	let ans2 = MathJax.tex2svg(input2);
	let svg2 = ans2.children[0];
	svg2.children[1].id = "math2";
	let viewBox2 = svg2.viewBox;
	let frag2 = Snap.parse(svg2.innerHTML);
	Snap("#svg").add(frag2);
	let scale2 = (30 / 600);
	let mat2 = new Snap.Matrix().scale(scale2, -scale2);
	mat2.f = 30;
	
	let txt1 = Snap("#svg").select("#math1");
	txt1.drag().transform(mat1);
	
	let txt2 = Snap("#svg").select("#math2");
	console.log(txt2);
	txt2.drag().transform(mat2);
	txt2.attr({ opacity: 0.5 });
	
	await sd.pause();
	let from = flatten(txt1);
	let to = flatten(txt2);
	for (let i = 0; i < from.length; i++) {
		let local = from[i].transform().localMatrix.clone();
		console.log("beflc=", local);
		local = local.add(new Snap.Matrix().translate(1000, -1000));
		// local.e += 100;
		// local.f += 100;
		console.log("local=", local);
		from[i].transform(local);
		Snap("#svg").append(from[i]);
	}
	await sd.pause();
	for (let i = 0; i < to.length; i++) {
		from[i].animate({
			d: to[i].attr("d")
		}, 1500);
	}
}

