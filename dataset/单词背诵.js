/*

luogu P1381

### 需求文档

#### 1. 初始化阶段：
1. 使用 `sd.Array` 组件来展示灵梦想要背的单词列表 `wordsToMemorize`，其中包含 `n` 个单词，每个单词使用 `sd.Text` 组件表示。
2. 使用另一个 `sd.Array` 组件来展示文章中的单词列表 `articleWords`，其中包含 `m` 个单词，同样每个单词使用 `sd.Text` 组件 表示。
3. 将 `wordsToMemorize` 数组水平排列在画布的上方，每个单词之间留出适当间距。
4. 将 `articleWords` 数组水平排列在画布的下方，每个单词之间留出适当间距。

#### 2. 主要动画阶段：
1. 首先高亮显示 `wordsToMemorize` 数组中的每个单词，以表示这些是灵梦想要背的单词。
2. 逐个高亮显示 `articleWords` 数组中的单词，以表示文章内容。
3. 通过一个滑动窗口在 `articleWords` 数组上移动，并计算当前窗口内包含的 `wordsToMemorize` 中的单词数量（重复的单词只算一 个）。
4. 当滑动窗口移动时，高亮显示当前窗口内的单词，并记录当前窗口内包含的 `wordsToMemorize` 中的单词数量。
5. 当滑动窗口遍历完整个 `articleWords` 数组后，找出包含最多 `wordsToMemorize` 单词的窗口，并记录其长度。
6. 如果有多个窗口包含相同数量的 `wordsToMemorize` 单词，选择长度最短的窗口。

#### 3. 交互式设计：
1. 使用一个 `sd.Slider` 组件来手动控制滑动窗口的起始位置，并实时查看当前窗口内包含的 `wordsToMemorize` 单词数量以及窗口长度。
2. 当用户调整 `sd.Slider` 组件时，动画会更新当前窗口的位置，并高亮显示窗口内的单词，同时显示当前窗口内包含的 `wordsToMemorize` 单词数量。

#### 4. 布局设计：
1. `wordsToMemorize` 数组水平排列在画布的上方，每个单词用 `sd.Text` 组件表示，并适当留出间距。
2. `articleWords` 数组水平排列在画布的下方，同样每个单词用 `sd.Text` 组件表示，并适当留出间距。
3. 在 `articleWords` 数组下方，添加一个 `sd.Slider` 组件，用于控制滑动窗口的起始位置。
4. 在画布上显示当前窗口内包含的 `wordsToMemorize` 单词数量以及当前窗口长度，使用 `sd.Text` 组件来显示这些信息。

*/

/*
评价：
存在主要逻辑错误。（计算逻辑有问题）
AI尝试编写双指针算法，但是写错了。
视觉效果，布局不太行。
*/

import * as sd from "slidew";

// 创建画布
const svg = sd.svg();
const div = sd.div();
const C = sd.color();

// 单词列表和文章单词列表的初始化
const wordsToMemorize = ["apple", "banana", "cherry", "date", "fig", "grape", "kiwi"];
const n = wordsToMemorize.length;
const wordSet = new Set(wordsToMemorize);

const articleWords = ["apple", "banana", "cherry", "date", "banana", "fig", "grape", "kiwi", "tag", "tag", "banana", "date", "apple", "fig", "grape", "cherry", "date"];
const m = articleWords.length;

// 初始化单词数组，将单词显示在画布上
const wordsArray = new sd.Array(svg).y(10).elementWidth(60).dx(50).pushArray(wordsToMemorize);

const articleArray = new sd.Array(svg).y(100).elementWidth(60).dx(50).pushArray(articleWords);

