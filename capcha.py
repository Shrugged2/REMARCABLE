import json
import random

# We could load different .json files based on user input. Like we could ask them their
# age and then supply relevant quotes to them based on the decade they probably interacted
# with pop culture the most. could also sort by media, music, movies, books, etc.

def load_captchas(filename="quotes.json"):
    """Loads CAPTCHA phrases from JSON file."""
    try:
        with open(filename, "r", encoding="utf-8") as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading CAPTCHA data: {e}")
        return []

def get_random_captcha():
    """Selects random CAPTCHA challenge."""
    captchas = load_captchas()
    return random.choice(captchas) if captchas else None

if __name__ == "__main__":
    print(get_random_captcha())  # Test it
