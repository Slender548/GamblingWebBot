import datetime, pathlib, json, numpy as np
from typing import Callable
import time

class Function:
    def __init__(self, order: int = 3):
        self.order = 3
        self.data_path = pathlib.Path.cwd().joinpath("src/data/dates.json")

        self.x, self.y = self._unpack_data()
        self._func = self._fit_data()

    def _unpack_data(self):
        with open(self.data_path) as string_data:
            data = json.load(string_data)

        x_data = np.array(list(map(int, data.keys())))
        y_data = np.array(list(data.values()))

        return (x_data, y_data)

    def _fit_data(self) -> Callable[[int], int]:
        fitted = np.polyfit(self.x, self.y, self.order)
        func = np.poly1d(fitted)

        return func

    def add_datapoint(self, pair: tuple):
        pair[0] = str(pair[0])

        with open(self.data_path) as string_data:
            data = json.load(string_data)

        data.update([pair])

        with open(self.data_path, "w") as string_data:
            json.dump(data, string_data)

        # update the model with new data
        self.x, self.y = self._unpack_data()
        self._func = self._fit_data()

    def func(self, tg_id: int) -> int:
        value = self._func(tg_id)
        current = time.time()

        if value > current:
            value = current

        return value


def main():
    x_data = np.array([1234567890, 1234567900, 1234567910])
    y_data = np.array([1597830720, 1597834320, 1597837920])
    fitted = np.polyfit(x_data, y_data, 3)
    func = np.poly1d(fitted)

    tg_id = 1331282319
    value = func(tg_id)
    current = time.time()

    if value > current:
        value = current

    print(datetime.datetime.utcfromtimestamp(value).strftime("%Y-%m-%d"))

if __name__ == "__main__":
    main()