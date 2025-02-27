import openai
import json
import random
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Load CAPTCHA phrases
def load_captchas():
    with open("quotes.json", "r", encoding="utf-8") as file:
        return json.load(file)

CAPTCHAS = load_captchas()
COMMENTS = []  # Store comments in memory (replace with database if needed)

@app.route("/get-captcha", methods=["GET"])
def get_captcha():
    """Send a random CAPTCHA challenge."""
    captcha = random.choice(CAPTCHAS)
    return jsonify({"quote": captcha["quote"], "id": CAPTCHAS.index(captcha)})

@app.route("/submit-comment", methods=["POST"])
def submit_comment():
    """Receives a comment and triggers CAPTCHA verification."""
    data = request.json
    user_comment = data.get("comment", "").strip()

    if not user_comment:
        return jsonify({"error": "Comment cannot be empty"}), 400

    # Generate CAPTCHA for the user
    captcha = random.choice(CAPTCHAS)
    return jsonify({
        "captcha": captcha["quote"],
        "captcha_id": CAPTCHAS.index(captcha),
        "comment": user_comment
    })

@app.route("/verify", methods=["POST"])
def verify():
    """Validates the user's spoken response against the CAPTCHA."""
    if "audio" not in request.files or "id" not in request.form:
        return jsonify({"error": "Missing audio file or CAPTCHA ID"}), 400

    audio_file = request.files["audio"]
    captcha_id = int(request.form["id"])
    temp_path = "static/audio/temp.wav"
    audio_file.save(temp_path)

    try:
        # Send to OpenAI Whisper for transcription
        with open(temp_path, "rb") as audio:
            response = openai.Audio.transcribe("whisper-1", audio)

        user_text = response["text"].strip().lower()
        expected_answer = CAPTCHAS[captcha_id]["answer"].lower()

        # Compare with fuzzy matching
        is_valid = user_text == expected_answer

        if is_valid:
            # Store the comment
            COMMENTS.append({"username": "You", "comment": request.form["comment"]})
            return jsonify({"success": True, "comments": COMMENTS})

        return jsonify({"success": False, "user_text": user_text, "expected": expected_answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(temp_path)  # Clean up temp file

@app.route("/get-comments", methods=["GET"])
def get_comments():
    """Returns all stored comments."""
    return jsonify(COMMENTS)

if __name__ == "__main__":
    app.run(debug=True)