// 使用双指针，寻找包含最多 wordsToMemorize 单词且长度最短的窗口
function findBestWindow(articleWords, wordSet) {
    let left = 0,
        right = 0;
    let bestCount = 0;
    let bestLength = Infinity;
    let bestStart = 0,
        bestEnd = 0;
    const counter = new Map(); // wordFromWordsToMemorize => 出现次数
    let uniqueWordsCount = 0;

    while (right < articleWords.length) {
        let word = articleWords[right];
        if (wordSet.has(word)) {
            if (!counter.has(word)) {
                counter.set(word, 0);
                uniqueWordsCount++;
            }
            counter.set(word, counter.get(word) + 1);
        }
        while (uniqueWordsCount === wordSet.size) {
            if (right - left + 1 < bestLength) {
                bestCount = uniqueWordsCount;
                bestLength = right - left + 1;
                bestStart = left;
                bestEnd = right;
            }
            let word = articleWords[left];
            if (wordSet.has(word)) {
                counter.set(word, counter.get(word) - 1);
                if (counter.get(word) === 0) {
                    counter.delete(word);
                    uniqueWordsCount--;
                }
            }
            left++;
        }
        right++;
    }

    // 若初始结果没有覆盖所有单词，则重新开始，但目标是最多单词而不是所有单词
    if (bestCount === 0) {
        left = 0;
        right = 0;
        uniqueWordsCount = 0;
        counter.clear();

        while (right < articleWords.length) {
            let word = articleWords[right];
            if (wordSet.has(word)) {
                if (!counter.has(word)) {
                    counter.set(word, 0);
                    uniqueWordsCount++;
                }
                counter.set(word, counter.get(word) + 1);
            }
            while (uniqueWordsCount >= bestCount) {
                if (right - left + 1 < bestLength && uniqueWordsCount >= bestCount) {
                    bestCount = uniqueWordsCount;
                    bestLength = right - left + 1;
                    bestStart = left;
                    bestEnd = right;
                }
                let word = articleWords[left];
                if (wordSet.has(word)) {
                    counter.set(word, counter.get(word) - 1);
                    if (counter.get(word) === 0) {
                        counter.delete(word);
                        uniqueWordsCount--;
                    }
                }
                left++;
            }
            right++;
        }
    }

    return [bestStart, bestEnd, bestCount];
}

// 找到最佳窗口并显示结果
let [bestStart, bestEnd, bestCount] = findBestWindow(articleWords, wordSet);
const resultText = new sd.Text(svg)
    .y(200)
    .fontSize(20)
    .text(`Best window starts at index ${bestStart}, ends at index ${bestEnd} (length ${bestEnd - bestStart + 1}) with ${bestCount} unique memorization words.`);

// 主要动画阶段
sd.main(async () => {
    // 高亮显示 wordsToMemorize 数组中的每个单词
    await sd.pause();

    wordsArray
        .startAnimate()
        .forEachElement((element, index) => {
            element.color(C.blue);
        })
        .endAnimate();

    await sd.pause();

    // 高亮显示最佳窗口
    articleArray
        .startAnimate()
        .forEachElement((element, index) => {
            if (index >= bestStart && index <= bestEnd) {
                if (wordsToMemorize.includes(articleWords[index])) {
                    element.color(C.green);
                } else {
                    element.color(C.orange);
                }
            } else {
                element.color(C.black);
            }
            resultText
                .startAnimate()
                .text(`The most memorized words window starts at ${bestStart} and ends at ${bestEnd} with a length of ${bestEnd - bestStart + 1} and contains ${bestCount} unique memorized words.`)
                .endAnimate();
        })
        .endAnimate();
});

// 交互式设计：使用 sd.Slider 控制滑动窗口的右端点
const slider = new sd.Slider(div)
    .min(0)
    .max(m - 1)
    .value(1)
    .x(10)
    .y(250)
    .width(500);
const windowCountText = new sd.Text(svg).x(10).y(250).fontSize(20).text("0");
slider.onChange(value => {
    let right = Math.floor(value);
    let left = 0;
    let maxCount = 0;
    let minLength = Infinity;
    let bestLeft = 0;
    const currentCounter = new Map();
    let currentUniqueCount = 0;

    for (let l = 0, r = 0; r <= right; r++) {
        let word = articleWords[r];
        if (wordSet.has(word)) {
            if (!currentCounter.has(word)) {
                currentCounter.set(word, 0);
                currentUniqueCount++;
            }
            currentCounter.set(word, currentCounter.get(word) + 1);
        }
        while (currentUniqueCount === wordSet.size) {
            if (r - l + 1 < minLength) {
                bestLeft = l;
                maxCount = currentUniqueCount;
                minLength = r - l + 1;
            }
            let word = articleWords[l];
            if (wordSet.has(word)) {
                currentCounter.set(word, currentCounter.get(word) - 1);
                if (currentCounter.get(word) === 0) {
                    currentCounter.delete(word);
                    currentUniqueCount--;
                }
            }
            l++;
        }
        if (currentUniqueCount > maxCount || (currentUniqueCount === maxCount && r - l + 1 < minLength)) {
            bestLeft = l;
            maxCount = currentUniqueCount;
            minLength = r - l + 1;
        }
    }

    windowCountText.text(`The best window (until word ${right}) starts at ${bestLeft}, ends at ${right} (length ${minLength}) and has ${maxCount} unique memorization words.`);

    for (let i = 0; i < m; i++) {
        if (i >= bestLeft && i <= right) {
            if (wordsToMemorize.includes(articleWords[i])) {
                articleArray.element(i).color(C.red);
            } else {
                articleArray.element(i).color(C.yellow);
            }
        } else {
            articleArray.element(i).color(C.grey);
        }
    }
});
