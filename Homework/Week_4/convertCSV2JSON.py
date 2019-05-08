#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script converts a csv file into a JSON file.
"""

import pandas as pd

# Global constants for the input and output file
INPUT_CSV = "data.csv"
OUTPUT_JSON = "data.json"

def preprocess(df):

    YEAR = 2016
    MEASURE = "KTOE"

    # Get the data we want to use
    df = df.loc[df["TIME"] == YEAR]
    df = df.loc[df["MEASURE"] == MEASURE]

    # Delete rows with missing values
    df = df.dropna()

    # Delete measure and time columns since we don't need it anymore
    df = df.drop(['MEASURE', 'TIME'], axis=1)

    # Only save the countries in Europe
    df = df.drop(['OECD', 'AUS', 'CAN', 'JPN', 'KOR', 'MEX', 'NZL', 'USA',
                  'CHL', 'ISR'])

    # Rename the columns
    df = df.rename(index=str, columns={"LOCATION": "Country", "Value": "KTOE"})

    return df

def convert(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json(OUTPUT_JSON, orient='index')


if __name__ == "__main__":

    # Load csv file and drop columns you don't use
    df = pd.read_csv(INPUT_CSV, index_col=0, usecols=["LOCATION","MEASURE", "TIME", "Value"])

    # Preprocess the data
    df = preprocess(df)

    # Convert data to JSON file
    convert(df)
