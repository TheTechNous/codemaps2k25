import re

IMG_TAG_RE: re.Pattern = re.compile(r"\<img\@([A-Fa-f0-9]+\..+)\>")


def extract_media_ids(content: str):
    return [
        m.group(1) for m in IMG_TAG_RE.finditer(content)
    ]
