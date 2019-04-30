#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script converts a csv file into a JSON file.
"""

import pandas as pd

# Global constants for the input and output file
INPUT_CSV = "DP_LIVE_30042019105950734.csv"
OUTPUT_JSON = "data.json"

def preprocess(df):

    # Remove the columns you don't use
    df = df.rename(index=str, columns={"TIME": "Date", "Value": "Unemployment rate"})

    return df

def convert(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json(OUTPUT_JSON, orient='index')


if __name__ == "__main__":

    # Load csv file and drop columns you don't use
    df = pd.read_csv(INPUT_CSV, index_col=0, usecols=["TIME","Value"])

    # Preprocess the data
    df = preprocess(df)

    # Convert data to JSON file
    convert(df)
