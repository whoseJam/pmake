import { list, subList } from "./List";
import { Grid } from "./Grid";
import { title } from "./Title";

export function layout() {
    return Layout;
}

const Layout = {
    Title: title,
    List: list,
    SubList: subList,
    Grid: Grid,
}
