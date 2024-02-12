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

def npm_run(entry: str, output_path: str, output_file: str):
    cmd = "npm run dev -- --config webpack.config.js --entry {} --output-path {} --output-filename {}".format(
        entry, output_path, output_file)
    os.system(cmd)

def template_html(module: str, path_to_output: str):
    output_path = "{}/{}.html".format(path_to_output, module)
    file = open(output_path, "w", encoding="utf-8")
    file.write("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="./user/toolbox.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js"></script>
    <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
    <script src="snap.svg.js"></script>
    <style>
        .tool-box {{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: start;
            align-items: flex-start;
            align-content: flex-start;

            background-color: #f5f5f5;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }}

        .tool-item {{
            align-items: flex-start;
            margin: 2px;
        }}

        .tool-item-color-picker {{
            appearance: none;
            border: none;
            cursor: pointer;
        }}

        .icon-radio-group {{
            display: flex;
        }}
        
        .icon-radio-option {{
            display: flex;
            align-items: center;
            margin-right: 10px;
            cursor: pointer;
        }}
        
        .icon-radio-input {{
            display: none;
        }}
        
        .icon-radio-icon {{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            margin-right: 5px;
            border-radius: 50%;
            background-color: #f5f5f5;
        }}
        
        .icon-radio-icon i {{
            font-size: 16px;
            color: #333;
        }}
        
        .icon-radio-option:hover .icon-radio-icon {{
            background-color: #007bff;
        }}
        
        .icon-radio-option:hover .icon-radio-icon i {{
            color: #fff;
        }}
        
        .icon-radio-option input:checked + .icon-radio-icon {{
            background-color: #007bff;
        }}
        
        .icon-radio-option input:checked + .icon-radio-icon i {{
            color: #fff;
        }}
        
        .icon-radio-label {{
            font-size: 14px;
            color: #333;
        }}
    </style>
</head>
<body>
    <script src="{}.js"></script>
    <script>
        document.addEventListener('keydown', (e) => {{
            if (e.key === 'n' || e.key === 'N')
                window.next();
            if (e.key === 'p' || e.key === 'P')
                window.prev();
        }})
    </script>
</body>
</html>
""".format(module))
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
        output_file = "{}.js".format(module)

        current_md5 = encode_by_md5(open(path_to_entry, encoding="utf-8").read())
        # if path_to_entry in record.keys():
        #     last_md5 = record[path_to_entry]
        #     if last_md5 == current_md5:
        #         print("module already been built, skip")
        #         continue

        npm_run(path_to_entry, output_path, output_file)
        template_html(module, path_to_output)
        # record[path_to_entry] = current_md5
    
    # write_database(path_to_database, record)

def build_module(
        module: str,
        path_to_js: str,
        path_to_output: str):
    print("building module : {}".format(module))
    path_to_entry = path_to_js
    output_path = path_to_output
    output_file = "{}.js".format(module)

    # current_md5 = encode_by_md5(open(path_to_entry, encoding="utf-8").read())
    # if path_to_entry in record.keys():
    #     last_md5 = record[path_to_entry]
    #     if last_md5 == current_md5:
    #         print("module already been built, skip")
    #         return
    
    npm_run(path_to_entry, output_path, output_file)
    template_html(module, path_to_output)
    # record[path_to_entry] = current_md5

    # write_database(path_to_database, record)
