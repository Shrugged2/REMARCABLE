
# dont use this file. fuck this file

import openai
import speech_recognition as sr
import os
#import capcha

from fuzzywuzzy import fuzz
# from captcha import get_random_captcha
from dotenv import load_dotenv

# Set OpenAI API key
load_dotenv()  # Load .env file
openai.api_key = os.getenv("OPENAI_API_KEY")

def record_voice():
    """Captures user's voice input."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say the missing phrase...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    return audio


def transcribe_audio(audio):
    """Sends the audio to OpenAI Whisper API for transcription."""
    try:
        print("Transcribing...")
        audio_data = audio.get_wav_data()
        response = openai.Audio.transcribe("whisper-1", audio_data)
        return response['text'].strip().lower()
    except Exception as e:
        print(f"Error transcribing: {e}")
        return None


def validate_response(user_input, expected_answer):
    """Uses fuzzy matching to validate user's spoken response."""
    similarity = fuzz.ratio(user_input, expected_answer)
    print(f"Match score: {similarity}%")
    return similarity > 80  # Accept if similarity > 80%


def main():
    captcha = get_random_captcha()
    if not captcha:
        print("No CAPTCHA available.")
        return

    print(f"Complete this phrase: {captcha['quote']}")

    audio = record_voice()
    user_response = transcribe_audio(audio)

    if user_response and validate_response(user_response, captcha['answer']):
        print("✅ CAPTCHA passed! You are human.")
    else:
        print("🤨 CAPTCHA failed. Nice try robot.")


if __name__ == "__main__":
    main()
