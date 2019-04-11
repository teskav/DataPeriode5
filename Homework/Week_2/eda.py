#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script ....
"""

import pandas as pd

# Global constant for the input file
INPUT_CSV = "input.csv"

def load_csv(infile):
    """
    This function loads the data into a pandas DataFrame and preprocesses the data.
    """
    # Load csv file and replace unknown with NaN and comma's with dots
    with open(infile) as csvfile:
        df = pd.read_csv(infile, na_values = ['unknown'], decimal=",")

    # Remove dollar text in GDP and turn into float
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.strip(" dollars").astype(float)
    # df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].astype(float)
    # print(df.dtypes)
    # print(df['GDP ($ per capita) dollars'])

    print(df)
    # print(df["Pop. Density (per sq. mi.)"])
    # print(df.loc[df['Country'] == 'Aruba ']["Pop. Density (per sq. mi.)"])

if __name__ == "__main__":
    load_csv(INPUT_CSV)
