/*

luogu P10634

### 需求描述

#### 输入条件
1. 存在一个长度为 `n` 的字符串 `A`，该字符串由多种字符组成，其中 `n` 为正整数。
2. 存在一个长度为 `m` 的字符串 `B`，该字符串同样由多种字符组成，且满足 `m <= n`，`m` 也为正整数。
3. 可以用 sd.Array 来存放字符串。

#### 操作要求
1. **离散化定义**：离散化是指将字符串中的字符进行字符集范围缩小，但保持相对顺序的操作。例如，对于字符串 “abdz”，离散化后的结果为 “abcd”。
2. **匹配判断**：需要在字符串 `A` 中寻找所有长度为 `m` 的子串。对于每一个这样的子串，将其字符进行离散化处理，并与字符串 `B` 离散化后的结果进行比较。如果两者相等，则认为字符串 `B` 与该子串匹配。
3. **动画操作**：对于每一个匹配的子串，需要先后执行以下动画操作：
    - **涂色操作**：对该子串进行涂色，使其在视觉上与字符串 `A` 的其他部分区分开来。具体的涂色颜色可以指定（例如红色），或者根据需求设定某种规则来选择颜色。
    - **取消涂色操作**：取消对该子串的涂色，使其恢复到与字符串 `A` 其他部分相同的显示状态。

#### 输出要求
最终，字符串 `A` 应恢复到初始未涂色的状态，且上述动画操作过程需要清晰展示，以便用户能够直观看到哪些子串与字符串 `B` 匹配以及匹配子串的动画变化过程。

*/

/*
计算逻辑错误，动画逻辑正确。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

function discretize(arr) {
    const sorted = Array.from(arr).sort((a, b) => a - b);
    const uniqueSorted = Array.from(new Set(sorted));
    const map = new Map();
    uniqueSorted.forEach((char, idx) => {
        map.set(char, String.fromCharCode("a".charCodeAt(0) + idx));
    });
    return arr.map(char => map.get(char)).join("");
}

function findMatches(s, t) {
    const n = s.length;
    const m = t.length;
    if (n < m) return [];

    const matches = [];
    const tDiscretized = discretize(t.map(Number));

    for (let i = 0; i <= n - m; i++) {
        const subStr = s.slice(i, i + m).map(Number);
        const subStrDiscretized = discretize(subStr);
        let allTheSame = true;
        console.log(subStr, subStrDiscretized, tDiscretized);
        for (let j = 0; j < tDiscretized.length; j++) {
            if (subStrDiscretized[j] !== tDiscretized[j]) allTheSame = false;
        }
        if (subStrDiscretized === tDiscretized) {
            matches.push(i);
        }
    }

    return matches;
}

const stringA = ["5", "6", "2", "10", "10", "7", "3", "2", "9"];

const stringB = ["1", "4", "4", "3", "2", "1"];

const arrA = new sd.Array(svg).pushArray(stringA);
const arrB = new sd.Array(svg).pushArray(stringB).y(60);
arrB.forEachElement((element, index) => {
    element.color("#00ff00");
});

sd.main(async () => {
    await sd.pause();

    const matches = findMatches(stringA, stringB);

    for (const match of matches) {
        // 对匹配到的子串进行涂色操作
        for (let i = match; i < match + stringB.length; i++) {
            arrA.startAnimate().color(i, C.red).endAnimate();
        }

        await sd.pause();

        // 取消涂色操作，恢复到白色
        for (let i = match; i < match + stringB.length; i++) {
            arrA.startAnimate().color(i, C.white).endAnimate();
        }
    }
});
