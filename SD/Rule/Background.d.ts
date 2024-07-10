import { Rule } from "./Rule";

/**
 * 普通背景规则
 */
export function Background(): Rule;

/**
 * 圆形背景规则
 * 
 * 需要保证父节点和子节点同时具有r方法
 */
export function CircleBackground(): Rule;