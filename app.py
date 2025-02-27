import openai
import json
import random
import os
from flask import Flask, request, jsonify

openai.api_key = "YOUR_OPENAI_API_KEY"

app = Flask(__name__)

# Load CAPTCHA phrases
def load_captchas():
    with open("quotes.json", "r", encoding="utf-8") as file:
        return json.load(file)

CAPTCHAS = load_captchas()

@app.route("/get-captcha", methods=["GET"])
def get_captcha():
    """Send a random CAPTCHA challenge."""
    captcha = random.choice(CAPTCHAS)
    return jsonify({"quote": captcha["quote"], "id": CAPTCHAS.index(captcha)})

@app.route("/verify", methods=["POST"])
def verify():
    """Validate the user's spoken phrase."""
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files["audio"]
    temp_path = "static/audio/temp.wav"
    audio_file.save(temp_path)

    try:
        # Send to OpenAI Whisper for transcription
        with open(temp_path, "rb") as audio:
            response = openai.Audio.transcribe("whisper-1", audio)

        user_text = response["text"].strip().lower()
        expected_answer = CAPTCHAS[int(request.form["id"])]["answer"].lower()

        # Simple string comparison (can use fuzzy matching)
        is_valid = user_text == expected_answer
        return jsonify({"success": is_valid, "user_text": user_text, "expected": expected_answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(temp_path)  # Clean up temp file

if __name__ == "__main__":
    app.run(debug=True)
