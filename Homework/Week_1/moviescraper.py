#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # Extract the list of highest rated movies
    movies_IMDB = dom.find_all("div", class_="lister-item-content")

    # Make empty movie list
    movies = []
    one_movie = []

    # Loop over the movies to add every scraped movie to list
    for movie in movies_IMDB:

        # Append the title
        one_movie.append(movie.h3.a.string)

        # Append the rating
        one_movie.append(movie.div.div.strong.string)

        # Append the year of release
        spans = movie.h3.find_all("span")
        one_movie.append(spans[1].string.strip("()I "))

        # Append the actors
        films = movie.find_all("a")
        stars = ""
        for film in films:
            if "_st_" in film["href"]:
                if stars == "":
                    stars += film.string
                else:
                    stars += ", " + film.string
        one_movie.append(stars)

        # Append the runtime
        one_movie.append(movie.p.find("span", class_="runtime").string.strip("nim "))

        # Append movie to the list of movies
        movies.append(one_movie)
        one_movie = []

    return [movies]


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # Write movies to disk
    for movie in movies:
        writer.writerows(movie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
