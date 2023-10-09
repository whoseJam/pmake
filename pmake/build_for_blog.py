
import os
import sys
import module_manager

PATH_TO_BLOG = "C:/Users/27670/Project/blog/source/_posts"

# path: ./example/blog/sd基础元素
def build(path_to_js_folder: str):
    blog_name = path_to_js_folder.split("/")[-1]
    path_to_output = "{}/{}".format(PATH_TO_BLOG, blog_name)
    path_to_database = "{}/module.cache".format(path_to_output)
    force = len(sys.argv) >= 4 and sys.argv[3] == "-f"
    for file in os.listdir(path_to_js_folder):
        module = module_manager.module_name(file)
        module_manager.build_module(
            module,
            "{}/{}".format(path_to_js_folder, file),
            path_to_database,
            path_to_output, force)