import requests

SUPPORTED_LANGUAGES = {
    "en": "English", "fr": "French", "de": "German", "es": "Spanish",
    "it": "Italian", "pt": "Portuguese", "nl": "Dutch", "ru": "Russian",
    "zh": "Chinese", "ja": "Japanese", "ar": "Arabic", "hi": "Hindi",
    "ko": "Korean", "tr": "Turkish", "pl": "Polish", "sv": "Swedish",
    "da": "Danish", "fi": "Finnish", "cs": "Czech", "ro": "Romanian",
    "uk": "Ukrainian", "vi": "Vietnamese", "th": "Thai", "id": "Indonesian",
    "ms": "Malay", "he": "Hebrew", "fa": "Persian", "bn": "Bengali",
    "ta": "Tamil", "ml": "Malayalam", "te": "Telugu",
}

def _google(text, src, tgt):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": src,
        "tl": tgt,
        "dt": "t",
        "q": text,
    }
    r = requests.get(url, params=params, timeout=10,
                     headers={"User-Agent": "Mozilla/5.0"})
    r.raise_for_status()
    data = r.json()
    result = "".join(part[0] for part in data[0] if part[0])
    if not result:
        raise Exception("Empty response")
    return result

def _mymemory(text, src, tgt):
    url = f"https://api.mymemory.translated.net/get?q={requests.utils.quote(text)}&langpair={src}|{tgt}"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    result = r.json().get("responseData", {}).get("translatedText", "")
    if result and result.upper() != text.upper():
        return result
    raise Exception("MyMemory returned empty")

def translate(text: str, src_lang: str, tgt_lang: str) -> str:
    if not text.strip() or src_lang == tgt_lang:
        return text
    src = src_lang if src_lang and src_lang != "auto" else "auto"
    tgt = tgt_lang

    for fn in [_google, _mymemory]:
        try:
            result = fn(text, src, tgt)
            if result:
                print(f"[Translator] OK via {fn.__name__}")
                return result
        except Exception as e:
            print(f"[Translator] {fn.__name__} failed: {e}")

    return text
