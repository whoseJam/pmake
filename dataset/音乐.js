/*

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
import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();

// 定义输入字符串A和B
const A = [5, 6, 2, 10, 10, 7, 3, 2, 9];
const B = [1, 4, 4, 3, 2, 1];
const n = A.length;
const m = B.length;
const labelFontSize = 15;

// 离散化函数
function discretize(arr) {
    const uniqueChars = Array.from(new Set(arr)).sort((a, b) => a - b);
    const charMap = new Map();
    uniqueChars.forEach((char, index) => charMap.set(char, index));
    return arr.map(char => charMap.get(char));
}

function equal(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 将字符串B离散化
const discretizedB = discretize(B);

// 使用sd.Array存放字符串A
const arrA = new sd.Array(svg).pushArray(A);
const arrB = new sd.Array(svg).pushArray(B);

sd.init(() => {
    arrA.x(100).y(100);
    arrB.x(100).y(200);
});

sd.main(async () => {
    await sd.pause();
    arrB.forEachElement((element, index) => {
        element.startAnimate().childAs(new sd.Text(element, discretizedB[index]).fontSize(labelFontSize), R.aside("bc")).endAnimate();
    });

    const focus = sd.Focus(arrA);
    for (let i = 0; i <= n - m; i++) {
        await sd.pause();
        focus
            .startAnimate()
            .focus(i, i + m - 1)
            .endAnimate();
        await sd.pause();
        const subString = A.slice(i, i + m);
        const discretizedSubString = discretize(subString);
        for (let j = i; j < i + m; j++) {
            const element = arrA.element(j);
            element
                .startAnimate()
                .childAs("tmp", new sd.Text(element, discretizedSubString[j - i]).fontSize(labelFontSize), R.aside("bc"))
                .endAnimate();
        }

        if (equal(discretizedSubString, discretizedB)) {
            // 涂色操作
            await sd.pause();
            arrA.startAnimate()
                .color(i, i + m - 1, C.blue)
                .endAnimate();
            await sd.pause();
            arrA.startAnimate()
                .color(i, i + m - 1, C.white)
                .endAnimate();
        }

        await sd.pause();
        for (let j = i; j < i + m; j++) {
            const element = arrA.element(j);
            element.startAnimate().eraseChild("tmp").endAnimate();
        }
    }
});
