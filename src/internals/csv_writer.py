
def _escape(text):
    text = f"{text}"
    escaped = False
    if text is None:
        return "None"
    if ',' in text:
        escaped = True
    if '"' in text:
        escaped = True
        text = text.replace('"', '""')
    if "\n" in text:
        escaped = True
        text = text.replace("\n", "\\n")

    if escaped:
        return f'"{text}"'
    return text

def csv_set(records, columns):

    # write headers
    yield ','.join([_escape(column) for column in columns]) + '\n'

    # write records
    for record in records:
        yield ','.join([_escape(record.get(column, None)) for column in columns]) + '\n'
