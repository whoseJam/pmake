/*

luogu P2736

摇滚乐队CD装盘动画

需求描述：
1. 数据结构
- 输入：歌曲数量N，CD容量T，CD数量M，以及N个整数表示的歌曲长度数组
- CD数组：M个CD对象，每个CD显示当前已用容量和剩余容量
- 歌曲数组：按创作时间顺序排列的歌曲对象

2. 可视化要求
- 上方：显示当前状态（已选歌曲数/总歌曲数）
- 中间：M个CD的容量使用情况
- 每个CD用矩形表示，内部用容量条显示已用空间
- 显示当前CD包含的歌曲编号
- 下方：歌曲序列
- 每首歌显示其长度
- 当前已分配的歌曲高亮显示

3. 交互功能
- 当歌曲被点击时，则将其高亮，同时更新CD的容量条

4. 动画效果
- 歌曲分配动画：
- 当前歌曲高亮
- 箭头指示歌曲移动到目标CD
- CD容量进度条动态更新
- 无法放入时的提示效果
- CD满载时的视觉反馈

技术要求：
- 使用sd.Array展示歌曲序列
- 使用sd.Rect展示CD容器，内部再使用一个sd.Rect表示容量条
- 使用sd.Text显示统计信息
- 使用onClick和sd.inter处理交互
*/

/*
评价：
不可用。逻辑哪哪都有问题。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const N = 4; // 歌曲数量
const T = 5; // CD 的容量
const M = 2; // CD 数量
const songs = [4, 3, 4, 2];

const allSongs = new sd.Array(svg)
    .resize(N)
    .forEachElement((elem, i) => {
        elem.value(songs[i].toString()).fill(C.green).opacity(0.5);
        elem.onClick(() => {
            sd.inter(async () => {
                if (!elem.frozen()) {
                    handleSongClick(elem, i, songs[i]);
                    elem.freeze();
                }
            });
        });
    })
    .x(50)
    .y(50);

const currentStatusText = new sd.Text(svg, `Current State: 0 songs placed`).fontSize(20).center(250, 20);

const CDs = new sd.Array(svg).resize(M).forEachElement((cd, i) => {
    const bg = new sd.Rect(cd).fill(C.grey).stroke(C.black).strokeWidth(3);
    const content = new sd.Rect(cd)
        .fill(C.azure)
        .stroke(C.black)
        .width(cd.width() - 10)
        .height(cd.height() - 10);
    new sd.Text(cd, `CD ${i + 1}`).center(content.center()[0], content.center()[1] - 30).fontSize(16);
    bg.width(100).height(60);
    cd.color(C.azure);
    cd.dx(i * 120)
        .y(150)
        .width(100)
        .height(60);
});

let currentCDIndex = 0;
let usedTime = new Array(M).fill(0);
let currentSongIndex = 0;
let songsPlaced = 0;

function handleSongClick(songElem, songIndex, songLength) {
    if (currentCDIndex < M && songIndex >= currentSongIndex && usedTime[currentCDIndex] + songLength <= T) {
        usedTime[currentCDIndex] += songLength;
        songsPlaced++;
        currentStatusText.text(`Current State: ${songsPlaced} songs placed`);
        currentSongIndex = songIndex + 1;

        const startPos = songElem.center();
        const targetPos = CDs.element(currentCDIndex).center();
        const line = new sd.Line(svg).source(startPos).target(startPos).color(C.pureRed).strokeWidth(2);
        line.startAnimate().target(targetPos[0], targetPos[1]).endAnimate();

        songElem
            .startAnimate()
            .center(targetPos[0], targetPos[1] + 10)
            .opacity(0.5)
            .color(C.red)
            .endAnimate();
        line.startAnimate().opacity(0).endAnimate();

        const cd = CDs.element(currentCDIndex);
        const usedWidth = (usedTime[currentCDIndex] / T) * (cd.width() - 10);
        const valueRect = cd.value();
        valueRect.width(usedWidth);

        if (usedTime[currentCDIndex] === T) {
            currentCDIndex++;
        }
    } else {
        songElem
            .startAnimate()
            .color(C.pureRed)
            .duration(300)
            .endAnimate()
            .then(() => {
                songElem.startAnimate().color(C.green).duration(300).endAnimate();
            });
    }
}

sd.main(async () => {
    await sd.pause();

    for (let i = 0; i < N; i++) {
        if (currentCDIndex >= M) {
            break;
        }

        const currentSong = allSongs.element(i);
        currentSong.startAnimate().color(C.blue).endAnimate();

        if (usedTime[currentCDIndex] + songs[i] <= T) {
            usedTime[currentCDIndex] += songs[i];
            songsPlaced++;

            const startPos = currentSong.center();
            const targetPos = CDs.element(currentCDIndex).center();
            const line = new sd.Line(svg).source(startPos).target(startPos).color(C.pureRed).strokeWidth(2);
            line.startAnimate().target(targetPos[0], targetPos[1]).endAnimate();

            await sd.pause();
            currentSong
                .startAnimate()
                .center(targetPos[0], targetPos[1] + 10)
                .opacity(0.5)
                .color(C.blue)
                .endAnimate();
            line.startAnimate().opacity(0).endAnimate();

            const cd = CDs.element(currentCDIndex);
            const usedWidth = (usedTime[currentCDIndex] / T) * (cd.width() - 10);
            const valueRect = cd.value();
            valueRect.width(usedWidth);

            if (usedTime[currentCDIndex] === T) {
                currentCDIndex++;
            }
        } else {
            currentCDIndex++;
            if (currentCDIndex < M) {
                i--;
            } else {
                break;
            }
        }

        currentStatusText.text(`Current State: ${songsPlaced} songs placed`);
        await sd.pause();
    }
    await sd.pause();
});
