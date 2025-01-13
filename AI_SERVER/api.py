from flask import Flask
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)

@app.route('/<input>', methods=['GET'])
def getRisposta(input):
    # Creazione del messaggio di input
    full_input = [
        {"role": "system", "content": "Sei un consulente di eventi"},
        {"role": "user", "content": input}
    ]
    
    # Avvio della chat con il modello
    stream = ollama.chat(
        model='llama_FastEvent',
        messages=full_input,  # Dovrebbe essere una lista di dizionari con 'role' e 'content'
        stream=True
    )

    # Raccogliamo le risposte dal flusso
    response = ""
    for chunk in stream:
        if 'message' in chunk and 'content' in chunk['message']:
            response += chunk['message']['content']

    # Restituire la risposta finale come JSON
    return {"response": response}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5327, debug=True)
