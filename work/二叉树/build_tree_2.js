import { sd } from "#lib/slide";

let C = sd.Color;
let svg = sd.svg();
let mid = " DBEAC";
let layer = " ABCDE";
let n = 5;
// let mid =   " DBHENIAFCOJQPRGLKM";
// let layer = " ABCDEFGHIJKNOPLMQR";
// let n = 18;

let cnt = 0;
let L = sd.make_1d(100);
let Mmid = sd.Array(svg).drag(true).x(100).y(100);
let Mlayer = sd.Array(svg).drag(true).x(100).y(150);
let ML = sd.Array(svg).drag(true).x(100).y(200).resize(n).start_from(1);

Mmid.hsj_push_array(mid, 1, n);
Mlayer.hsj_push_array(layer, 1, n);

function check(pos, cur){
    let flag = true;
	for(let i = pos - 1; i >= 1; i--){
		if(L[i] != 0){
			if(L[i] == cur) {
                flag = false;
                ML.color(i, C.red);
            } else ML.color(i, C.green);
			break;
		} else ML.color(i, C.green);
	}
	for(let i = pos + 1; i <= n; i++){
		if(L[i] != 0){
			if(L[i] == cur) {
                flag = false;
                ML.color(i, C.red);
            } else ML.color(i, C.green);
			break;
		} else ML.color(i, C.green);
	}
    return flag;
}

function At(x){
	for(let i=1; i<=n; i++)
		if(mid[i]==x) return i;
	return -1;
}

function Build(l, r, now){
	if(l>r)return 0;
	let pos = 0;
	for(let i = l; i <= r; i++){
		if(L[i] == now){
			pos = i;
			break;
		}
	}
	let id = ++cnt;
	let lc = Build(l,pos-1,now+1);
	let rc = Build(pos+1,r,now+1);
	return id;
}


async function main() {
    let cur = 1;
	for (let i = 1; i <= n; i++){
		let at = At(layer[i]);
        ML.start_animate();
        ML.color(at, C.blue);
        ML.end_animate();
        await sd.pause();

        ML.start_animate();
        if (check(at, cur) === true){
			L[at] = cur;
		}else{
			L[at] = ++cur;
		}
        ML.end_animate();
        await sd.pause();

        ML.start_animate();
        for (let j = 1; j <= n; j++)
            ML.color(j, C.white);
        ML.end_animate();
        await sd.pause();

        ML.value(at, sd.Text(ML, L[at]));
        await sd.pause();
	}
	// Build(1, n, 1);
}

main();