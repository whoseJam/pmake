
/**
 * 动画状态栏
 * 
 * - 重新加载动画按钮
 * - 允许触发交互提示
 */
export class Status {
    static init();

    /**
     * 更新 frame status
     * 
     * - 在 IS_CONTINUING 下不允许触发新的交互
     * - 在 IS_INTERACTING 下不允许触发新的交互
     * - 在历史环境（MAXIMUM_FRAME != CURRENT_FRAME）下不允许触发新的交互
     */
    static updateFrameStatus();
}