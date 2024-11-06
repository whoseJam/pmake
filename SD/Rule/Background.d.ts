import { RuleType } from "@/Rule/Rule";

/**
 * 普通背景规则
 */
export function Background(): RuleType;

/**
 * 圆形背景规则
 * 
 * 需要保证父节点和子节点同时具有r方法
 */
export function CircleBackground(): RuleType;