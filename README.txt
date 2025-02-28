Hi
# Meet REMARC-ABLE CAPTCHA – Voice-Based Proof of Humanity
Created at Boko Hacks 2025 | Built by Rick Wilson

## Overview
Traditional CAPTCHAs are outdated, frustrating, and easily bypassed by bots.

# For too long, CAPTCHA systems have been stuck in the past
forcing users to squint at blurry street signs,
click on endless bicycles,
and prove they aren’t robots in the most annoying ways possible.

## introducing
REvolutionary Method of Allowing Comments using Access-Based Linguistic Environment (REMARC-ABLE)

a paradigm changing, voice-based authentication system that ensures only real humans can access your platform.

Instead of battling bots with outdated image recognition,
this system leverages the power of speech
challenging users to complete famous quotes, song lyrics, and iconic phrases using their own voice.

No more tedious clicks or brain teasers, just speak and go.
More intuitive for real users, harder for automated scripts.
CAPTCHAs should be a security feature, not a frustration.


## Upgrade to a REMARC-ABLE CAPTCHA and let your users prove their humanity, without the hassle.



## How It Works
1️⃣ User submits a comment – Triggers a voice CAPTCHA challenge.
2️⃣ They complete a famous quote/song lyric – Speaking the missing phrase.
3️⃣ AI verifies speech – If correct, their comment is posted.
4️⃣ Bots get blocked – Ensuring only humans can engage.


Note: All my testing was through Chrome Browser on desktop. If you have issues, try using chrome.
I tried it on mobile and it thought I was speaking Korean, so.... mobile support not a thing at this time.
More info on the project.

structure.
/remarc-able
│── backend/
│   │── app.py               # Flask backend for handling voice processing (main function)
│   │── captcha.py           # Handles CAPTCHA logic (loads quotes, verification)
│   │── requirements.txt     # Dependencies
│   │── quotes.json          # Stores CAPTCHA phrases
│   │── .env                 # API Key
│   │── .gitignore           # Solves wold hunger. Also ignore temp files and .env
│   │── Procfile             # Heroku based instructions
│   └── static/
│       └── audio/           # Stores temporary user audio files
│
│── frontend/
│   │── index.html           # Webpage with CAPTCHA UI
│   │── script.js            # Handles audio capture & API interaction
│   │── styles.css           # Styles
│
│── README.md                # Instructions
│── LICENSE.txt              # MIT License
│── Notes.txt                # Brainstorm and idea notes
│── .gitignore               # Ignore temp files


Requirements: See requirements.txt in backend file. None for user at this time


---

## Tools & Resources Used

### Core Technologies
- Python (Flask) – Backend API to handle CAPTCHA requests & validation
- JavaScript (Frontend) – Manages user interactions, recording, and data submission
- HTML/CSS – Designed the UI for a clean, user-friendly experience
- Heroku – Deployed backend for live access
- GitHub Pages – Hosted the frontend for public testing

### Voice Processing
- OpenAI Whisper API – Converts speech into text for CAPTCHA verification
- MediaRecorder API – Captures and processes voice input directly from users

### DevOps & Deployment
- Git/GitHub – Version control
- Heroku CLI – Managed backend deployment
- Environment Variables – Secured API keys via `.env` files

### Additional Libraries
- FuzzyWuzzy – Enables flexible text matching for responses
- Flask-CORS – Manages frontend-backend communication
- Werkzeug – Handles audio file uploads and temporary storage





Github demo site (https://shrugged2.github.io/REMARCABLE/frontend/)

Github repo (https://github.com/Shrugged2/REMARCABLE/tree/main)


🚀 Next Steps and things to continue to work on
- Improve response time & accuracy
- Active listener for microphone cutoff
- Multi-language support
- Different device support
- Enhance usability & accessibility
- Add additional quotes
- Categorize quotes by theme
- Video capcha next?