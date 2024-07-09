import { Action } from "./Action";

export class ActionList {
    constructor();

    /**
     * 添加一个动画行为到调度器中，会启动自动优化
     * @param action 
     */
    push(action: Action): void;

    /**
     * 添加一个动画行为到调度器中，不会启动自动优化
     * @param action 
     */
    directPush(action: Action): void;


    /**
     * 检查两个动画行为之间的冲突
     * @param before 先进入调度器的动画行为
     * @param after 后进入调度器的动画行为
     */
    checkConflict(before: Action, after: Action): void;

    /**
     * 将一个动画行为与之前已经存在于调度器中的动画行为做比较，进行自动优化
     * @param action 
     */
    rebuild(action: Action): void;

    /**
     * 将所有被标记为 hidden 的动画行为，从调度器中删去
     */
    flushHidden(): void;

    /**
     * 触发一次动画渲染，这个函数应该在 requestAnimationFrame 中被使用
     * @param timestamp 绝对时间戳
     */
    tick(timestamp: number): void;

    /**
     * 重启该调度器
     * @param timestamp 绝对时间戳
     */
    restart(timestamp: number): void;

    /**
     * 强制该调度器内所有的动画行为立刻结束
     */
    finish(): void;

    /**
     * 查询调度器中是否所有动画行为都已结束
     */
    finished(): boolean;

    /**
     * 将当前调度器的时间线反转，返回一个新的反转后的调度器
     */
    rollback(): ActionList;

    /**
     * 返回一个新的和本调度器相同的调度器
     */
    replay(): ActionList;
}