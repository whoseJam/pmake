/*
codeforces 1545B

## 需求文档

### 初始化阶段：
1. **棋盘表示：**
   - 使用一个 `sd.Array` 组件来表示一个长为 $n$ 的棋盘，其中每个元素代表一个位置。空位置可以用一个透明或颜色较浅的 `sd.Rect` 来表示，而棋子则用一个颜色较深的 `sd.Circle` 来表示。如果位置为 `0`，代表一个空位置（使用一个没有填充颜色或浅色填充的 `sd.Rect` 表示），如果位置为 `1`，代表有一个棋子（使用一个颜色较深的 `sd.Circle` 表示）。
    
### 主要动画阶段：
1. **操作的动画：**
   - 当满足条件 `i + 2 <= n`，且第 $i$ 个位置有棋子，第 $i + 1$ 个位置也有棋子，第 $i + 2$ 个位置是空的时候，将第 $i$ 个 位置的棋子“移动”到第 $i + 2$ 个位置（即原先第 $i$ 个位置上的 `sd.Circle` 被移除并在第 $i + 2$ 个位置添加一个新的 `sd.Circle`，此时第 $i$ 个位置变为空位置，使用 `sd.Rect` 表示）。
   - 同理，如果满足条件 `i - 2 >= 1`，且第 $i$ 个位置有棋子，第 $i - 1$ 个位置也有棋子，第 $i - 2$ 个位置是空的时候，将第 $i$ 个位置的棋子“移动”到第 $i - 2$ 个位置（将原先第 $i$ 个位置上的 `sd.Circle` 被移除并在第 $i - 2$ 个位置添加一个新的 `sd.Circle`，此时第 $i$ 个位置变为空位置，使用 `sd.Rect` 表示）。
   - 使用动画效果展示棋子从第 $i$ 个位置移动到第 $i+2$ 或第 $i-2$ 个位置上的过程。

### 交互式设计：
1. **用户交互：**
   - 添加两个 `sd.Button` 组件，一个表示“向左跳”状态，另一个表示“向右跳”状态。同一时刻只可能处于其中一种状态。
   - 当处于“向左跳”状态时，用户点击某个棋子，如果满足条件（第 $i$ 个位置有棋子，第 $i - 1$ 个位置也有棋子，第 $i - 2$ 个 位置是空且 $i - 2 \geq 1$），则将该棋子向左跳跃一次，并展示相应的动画效果。
   - 当处于“向右跳”状态时，用户点击某个棋子，如果满足条件（第 $i$ 个位置有棋子，第 $i + 1$ 个位置也有棋子，第 $i + 2$ 个 位置是空且 $i + 2 \leq n$），则将该棋子向右跳跃一次，并展示相应的动画效果。

### 布局设计：
1. **棋盘的布局：**
   - 棋盘的初始布局由一个硬编码的01字符串决定，按照字符串的顺序将棋子或空位置放入 `sd.Array` 组件中，保证每个位置对齐。

*/

/*
评价：
错误的动画逻辑。错误的计算逻辑。
对 sd.Array 理解偏差严重。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const div = sd.div();
const R = sd.rule();

const boardString = "0110001100001011000"; // 可以修改为其他字符串
const n = boardString.length;
const board = new sd.Array(svg).resize(n).forEachElement((element, i) => {
    element.width(40).height(40);
});

function initBoard(boardState) {
    board.forEachElement((element, i) => {
        element.eraseChild(0); // Remove previous children
        if (boardState[i] === "1") {
            element.value(new sd.Circle(element).color(C.blue));
        } else {
            element.value(null);
        }
    });
}

initBoard(boardString.split(""));

// 交互按钮
const leftButton = new sd.Button(div).text("向左跳").x(0).y(50);
const rightButton = new sd.Button(div).text("向右跳").x(100).y(50);
let currentBoardState = boardString;

leftButton.onClick(() => {
    sd.inter(async () => {
        const newBoardState = boardStateAfterMove(currentBoardState, "left");
        if (newBoardState !== currentBoardState) {
            currentBoardState = newBoardState;
            initBoard(currentBoardState.split(""));
        }
    });
});

rightButton.onClick(() => {
    sd.inter(async () => {
        const newBoardState = boardStateAfterMove(currentBoardState, "right");
        if (newBoardState !== currentBoardState) {
            currentBoardState = newBoardState;
            initBoard(currentBoardState.split(""));
        }
    });
});

function boardStateAfterMove(boardState, direction) {
    const newBoardState = boardState.split("");
    for (let i = 0; i < n; i++) {
        if (direction === "left" && i >= 2 && newBoardState[i] === "1" && newBoardState[i - 1] === "1" && newBoardState[i - 2] === "0") {
            newBoardState[i] = "0";
            newBoardState[i - 2] = "1";
            return newBoardState.join("");
        }
        if (direction === "right" && i < n - 2 && newBoardState[i] === "1" && newBoardState[i + 1] === "1" && newBoardState[i + 2] === "0") {
            newBoardState[i] = "0";
            newBoardState[i + 2] = "1";
            return newBoardState.join("");
        }
    }
    return boardState;
}

sd.main(async () => {
    const text = new sd.Text(svg)
        .text("Initial state: " + boardString)
        .cx(50)
        .y(-50);
});
