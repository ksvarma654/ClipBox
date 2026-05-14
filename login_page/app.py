from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = "k-proj-jJ6hdUR8duCGgATSAj-Ivfr5xNPo_Y68Oz5xGli3PkEBl8pOJ5DNTmrI9sRRos_AuueA4ggLgrT3BlbkFJyqNojeNcwuey6xhWBybTrzgPB37OCLgeT0oNaJd-G2wYPMnD0c7-nDwz7jrwO4Q2WoeyayfqkA"

@app.route('/chat', methods=['POST'])
def chat():
    user_msg = request.json['message']

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for ClipBox shopping website."},
            {"role": "user", "content": user_msg}
        ]
    )

    reply = response['choices'][0]['message']['content']
    return jsonify({"reply": reply})