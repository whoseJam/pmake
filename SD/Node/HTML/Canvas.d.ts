import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Camera } from "@/Node/Three/Camera";

/**
 * Canvas 组件。
 * 
 * 此组件继承自 BaseHTML，提供画布渲染功能：
 * - 2D：支持标准的 Canvas 2D 渲染。
 * - 3D：支持 Three.js 3D 渲染。
 * - 相机：提供 3D 场景的视角控制。
 * 
 * 使用场景：
 * - 2D 图形绘制。
 * - 3D 场景渲染。
 * - 可视化数据展示。
 */
export class Canvas extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取画布的渲染节点。
     * 
     * 使用场景：
     * - 直接操作画布内容。
     * - 自定义渲染逻辑。
     * - 访问底层渲染接口。
     * 
     * @returns 画布的渲染节点实例。
     */
    canvas(): RenderNode;

    /**
     * 启用 Three.js 3D 渲染模式。
     * 
     * 使用场景：
     * - 3D 场景创建。
     * - WebGL 渲染。
     * - 3D 模型展示。
     * 
     * @returns this 用于支持链式调用。
     */
    three(): this;

    /**
     * 获取 3D 场景的相机控制器。
     * 
     * 使用场景：
     * - 视角控制。
     * - 镜头动画。
     * - 场景导航。
     * 
     * @returns 相机控制器实例。
     */
    camera(): Camera;
}
