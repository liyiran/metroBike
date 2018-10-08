import time

import matplotlib.pyplot as plt
import pandas as pd


def main():
    # read CSV file from relative path
    df = pd.read_csv("../whole.csv")
    # print the length to ensure it is correct
    print(len(df))
    # map the array to [{passholder_type,start_time}] array and remove unnecessary information
    # strptime: parse string to datetime object
    # strftime: datetime to string
    # map(lambda x: {x['passholder_type'], datetime.strptime(x['start_time'], "%d/%m/%Y HH:MM").strftime("%Y/%m")}, df)

    # my_datetime = pd.to_datetime(df['start_time'])
    # print(my_datetime.year, my_datetime.month)
    start = time.time()
    pass_holder_column = pd.to_datetime(df['start_time'])
    print("time elapse {:.2f}".format(time.time() - start))
    df['start_time_year'] = pass_holder_column.dt.year
    print("time elapse {:.2f}".format(time.time() - start))
    df['start_time_month'] = pass_holder_column.dt.month
    print("time elapse {:.2f}".format(time.time() - start))
    total = df[["start_time_year", "start_time_month", "passholder_type"]].query('passholder_type == "Monthly Pass"').groupby(["start_time_year", "start_time_month"]).agg(len)
    print("time elapse {:.2f}".format(time.time() - start))
    total = total.rename({"passholder_type": "occurrence"}, axis=1)
    print(total)
    total.plot(kind='bar')
    plt.xlabel("time")
    plt.ylabel("total")
    plt.show()


if __name__ == "__main__":
    main()
