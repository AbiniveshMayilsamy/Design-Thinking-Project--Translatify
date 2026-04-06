import os, uuid, subprocess

FFMPEG_PATH = r"C:\Users\Admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"

def _ffmpeg():
    import shutil
    return FFMPEG_PATH if os.path.exists(FFMPEG_PATH) else (shutil.which("ffmpeg") or "ffmpeg")

def extract_audio(video_path: str, output_dir: str) -> str:
    filename = f"audio_{uuid.uuid4().hex}.wav"
    output_path = os.path.join(output_dir, filename)
    cmd = [
        _ffmpeg(), "-y", "-i", video_path,
        "-vn", "-acodec", "pcm_s16le",
        "-ar", "16000", "-ac", "1",
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        err = result.stderr
        if "moov atom" in err or "Invalid data" in err:
            raise ValueError("Video file is corrupted or incomplete. Please re-download and try again.")
        if "no audio" in err.lower() or "does not contain" in err.lower():
            raise ValueError("Video has no audio track.")
        raise ValueError(f"ffmpeg error: {err[-300:]}")
    if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
        raise ValueError("Audio extraction produced empty file. Video may have no audio.")
    return output_path

def get_video_duration(video_path: str) -> float:
    cmd = [
        _ffmpeg().replace("ffmpeg.exe", "ffprobe.exe").replace("ffmpeg", "ffprobe"),
        "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", video_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return float(result.stdout.strip())
    except Exception:
        return 0.0
