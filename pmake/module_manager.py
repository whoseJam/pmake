import os
import hashlib

# file_name: 001.xxx.js, basic.js...
def module_name(path: str):
    segments = path.split("/")[-1].split(".")
    L = lambda x: "." if x != len(segments)-2 else ""
    module = "".join((segments[i] + L(i)) for i in range(0, len(segments)-1))
    return module

def read_database(path_to_database: str, force: bool):
    record = {}
    if force:
        return record
    try:
        file = open(path_to_database, "r")
        line = file.readline()
        while line:
            strs = line.split(" ")
            filename = strs[0]
            md5 = strs[1]
            record[filename] = md5.strip()
            line = file.readline()
    except:
        pass
    return record

def write_database(path_to_database: str, record: dict):
    file = open(path_to_database, "w")
    for entry, md5 in record.items():
        line = str(entry) + " " + str(md5) + "\n"
        file.write(line)

def npm_run(entry: str, output_path: str, output_js: str, output_html: str):
    cmd = "set PROCESS_MODE=singleAnimation & set HTML_FILENAME={} & npm run dev -- --config webpack.config.js --entry {} --output-path {} --output-filename {}".format(
        output_html, entry, output_path, output_js)
    os.system(cmd)

def template_html(module: str, path_to_output: str):
    output_path = "{}/{}.html".format(path_to_output, module)
    with open("./pmake/template.html", 'r') as file:
        content = file.read()
        content = content.replace(r"{{SRC}}", module)
        file = open(output_path, "w", encoding="utf-8")
        file.write(content)
        file.close()

def encode_by_md5(code: str):
    m = hashlib.md5()
    m.update(code.encode())
    return m.hexdigest()

def build_modules(
        modules: list, 
        working_directory: str, 
        path_to_output: str,
        force = False):
    for module in modules:
        print("building module : {}".format(module))
        path_to_entry = "{}/{}.js".format(working_directory, module)
        output_path = path_to_output
        output_js = "{}.js".format(module)
        output_html = "{}.html".format(module)

        current_md5 = encode_by_md5(open(path_to_entry, encoding="utf-8").read())
        # if path_to_entry in record.keys():
        #     last_md5 = record[path_to_entry]
        #     if last_md5 == current_md5:
        #         print("module already been built, skip")
        #         continue

        npm_run(path_to_entry, output_path, output_js, output_html)
        # template_html(module, path_to_output)
        # record[path_to_entry] = current_md5
    
    # write_database(path_to_database, record)

def build_module(
        module: str,
        path_to_js: str,
        path_to_output: str):
    print("building module : {}".format(module))
    path_to_entry = path_to_js
    output_path = path_to_output
    output_js = "{}.js".format(module)
    output_html = "{}.html".format(module)

    npm_run(path_to_entry, output_path, output_js, output_html)
