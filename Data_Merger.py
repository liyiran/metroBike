from os import walk

import pandas as pd


def json_merger(dir_path, path_array):
    big_result = []
    for path in path_array:
        df = pd.read_csv(dir_path + '/' + path)
        big_result.append(df)
    return pd.concat(big_result)


def main():
    big_result = []
    for (dirpath, dirnames, filenames) in walk("database"):
        big_result = json_merger(path_array=filenames, dir_path=dirpath)
    big_result.to_csv("whole.csv")
    print(len(big_result))

if __name__ == "__main__":
    main()
