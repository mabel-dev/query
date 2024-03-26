import os
import sys

sys.path.insert(1, os.path.join(sys.path[0], "../../../mabel/"))
from rich import traceback

from mabel.adapters.disk import DiskReader, DiskWriter
from mabel.data import Reader, Writer

traceback.install()


def get_data():
    r = Reader(inner_reader=DiskReader, dataset="tests/data/huge", partitions=None)
    return r

def do_writer(data):
    w = Writer(inner_writer=DiskWriter, dataset="tests/data/parquet", partitions=None, format="parquet")
    for record in data:
        w.append(record)
    w.finalize()

if __name__ == "__main__":

    data = get_data()
    do_writer(data)