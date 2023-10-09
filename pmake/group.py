
import unit

def build(args):
    path_to_group_config = args["input_path"]
    with open(path_to_group_config, encoding="utf8") as file:
        while True:
            line = file.readline()
            if not line:
                break
            segments = line.split(" ")
            start = args["start"]
            if len(segments) >= 3:
                start = int(segments[2])
            callArgs = {
                "type": "-u",
                "input_path": segments[0],
                "output_path": args["output_path"],
                "force": args["force"],
                "start": start
            }
            unit.build(callArgs)