import sys
import standalone
import unit
import group

DEFAULT_OUTPUT_PATH = "C:\\Users\\27670\\Desktop\\output\\animation"
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