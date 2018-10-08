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
    # df['start_time_year_month'] = pass_holder_column.dt.year.astype('str') + '_' + pass_holder_column.dt.month.astype('str')
    df['start_time_year_month'] = pass_holder_column.apply(lambda x: x.strftime("%Y_%m"))
    print("time elapse {:.2f}".format(time.time() - start))
    # df['start_time_month'] = pass_holder_column.dt.month
    print("time elapse {:.2f}".format(time.time() - start))
    total_monthly = df[["start_time_year_month", "passholder_type"]].query('passholder_type == "Monthly Pass"').groupby(["start_time_year_month"]).agg(len)
    total_number = df[["start_time_year_month", "passholder_type"]].groupby(["start_time_year_month"]).agg(len)
    print("time elapse {:.2f}".format(time.time() - start))
    total_monthly = total_monthly.rename({"passholder_type": "occurrence"}, axis=1)
    total_monthly['ratio'] = total_monthly['occurrence'] / total_number["passholder_type"]
    print(total_monthly)
    fig, axes = plt.subplots(nrows=2, ncols=1)
    total_monthly[['ratio']].plot(ax=axes[0])
    total_monthly[['occurrence']].plot(ax=axes[1], kind='bar')
    # plt.xlabel("time")
    # plt.ylabel("total_monthly")
    plt.show()


if __name__ == "__main__":
    main()
