/*

luogu P1381

### 单词存储
1. 确定有 `n` 个单词，将这些单词通过硬编码的方式存储。使用 `sd.ValueStack` 组件来存储这些单词。例如，若 `n = 3`，单词分别为 "apple"、"banana"、"cherry"，则需要将它们正确存储到 `sd.ValueStack` 实例中。

### 文章存储
1. 已知文章由 `m` 个字母组成，把这篇文章看作一个数组，使用 `sd.Array` 组件来存储这篇文章。例如，文章为 "I like apples"，则相应地将字符数组存储到 `sd.Array` 实例中。

### 范围框选
1. 为用户提供交互功能，以便在文章中选出连续的一段。通过 `sd.Button` 组件结合两个 `sd.Input` 组件来实现范围框选功能。其中，两个 `sd.Input` 组件分别用于输入起始位置和结束位置，用户点击 `sd.Button` 时，确认所选范围。例如，用户在第一个 `sd.Input` 中输入 5，在第二个 `sd.Input` 中输入 9，点击 `sd.Button` 后，即表示选中文章中从第 5 个字符到第 9 个字符的这一段。

### 单词标红
1. 每次用户完成连续一段的选择后，需要将被包含在此段内的单词在文章中标记为红色。即遍历所选范围内的字符，检查是否包含 `sd.ValueStack` 中存储的单词，如果包含，则将该单词在文章中的显示颜色设置为红色。例如，若所选范围包含单词 "apple"，则需将文章中该单词的显示颜色变为红色。 

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();

// 存储单词
const wordCount = 3;
const words = ["apple", "like", "egg"];
const wordStack = new sd.ValueStack(svg).align("x").elementHeight(30);
for (let i = 0; i < wordCount; i++) {
    wordStack.push(words[i]);
}

// 存储文章
const article = "ppplikegggapples";
const articleArray = new sd.Array(svg).x(100).y(100);
// 创建输入框和按钮
const startInput = new sd.Input(svg);
const endInput = new sd.Input(svg);
const selectButton = new sd.Button(svg);

sd.init(() => {
    articleArray.start(1);
    sd.Index(articleArray);
    for (let i = 0; i < article.length; i++) {
        articleArray.push(article[i]);
    }
    wordStack.x(articleArray.x());
    wordStack.y(articleArray.my() + 20);
    startInput.x(articleArray.cx() + 40).y(articleArray.my() + 20);
    endInput.x(articleArray.cx() + 40).y(articleArray.my() + 60);
    sd.Label(startInput, "左端点");
    sd.Label(endInput, "右端点");
    selectButton
        .x(articleArray.cx() + 40)
        .y(articleArray.my() + 100)
        .text("选择")
        .onClick(() => {
            const start = parseInt(startInput.value());
            const end = parseInt(endInput.value());
            console.log(start, end);
            if (!isNaN(start) && !isNaN(end) && start > 0 && end <= article.length && start <= end) {
                console.log(start, end);
                sd.inter(async () => {
                    const coloredWords = [];
                    articleArray.startAnimate().color(start, end, C.red).endAnimate();
                    const selectedText = article.substring(start - 1, end);
                    for (let i = 0; i < wordCount; i++) {
                        const word = wordStack.element(i);
                        if (selectedText.includes(word.text())) {
                            word.startAnimate().color(C.red).endAnimate();
                            coloredWords.push(word);
                        }
                    }
                    await sd.pause();
                    articleArray.startAnimate().color(start, end, C.white).endAnimate();
                    coloredWords.forEach(word => word.startAnimate().color(C.black).endAnimate());
                });
            }
        });
});

sd.main(async () => {});
