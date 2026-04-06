import os
import subprocess
import tempfile

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
USE_GROQ = bool(GROQ_API_KEY)

_model = None
_groq_client = None

def _get_whisper():
    global _model
    if _model is None:
        import whisper
        size = os.environ.get("WHISPER_MODEL", "base")
        print(f"[Transcriber] Loading local Whisper model: {size}")
        _model = whisper.load_model(size)
    return _model

def _get_groq():
    global _groq_client
    if _groq_client is None:
        from groq import Groq
        _groq_client = Groq(api_key=GROQ_API_KEY)
    return _groq_client

def transcribe_audio(filepath: str, language: str = None) -> dict:
    if USE_GROQ:
        client = _get_groq()
        with open(filepath, "rb") as f:
            result = client.audio.transcriptions.create(
                file=(os.path.basename(filepath), f),
                model="whisper-large-v3",
                language=language,
                response_format="verbose_json",
            )
        segs = result.segments or []
        segments = [
            {
                "start": s["start"] if isinstance(s, dict) else s.start,
                "end": s["end"] if isinstance(s, dict) else s.end,
                "text": s["text"] if isinstance(s, dict) else s.text,
            }
            for s in segs
        ]
        return {
            "text": result.text,
            "language": result.language or language or "en",
            "segments": segments,
        }
    else:
        model = _get_whisper()
        options = {"language": language} if language else {}
        result = model.transcribe(filepath, **options)
        segments = [
            {"start": round(s["start"], 2), "end": round(s["end"], 2), "text": s["text"].strip()}
            for s in result.get("segments", [])
        ]
        return {
            "text": result["text"].strip(),
            "language": result.get("language", language or "en"),
            "segments": segments,
        }

def transcribe_bytes(audio_bytes: bytes, language: str = None) -> dict:
    FFMPEG_PATH = r"C:\Users\Admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
    ffmpeg = FFMPEG_PATH if os.path.exists(FFMPEG_PATH) else "ffmpeg"

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        tmp.write(audio_bytes)
        webm_path = tmp.name

    if USE_GROQ:
        try:
            return transcribe_audio(webm_path, language)
        finally:
            if os.path.exists(webm_path):
                os.unlink(webm_path)
    else:
        wav_path = webm_path.replace(".webm", ".wav")
        try:
            subprocess.run(
                [ffmpeg, "-y", "-i", webm_path, "-ar", "16000", "-ac", "1", wav_path],
                capture_output=True
            )
            return transcribe_audio(wav_path, language)
        finally:
            for p in [webm_path, wav_path]:
                if os.path.exists(p):
                    os.unlink(p)
