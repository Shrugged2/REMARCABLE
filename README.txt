Hi
Meet REMARC-ABLE.

REvolutionary Method of Allowing Comments using Access Based Linguistic Environment

For too long, bots have been competing with capchas. selecting pictures of street signs and byclists
These techniques are antequated. Outdated. And frankly annoying

This tool provides a proof of humanity capcha that ensures only real people will ever use your service.





Here is some info on the project.

structure.
/voice-captcha
│── backend/
│   │── app.py               # Flask backend for handling voice processing
│   │── captcha.py           # Handles CAPTCHA logic (loads quotes, verification)
│   │── requirements.txt      # Dependencies
│   │── quotes.json          # Stores CAPTCHA phrases
│   └── static/
│       └── audio/           # (Optional) Stores temporary user audio files
│
│── frontend/
│   │── index.html           # Webpage with CAPTCHA UI
│   │── script.js            # Handles audio capture & API interaction
│   │── styles.css           # Styles for CAPTCHA UI
│
│── README.md                # Instructions
│── run.sh                   # Start backend & frontend (optional)
│── .gitignore                # Ignore temp files


Requirements:
openai → To use OpenAI’s Whisper API for speech-to-text.
SpeechRecognition → Captures audio from the microphone.


Run the following in proj directory
pip install -r requirements.txt


Github demo site

python backend.
html frontend. keep it simple

query a speech to text resource and return value
storage?





    a. Provide a README that includes:
        i. Team member names
            Me.
        ii. Tools and resources used
            ok
        iii. Build and run instructions for the project
            go to (SITE)
            enable microphone permissions
            post comment
            profit?
