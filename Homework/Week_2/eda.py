#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script discovers basic information about a dataset.
It loads and preprocesses a dataset.
It returns a histogram and a boxplot to visualize the distribution of the data.
It also returns a .json file.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Global constant for the input file
INPUT_CSV = "input.csv"

def process(df):
    """
    This function preprocesses the data in pandas Dataframe.
    In the histogram you saw that the highest GDP was 400000 (Suriname)
    and the second highest 55100 (Luxembourg). So is not the right GDP
    for Suriname, therefore I define an outlier as higher than 350000.
    """
    # Remove the columns you don't use
    df = df.drop(['Population', 'Area (sq. mi.)', 'Coastline (coast/area ratio)',
             'Net migration', 'Literacy (%)', 'Phones (per 1000)', 'Arable (%)',
             'Crops (%)', 'Other (%)', 'Climate', 'Birthrate', 'Deathrate',
             'Agriculture', 'Industry', 'Service'], axis=1)

    # Remove dollar text in GDP and turn into float
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.strip(" dollars").astype(float)

    # Remove spaces at the end of region
    df['Region'] = df['Region'].str.strip(" ")

    # Remove outliers
    outlier = 350000
    df.loc[df['GDP ($ per capita) dollars'] > outlier] = np.nan

    return df

def central_tendency(gdp):
    """
    This function gets the central tendency of a data set,
    and  prints a histogram.
    """
    # Calculate the mean, median, mode and std of the GDP
    GDP_mean = gdp.mean()
    GDP_median = gdp.median()
    GDP_mode = gdp.mode()[0]
    GDP_std = gdp.std()

    # Print the mean, median, mode and std of the GDP
    print("GDP Central Tendency:\n"
          "The mean of the GDP ($ per capita):", round(GDP_mean),
          "\nThe median of the GDP ($ per capita):", round(GDP_median),
          "\nThe mode of the GDP ($ per capita):", round(GDP_mode),
          "\nThe std of the GDP ($ per capita):", round(GDP_std))

    # Plot the histogram
    plt.subplot(121)
    plt.hist(gdp, bins=20, color='green')
    plt.xlabel('GDP ($ per capita)')
    plt.ylabel('Frequency')
    plt.title('Distribution of the GDP in 227 countries')

def five_number(infant_mortality):
    """
    This function gets the Five Number Summary of a data set,
    and prints a boxplot.
    """
    # Calculate the minimum, first quartile, median, third quartile and maximum
    infant_min = infant_mortality.min()
    infant_fq = infant_mortality.quantile(q=0.25)
    infant_median = infant_mortality.median()
    infant_tq = infant_mortality.quantile(q=0.75)
    infant_max = infant_mortality.max()

    # Print the minimum, first quartile, median, third quartile and maximum
    print("\nInfant Mortality Five Number Summary:"
          "\nThe minimum of infant mortality (per 1000 births):", infant_min,
          "\nThe first quartile of infant mortality (per 1000 births):", infant_fq,
          "\nThe median of infant mortality (per 1000 births):", infant_median,
          "\nThe third quartile of infant mortality (per 1000 births):", infant_tq,
          "\nThe maximum of infant mortality (per 1000 births):", infant_max)

    # Plot the boxplot
    plt.subplot(122)
    plt.boxplot(infant_mortality, flierprops=dict(markerfacecolor='y'), medianprops=dict(color='g'))
    plt.ylabel('Amount (per 1000 births)')
    plt.xticks([1], ['Infant Mortality'])
    plt.title("Distribution of the Infant Mortality in 227 countries")
    # Get figure in full screen
    maximize = plt.get_current_fig_manager()
    maximize.window.showMaximized()
    plt.show()

def convert_JSON(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json('output.json', orient='index')


if __name__ == "__main__":

    # Load csv file and replace unknown with NaN and comma's with dots
    with open(INPUT_CSV) as csvfile:
        df = pd.read_csv(INPUT_CSV, na_values = ['unknown'], decimal=",", index_col=0)

    # Preprocess the data
    df = process(df)

    # Visualize the GDP data
    central_tendency(df['GDP ($ per capita) dollars'].dropna())

    # Visualize the Infant Mortality data
    five_number(df['Infant mortality (per 1000 births)'].dropna())

    # Convert data to JSON file
    convert_JSON(df)
