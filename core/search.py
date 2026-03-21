def search(data, query):
    q = query.lower()
    results = []
    for b in data:
        for c in data[b]:
            for v in data[b][c]:
                text = data[b][c][v]["en"]
                if q in text.lower():
                    results.append(text)
    return results[:20]