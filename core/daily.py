import random

def get_daily_verse(data):
    books = list(data.keys())
    b = random.choice(books)
    c = random.choice(list(data[b].keys()))
    v = random.choice(list(data[b][c].keys()))
    verse = data[b][c][v]
    return verse["en"]