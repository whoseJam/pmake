
import os
import module_manager

def get_files(root_path, all_files):
    files = os.listdir(root_path)
    for file in files:
        if not os.path.isdir(root_path + "/" + file):
            all_files.append(root_path + "/" + file)
        else:
            get_files((root_path + "/" + file), all_files)


def check_path(path):
    _path = os.path.dirname(path)
    if not os.path.exists(_path):
        os.makedirs(_path, exist_ok=True)

def cat(path1, path2):
    if path1[-1] == "/" or path1[-1] == "\\":
        return path1 + path2
    return path1 + "/" + path2

def father(path: str):
    segments = path.split("/")
    genStr = lambda x: segments[x] if x != len(segments)-1 else ""
    genGap = lambda x: "/" if x <= len(segments)-3 else ""
    return "".join(genStr(i) + genGap(i) for i in range(len(segments)))

def skip(path: str, count: int):
    segments = path.split("/")
    ans = "./"
    for i in range(len(segments)):
        if i > count:
            ans = ans + segments[i]
            if i < len(segments) - 1:
                ans = ans + "/"
    return ans

def is_js_file(path: str):
    return path.split(".")[-1] == "js"

def build(args):
    input_folder = args["input_path"]
    all_files = []
    get_files(input_folder, all_files)
    for file in all_files:
        if not is_js_file(file):
            continue
        output_folder = cat(args["output_path"], skip(father(file), args["start"]))
        check_path(output_folder)

        module_name = module_manager.module_name(file)
        module_manager.build_module(module_name, file, output_folder)