/*
帮我实现如下场景：
有n首歌，按照发行时间排好序，歌有选中/未选中两种状态，选中与否是交互式的
最初所有的歌都是未选中的
无论歌选中与否，它都应该在场景中出现
你可以用sd.Array来表示这一个序列上的连续的歌
可以把选中的歌涂成蓝色，依次区分歌的选中状态
每首歌有自己的时长
我们可以把若干首歌放进一张CD，CD的容量为T，即CD中最多能放总时长不超过T的若干歌
当我选中若干首歌后，需要按照T把选中的歌划分成若干段（每一段对应一张CD）
当歌的选中状态发生改变后，需要重新对数组上的歌做划分
你可以用sd.Brace来做划分
*/
import * as sd from "@/sd";

class Song {
    constructor(title, releaseTime, duration) {
        this.title = title;
        this.releaseTime = releaseTime;
        this.duration = duration;
        this.isSelected = false;
    }
}

const songs = [
    new Song ("Song1", 2010, 18),
    new Song ("Song2", 2012, 24),
    new Song ("Song3", 2015, 12),
    new Song ("Song4", 2018, 30),
    new Song ("Song5", 2020, 21),
    new Song ("Song6", 2021, 15),
    new Song ("Song7", 2022, 27),
    new Song ("Song8", 2023, 33),
    new Song ("Song9", 2024, 20),
    new Song ("Song10", 2025, 28),
    new Song ("Song11", 2026, 16),
    new Song ("Song12", 2027, 35)
];

const CDCapacity = 48; // CD容量

const svg = sd.svg();
const C = sd.color();
const songArray = new sd.Array(svg);
let usedBraces = [];

function initSongDisplay() {
    songs.forEach(song => {
        const songElement = new sd.Box(songArray);
        songElement.value(song.duration);
        songElement.color(C.grey);
        songElement.onClick(() => {
            sd.inter(async () => {
                song.isSelected = !song.isSelected;
                songElement.startAnimate().color(song.isSelected? C.blue : C.grey).endAnimate();
                updateCDDivision();
            })
        });
        songArray.pushFromExistElement(songElement);
    });
    sd.Label(songArray, `T=${CDCapacity}`, "bc");
    sd.Index(songArray, "b").fontSize(8).gap(1);
}

function updateCDDivision() {
    let currentCDDuration = 0, left = 0, right = 0, flag = false;
    const ranges = [];
    usedBraces.forEach(brace => freeBrace(brace));
    usedBraces = [];
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        if (!song.isSelected) continue;
        flag = true;
        if (currentCDDuration === 0) left = i;
        if (currentCDDuration + song.duration > CDCapacity) {
            ranges.push([left, right]);
            left = right = i;
            currentCDDuration = song.duration;
        } else {
            right = i;
            currentCDDuration += song.duration;
        }
    }
    if (flag) ranges.push([left, right]);
    ranges.forEach(range => {
        const brace = allocBrace();
        brace.startAnimate().brace(range[0], range[1]).endAnimate();
        usedBraces.push(brace);
    })
}

sd.init(() => {
    initSongDisplay();
});

sd.main(() => {
});

function allocBrace() {
    return sd.Brace(songArray);
}

function freeBrace(brace) {
    brace.startAnimate().opacity(0).endAnimate().remove();
}