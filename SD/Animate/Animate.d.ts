import { Action } from "./Action";

declare class ActionPool {
    constructor();

    /**
     * 给定时间戳，触发一次动画渲染
     * @param timestamp 时间戳
     */
    tick(timestamp: number): void;

    /**
     * 添加一个动画行为
     * @param action 动画行为
     */
    push(action: Action): void;

    /**
     * 准备开启下一帧动画行为的播放
     * 
     * 调用该函数之后，会新建一个ActionList，之后生成的acion会被放入该ActionList中
     */
    play(): void;

    /**
     * 将撤销当前帧所有的动画行为
     * 
     * 效果上等同于回退到上一帧
     */
    rollback(): void;

    /**
     * 重播下一帧的动画行为
     * 
     * 效果上等同于前进到下一帧
     */
    replay(): void;

    /**
     * 检验当前帧的所有动画行为是否都已经结束了
     */
    currentFinished(): boolean;

    /**
     * 终结现在actionList中所有正在调度的动画，经过该函数后actionList应为空
     */
    reset();
}

export const Animate: ActionPool;