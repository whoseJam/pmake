
import module_manager

def build(args):
    path_to_js = args["input_path"]
    module_name = module_manager.module_name(path_to_js)
    module_manager.build_module(module_name, path_to_js, args["output_path"])