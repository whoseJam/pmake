import { SDRule } from "@/Rule/Rule";

/**
 * 单纯把子节点和父节点的中心对齐
 */
export function CenterOnly(): SDRule;

/**
 * 将子节点和父节点的中心对齐，并且认为子节点的宽高比是不可变的
 * @param rate 空闲比，默认 1.2
 */
export function CenterFixAspect(rate: number): SDRule;

/**
 * 将子节点和父节点的中心对齐，并且认为子节点的宽高比是可变的
 * @param rate 空闲比，默认 1.2
 */
export function Center(rate: number): SDRule;

/**
 * 将子节点和父节点的中心对齐，并且认为子节点的宽高比是不可变的
 *
 * 当父节点是三角形时使用该方法
 * @param rate 空闲比，默认1.2
 */
export function TriangleCenterFixAspect(rate: number): SDRule;
