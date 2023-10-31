import { list, subList } from "./List";
import { title } from "./Title";

export function layout() {
    return Layout;
}

const Layout = {
    title: title,
    list: list,
    subList: subList,
}