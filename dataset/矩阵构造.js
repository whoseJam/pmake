/*

luogu P3208

### 一、动画主题
通过可视化动画展示根据 $2\times 2$ 子矩阵和推算原矩阵的过程，以及体现字典序最小矩阵的求解思路。

### 二、动画场景设计
1. **初始界面**
    - 有一个网格区域用于展示输入的以格子 $(i,j)$ 为右下角的 $2\times 2$ 子矩阵中的数的和（输入格式中的后续 $n$ 行数据）。
    - 旁边有一个“初始化”按钮。
2. **计算过程展示**
    - 当点击“初始化”按钮后，动画开始。
    - 首先展示初始化的过程，在画面中绘制一个空白的 $n\times m$ 矩阵框架，准备填入数据。
    - 以动态的方式，开始随机生成第一行的数据与第一列。
    - 在确定第一行数据与第一列数据后，展示根据第一行和第一列数据逐步填充整个矩阵的过程。每个填充的格子会以淡入的效果出现数值，并且有线条连接相关的 $2\times 2$ 子矩阵区域，展示数据之间的推导关系。

### 三、交互设计
1. 点击“初始化”按钮触发动画。

### 四、元素设计
1. **矩阵**：可以用 sd.Grid，以表格形式呈现，格子有一定的边框和填充颜色，方便区分不同的格子。
2. **按钮**：可以用 sd.Button 设计简洁，有明显的点击反馈效果，如颜色变化或轻微的动画效果。
3. **数值显示**：可以用 sd.Grid 的 insert 或者 value 方法，在格子内和相关提示区域，以清晰易读的字体显示数值。
5. **辅助线条和标记**：用不同颜色的线条和标记来展示数据之间的关系、范围变化以及比较字典序时的关键位置。 

*/

/*
动画逻辑错误
计算逻辑错误
*/

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

const N = 3,
    M = 3,
    P = 3;
const SUM_MATRIX = [
    [0, 0, 0],
    [0, 4, 5],
    [0, 5, 3],
];

function gridLabelGrid(label, grid, top) {
    return new sd.Text(svg, label)
        .cx(grid.center()[0])
        .y(top ? grid.y() - 30 : grid.y() + grid.height() + 30)
        .fontSize(24)
        .color(C.black);
}

const sumMatrixGrid = new sd.Grid(svg)
    .n(N + 1)
    .m(M + 1)
    .dy(50);
const sumMatrixLabel = gridLabelGrid("Sum Matrix:", sumMatrixGrid, true);

const originalMatrixGrid = new sd.Grid(svg).n(N).m(M).dy(250);
const originalMatrixLabel = gridLabelGrid("Original Matrix:", originalMatrixGrid, false);

const initButton = new sd.Button(div).text("Initialize").cx(100).y(30);
initButton.onClick(async () => {
    await solveMatrix();
});

// 初始化 sumMatrixGrid 矩阵
function updateSumMatrixGrid() {
    for (let i = 0; i < N + 1; i++) {
        for (let j = 0; j < M + 1; j++) {
            if (i === 0 || j === 0) {
                sumMatrixGrid.insert(i, j, "0").color(i, j, C.purple);
            } else {
                sumMatrixGrid.insert(i, j, SUM_MATRIX[i - 1][j - 1].toString());
            }
        }
    }
}

// 填充矩阵的计算过程动画函数
async function fillMatrix(firstRow, firstCol) {
    let matrix = sd.make2d(N, M, 0);

    // 清空原有矩阵内容并在填充前展示空矩阵
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (i !== 0 || j !== 0) {
                originalMatrixGrid.value(i, j, null);
            }
        }
    }

    if (firstRow) {
        await sd.pause();
        // 填充首行首列
        for (let i = 0; i < N; i++) {
            matrix[i][0] = firstCol[i];
            if (i === 0) {
                matrix[i][0] = 0;
            }
            originalMatrixGrid.value(i, 0, String(matrix[i][0])).color(i, 0, C.blue);
        }
        for (let j = 0; j < M; j++) {
            matrix[0][j] = firstRow[j];
            if (j === 0) {
                matrix[0][j] = 0;
            }
            await sd.pause();
            originalMatrixGrid.value(0, j, String(matrix[0][j])).color(0, j, C.blue);
        }

        // 填充其余部分
        for (let i = 1; i < N; i++) {
            for (let j = 1; j < M; j++) {
                const sum = SUM_MATRIX[i - 1][j - 1];
                const value = (sum - matrix[i - 1][j - 1] - matrix[i - 1][j] - matrix[i][j - 1]) % P;
                if (value < 0) {
                    matrix[i][j] = value + P;
                } else {
                    matrix[i][j] = value;
                }
                await sd.pause();
                originalMatrixGrid.insert(i, j, String(matrix[i][j])).color(i, j, C.green);
            }
        }
    }
    return matrix;
}

// 比较两个矩阵的字典序
function compareLexic(mat1, mat2) {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (mat1[i][j] !== mat2[i][j]) {
                return mat1[i][j] - mat2[i][j];
            }
        }
    }
    return 0;
}

async function solveMatrix() {
    let bestMatrix = null;

    function generate(num, len) {
        const result = sd.make1d(len);
        for (let i = 0; i < len; i++) {
            result[i] = num % P;
            num = Math.floor(num / P);
        }
        return result;
    }

    const totalCases = Math.pow(P, N + M - 2);
    for (let mask = 0; mask < totalCases; mask++) {
        const firstRow = [0].concat(generate(mask % Math.pow(P, M - 1), M - 1));
        const firstCol = [0].concat(generate(Math.floor(mask / Math.pow(P, M - 1)), N - 1));

        const matrix = await fillMatrix(firstRow, firstCol);

        let valid = true;
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < M; j++) {
                if (matrix[i][j] < 0 || matrix[i][j] >= P) {
                    valid = false;
                    break;
                }
            }
        }

        if (valid) {
            if (bestMatrix === null || compareLexic(matrix, bestMatrix) < 0) {
                bestMatrix = matrix.map(row => row.slice());
            }
        }
    }

    if (bestMatrix) {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < M; j++) {
                const cellValue = bestMatrix[i][j].toString();
                await sd.pause();
                originalMatrixGrid.insert(i, j, cellValue).color(i, j, C.red);
            }
        }
    }
    return bestMatrix;
}

sd.main(async () => {
    updateSumMatrixGrid();
});
