import os
import uuid
import boto3
from botocore.exceptions import BotoCoreError, ClientError

# Amazon Polly voice mapping (languages natively supported with native scripts)
POLLY_VOICE_MAP = {
    "en": ("Joanna",  "neural"),    # English (US)
    "fr": ("Lea",     "neural"),    # French
    "de": ("Vicki",   "neural"),    # German
    "es": ("Lupe",    "neural"),    # Spanish
    "it": ("Bianca",  "neural"),    # Italian
    "pt": ("Camila",  "neural"),    # Portuguese
    "nl": ("Laura",   "neural"),    # Dutch
    "ru": ("Tatyana", "standard"),  # Russian
    "zh": ("Zhiyu",   "neural"),    # Chinese
    "ja": ("Takumi",  "neural"),    # Japanese
    "ar": ("Zeina",   "standard"),  # Arabic
    "hi": ("Aditi",   "standard"),  # Hindi
    "ko": ("Seoyeon", "neural"),    # Korean
    "tr": ("Filiz",   "standard"),  # Turkish
    "pl": ("Ola",     "neural"),    # Polish
    "sv": ("Astrid",  "standard"),  # Swedish
    "da": ("Naja",    "standard"),  # Danish
    "nb": ("Liv",     "standard"),  # Norwegian
    "ro": ("Carmen",  "standard"),  # Romanian
    "cs": ("Jitka",   "neural"),    # Czech
}

# gTTS full mapping including all Indian and global languages
GTTS_LANG_MAP = {
    "en": "en", "fr": "fr", "de": "de", "es": "es", "it": "it",
    "pt": "pt", "nl": "nl", "ru": "ru", "zh": "zh-CN", "ja": "ja",
    "ar": "ar", "hi": "hi", "ko": "ko", "tr": "tr", "pl": "pl",
    "sv": "sv", "da": "da", "fi": "fi", "cs": "cs", "ro": "ro",
    "uk": "uk", "vi": "vi", "th": "th", "id": "id", "ms": "ms",
    "he": "iw", "fa": "fa", "bn": "bn", "ta": "ta", "ml": "ml",
    "te": "te", "kn": "kn", "gu": "gu", "mr": "mr", "ur": "ur",
}

def synthesize(text: str, lang: str, output_dir: str) -> str:
    """Synthesizes speech using Amazon Polly when language is supported;
    falls back or defaults to gTTS for languages like Malayalam, Telugu, Tamil, etc."""
    if not text or not text.strip():
        return None

    filename = f"tts_{uuid.uuid4().hex}.mp3"
    output_path = os.path.join(output_dir, filename)

    # 1. Try Amazon Polly if language is directly supported
    if lang in POLLY_VOICE_MAP:
        voice_id, engine = POLLY_VOICE_MAP[lang]
        try:
            polly = boto3.client("polly", region_name=os.environ.get("AWS_REGION", "us-east-1"))
            response = polly.synthesize_speech(
                Text=text,
                OutputFormat="mp3",
                VoiceId=voice_id,
                Engine=engine,
            )
            audio_stream = response.get("AudioStream")
            if audio_stream:
                with open(output_path, "wb") as f:
                    f.write(audio_stream.read())
                if os.path.exists(output_path) and os.path.getsize(output_path) > 100:
                    print(f"[Polly] Synthesized speech: lang={lang}, voice={voice_id}, size={os.path.getsize(output_path)} bytes", flush=True)
                    return filename
        except Exception as polly_err:
            print(f"[Polly] Unavailable or error for lang={lang}: {polly_err}, trying gTTS fallback", flush=True)

    # 2. Use gTTS for Indian languages (Malayalam, Tamil, Telugu, etc.) or when Polly fails
    try:
        from gtts import gTTS
        gtts_lang = GTTS_LANG_MAP.get(lang, "en")
        tts = gTTS(text=text, lang=gtts_lang, slow=False)
        tts.save(output_path)
        if os.path.exists(output_path) and os.path.getsize(output_path) > 100:
            print(f"[gTTS] Synthesized speech: lang={gtts_lang}, size={os.path.getsize(output_path)} bytes", flush=True)
            return filename
        else:
            print(f"[gTTS] File created but size is too small or empty", flush=True)
    except Exception as gtts_err:
        print(f"[gTTS] Synthesis failed: {gtts_err}", flush=True)

    if os.path.exists(output_path):
        try:
            os.unlink(output_path)
        except Exception:
            pass

    return None
