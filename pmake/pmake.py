import sys
import standalone
import unit
import group

DEFAULT_OUTPUT_PATH = "C:/Users/27670/Desktop/output"
DEFAULT_FORCE = True

# 用法: python <path-to-pmake> -s <path-to-js> -o <path-to-output>
# 用法: python <path-to-pmake> -b <path-to-js-for-blog-folder> -o <path-to-output>
# 用法: python <path-to-pmake> -u <path-to-js-folder> -o <path-to-output> -start <number>
# 用法: python <path-to-pmake> -g <path-to-group-config> -o <path-to-output>
# 用法: python <path-to-pmake> clean
if __name__=="__main__":
    args = {
        "type": str(sys.argv[1]),
        "input_path": str(sys.argv[2]),
        "output_path": DEFAULT_OUTPUT_PATH,
        "force": DEFAULT_FORCE,
        "start": 0
    }
    pos = 3
    while pos < len(sys.argv):
        if sys.argv[pos] == "-o":
            pos = pos + 1
            args["output_path"] = sys.argv[pos]
            pos = pos + 1
        if sys.argv[pos] == "-start":
            pos = pos + 1
            args["start"] = int(sys.argv[pos])
            pos = pos + 1

    if args["type"] == "-s":
        standalone.build(args)

    if args["type"] == "-u":
        unit.build(args)
    
    if args["type"] == "-g":
        group.build(args)
    # elif str(sys.argv[1]) == "-b":
    #     path_to_js = sys.argv[2]
    #     build_for_blog.build(path_to_js)
    # elif str(sys.argv[1]) == "-u":
    #     path_to_js = sys.argv[2]
    #     build_for_unit.build(path_to_js)
    # else:
    #     path_to_output_md = "{}/build/output.md".format(PATH_TO_SLIDES)
    #     path_to_current_md = "{}/{}".format(PATH_TO_SLIDES, sys.argv[1])
    #     path_to_output_html = "{}/build/output.html".format(PATH_TO_SLIDES)

    #     output_md = open(path_to_output_md, "w", encoding="utf-8")
    #     current_md = open(path_to_current_md, "r", encoding="utf-8")
    #     title = path_to_current_md.split("/")[-1]
    #     title = title.split(".")[0]
    #     author = sys.argv[2]

    #     print("title : {}".format(title))
    #     print("author : {}".format(author))
    #     md_process.write_configure(title, author, output_md)
    #     md_process.append(output_md, current_md)
    #     output_md.close()
    #     current_md.close()

    #     os.system("pandoc {} -o {} -t revealjs -s --katex -V theme=white".format(path_to_output_md, path_to_output_html))

    #     modules = md_process.get_modules(path_to_current_md)
    #     module_manager.build_modules(
    #         modules, 
    #         os.path.dirname(path_to_current_md),
    #         path_to_module_database,
    #         path_to_output)
    #     html_process.append_configure(path_to_output_html)
    #     html_process.replace_css(path_to_output_html)
