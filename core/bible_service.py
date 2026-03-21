import json
import os

class BibleService:
    def __init__(self):
        self.cache = {}

    def load_book(self, book):
        if book not in self.cache:
            path = os.path.join("assets", "bible", f"{book}.json")
            with open(path, encoding="utf-8") as f:
                self.cache[book] = json.load(f)

    def get(self, book, ch, vs):
        self.load_book(book)
        return self.cache[book].get(str(ch), {}).get(str(vs), {
            "ta": "இல்லை",
            "en": "Not found"
        })