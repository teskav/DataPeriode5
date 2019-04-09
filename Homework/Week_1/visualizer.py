#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Global dictionary for the average rating
average = {str(year): [] for year in range(START_YEAR, END_YEAR)}

def load_csv(infile):
    """
    This function loads the years and ratings from the csv file to a dictionary.
    """
    # Read the csv file
    with open(infile) as csvfile:
        reader = csv.DictReader(csvfile)

        # Load data into dictionary
        for row in reader:
            data_dict[row['Year']].append(float(row['Rating']))

    return[data_dict]

def average_rat(dictionary):
    """
    This function calculates the average rating per year.
    """
    # Append average ratings to dictionary
    for year in dictionary:
        average[year].append(sum(dictionary[year])/len(dictionary[year]))

    return[average]

def visualize(data):
    """
    This function plots the average rating per year in a line chart.
    And it plots the number of movies per year.
    """
    #  Get lists for the x and y axes
    years = list(data.keys())
    ratings = list(data.values())
    numbers = list(data_dict.values())
    number = []
    for year in numbers:
        number.append(len(year))

    # Plot the line chart of average ratings
    plt.subplot(211)
    plt.plot(years, ratings,'y')
    plt.ylim(8.2,8.8)
    plt.ylabel('Average rating')
    plt.title('Ratings & numbers of movies in IMDB top 50 per year')

    # Plot the chart of number of movies
    plt.subplot(212)
    plt.plot(years, number, 'bo')
    plt.ylim(0,10)
    plt.xlabel('Release year')
    plt.ylabel('Number of movies')
    plt.show()


if __name__ == "__main__":
    load_csv(INPUT_CSV)
    average_rat(data_dict)
    visualize(average)
