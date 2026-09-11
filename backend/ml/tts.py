import os
import uuid
import boto3
from botocore.exceptions import BotoCoreError, ClientError

# Amazon Polly voice mapping (Neural voices where available)
POLLY_VOICE_MAP = {
    "en":  "Joanna",   # English (US)   - Neural
    "fr":  "Lea",      # French          - Neural
    "de":  "Vicki",    # German          - Neural
    "es":  "Lupe",     # Spanish (US)    - Neural
    "it":  "Bianca",   # Italian         - Neural
    "pt":  "Camila",   # Portuguese (BR) - Neural
    "nl":  "Laura",    # Dutch           - Neural
    "ru":  "Tatyana",  # Russian         - Standard
    "zh":  "Zhiyu",    # Chinese         - Neural
    "ja":  "Takumi",   # Japanese        - Neural
    "ar":  "Zeina",    # Arabic          - Standard
    "hi":  "Aditi",    # Hindi           - Standard
    "ko":  "Seoyeon",  # Korean          - Neural
    "tr":  "Filiz",    # Turkish         - Standard
    "pl":  "Ola",      # Polish          - Neural
    "sv":  "Astrid",   # Swedish         - Standard
    "da":  "Naja",     # Danish          - Standard
    "nb":  "Liv",      # Norwegian       - Standard
    "cy":  "Gwyneth",  # Welsh           - Standard
    "ro":  "Carmen",   # Romanian        - Standard
    "cs":  "Jitka",    # Czech           - Neural (new)
    "uk":  "Joanna",   # Ukrainian fallback → English
    "vi":  "Joanna",   # Vietnamese fallback → English
    "th":  "Joanna",   # Thai fallback → English
    "id":  "Joanna",   # Indonesian fallback → English
    "ms":  "Joanna",   # Malay fallback → English
    "he":  "Joanna",   # Hebrew fallback → English
    "fa":  "Joanna",   # Persian fallback → English
    "bn":  "Joanna",   # Bengali fallback → English
    "ta":  "Joanna",   # Tamil fallback → English
}

# Neural-supported voices (use Engine="neural" for these)
NEURAL_VOICES = {
    "Joanna", "Lea", "Vicki", "Lupe", "Bianca", "Camila",
    "Laura", "Zhiyu", "Takumi", "Seoyeon", "Ola"
}

def synthesize(text: str, lang: str, output_dir: str) -> str:
    """Synthesize speech using Amazon Polly. Falls back to gTTS if Polly unavailable."""
    if not text or not text.strip():
        return None

    voice_id = POLLY_VOICE_MAP.get(lang, "Joanna")
    engine   = "neural" if voice_id in NEURAL_VOICES else "standard"
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    output_path = os.path.join(output_dir, filename)

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
            print(f"[Polly] Synthesized with voice={voice_id} engine={engine}")
            return filename

    except (BotoCoreError, ClientError) as polly_err:
        print(f"[Polly] Error ({polly_err}), falling back to gTTS")

    except Exception as e:
        print(f"[Polly] Unexpected error ({e}), falling back to gTTS")

    # ── gTTS Fallback ──────────────────────────────────────────────────────────
    try:
        from gtts import gTTS
        GTTS_LANG_MAP = {
            "en": "en", "fr": "fr", "de": "de", "es": "es", "it": "it",
            "pt": "pt", "nl": "nl", "ru": "ru", "zh": "zh-CN", "ja": "ja",
            "ar": "ar", "hi": "hi", "ko": "ko", "tr": "tr", "pl": "pl",
            "sv": "sv", "da": "da", "fi": "fi", "cs": "cs", "ro": "ro",
            "uk": "uk", "vi": "vi", "th": "th", "id": "id", "ms": "ms",
            "he": "iw", "fa": "fa", "bn": "bn", "ta": "ta",
        }
        gtts_lang = GTTS_LANG_MAP.get(lang, "en")
        tts = gTTS(text=text, lang=gtts_lang, slow=False)
        tts.save(output_path)
        print(f"[gTTS] Fallback synthesized lang={gtts_lang}")
        return filename
    except Exception as gtts_err:
        print(f"[gTTS] Fallback also failed: {gtts_err}")
        return None
