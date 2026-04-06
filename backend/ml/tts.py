from gtts import gTTS
import os, uuid

GTTS_LANG_MAP = {
    "en": "en", "fr": "fr", "de": "de", "es": "es", "it": "it",
    "pt": "pt", "nl": "nl", "ru": "ru", "zh": "zh-CN", "ja": "ja",
    "ar": "ar", "hi": "hi", "ko": "ko", "tr": "tr", "pl": "pl",
    "sv": "sv", "da": "da", "fi": "fi", "cs": "cs", "ro": "ro",
    "uk": "uk", "vi": "vi", "th": "th", "id": "id", "ms": "ms",
    "he": "iw", "fa": "fa", "bn": "bn", "ta": "ta",
}

def synthesize(text: str, lang: str, output_dir: str) -> str:
    if not text.strip():
        return None
    gtts_lang = GTTS_LANG_MAP.get(lang, "en")
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    output_path = os.path.join(output_dir, filename)
    tts = gTTS(text=text, lang=gtts_lang, slow=False)
    tts.save(output_path)
    return filename
