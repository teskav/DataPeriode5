#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script converts a csv file into a JSON file.
"""

import pandas as pd

# Global constants for the input and output file
INPUT_CSV = "countries_of_the_world.csv"
INPUT_CODES = "country_code.csv"
OUTPUT_JSON = "data.json"

def preprocess(df, codes):

    # Remove spaces at the end of the countries
    df["Country"] = df["Country"].str.strip(" ")

    # Add country codes to countries
    df = pd.merge(df, codes, how='left', left_on='Country', right_on='Country_name')

    # Drop the extra country name
    df = df.drop(["Country_name"], axis=1)

    # Rename the code column
    df = df.rename(index=str, columns={"code_3digit": "Code", "Pop. Density (per sq. mi.)": "PopulationDensity"})

    # Change the order of the columns
    columnsTitles=["Code", "Country", "PopulationDensity", "Birthrate", "Deathrate"]
    df = df.reindex(columns=columnsTitles)

    # Delete rows with missing values
    df = df.dropna()

    # Set country as index
    df = df.set_index("Code")

    # Drop countries which are not on the world map
    df = df.drop(['MCO', 'SGP', 'GIB', 'BMU', 'MLT', 'BHR', 'GGY', 'JEY', 'MDV', 'NRU'])

    return df

def add_average(df):
    """
    This functions adds the world average to the dataframe.
    """
    # Calculate the world average birthrate, deathrate and population
    average_birthrate = round(df["Birthrate"].mean(), 2)
    average_deathrate = round(df["Deathrate"].mean(), 2)
    average_population = round(df["PopulationDensity"].mean(), 1)

    # Set dataframe for the world
    world = pd.DataFrame({"Country": ["World average"],
                          "PopulationDensity": [average_population],
                          "Birthrate": [average_birthrate],
                          "Deathrate": [average_deathrate],
                          "Code": ["WLD"]})
    world = world.set_index("Code")

    # Add world dataframe to dataset
    df = df.append(world, sort=False)

    return df

def convert(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json(OUTPUT_JSON, orient='index')


if __name__ == "__main__":

    # Load csv file, drop columns you don't use and replace comma's with dots
    df = pd.read_csv(INPUT_CSV, decimal=",", usecols=["Country","Pop. Density (per sq. mi.)", "Birthrate", "Deathrate"])
    codes = pd.read_csv(INPUT_CODES, usecols=["Country_name","code_3digit"])

    # Preprocess the data
    df = preprocess(df, codes)

    # Add the world average to the dataframe
    df = add_average(df)

    # Convert data to JSON file
    convert(df)
