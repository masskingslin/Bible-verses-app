import json

class BibleService:
    def __init__(self):
        self.data = None

    def load(self):
        with open("assets/bible.json", encoding="utf-8") as f:
            self.data = json.load(f)

    def get(self, book, ch, vs):
        try:
            return self.data[book][str(ch)][str(vs)]
        except:
            return {"ta": "தகவல் இல்லை", "en": "Data missing"}