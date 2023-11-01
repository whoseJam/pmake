import { list, subList } from "./List";
import { Grid } from "./Grid";
import { title } from "./Title";

export function layout() {
    return Layout;
}

const Layout = {
    title: title,
    list: list,
    subList: subList,
    Grid: Grid
}