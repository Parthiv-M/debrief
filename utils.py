import os
from dotenv import load_dotenv

load_dotenv()

def setup_env():
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

def clean_text(text: str) -> str:
    clean_text = text.replace('\n', ' ')
    clean_text = ' '.join(clean_text.split())
    return clean_text.strip()