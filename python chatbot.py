import spacy
import openai
from flask import Flask, request, jsonify
import requests

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# OpenAI API Key (Replace with your actual API key)
OPENAI_API_KEY = "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"

# Trusted medical sources
MEDICAL_API_URLS = {
    "diseases": "https://api.disease.sh/v3/diseases",
    "symptoms": "https://api.symptom-checker.com/analyze"
}

# Flask API for chatbot
app = Flask(__name__)

def get_medical_info(query):
    """Fetch verified medical information from trusted sources."""
    try:
        response = requests.get(MEDICAL_API_URLS["diseases"], params={"query": query})
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        return {"error": str(e)}

def get_gpt4_response(query):
    """Use GPT-4 API to generate an advanced medical response."""
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    payload = {"model": "gpt-4", "messages": [{"role": "user", "content": query}]}
    response = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
    return response.json()["choices"][0]["message"]["content"] if response.status_code == 200 else "Error fetching response."

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    doc = nlp(user_input)
    
    medical_data = get_medical_info(user_input)
    ai_response = get_gpt4_response(user_input)
    
    return jsonify({
        "verified_medical_info": medical_data,
        "ai_response": ai_response
    })

if __name__ == "__main__":
    app.run(debug=True)
