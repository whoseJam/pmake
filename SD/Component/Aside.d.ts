import { SDNode } from "@/Node/SDNode";

type LocationType = "tl"|"tc"|"tr"|"lt"|"lc"|"lb"|"bl"|"bc"|"br"|"rt"|"rc"|"rb";

interface AsideComponent extends SDNode {
    location(): LocationType;
    location(location: LocationType): this;
    gap(): number;
    gap(gap: number): this;
}

/**
 * 
 * @param parent 
 * @param aside 
 * @param location 
 * @param gap 
 */
export function Aside(parent: SDNode,
                      aside: SDNode,
                      location: LocationType,
                      gap: number);